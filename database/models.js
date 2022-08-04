const pool = require("./db");

const getQuestions = (product_id, page = 1, count = 5) => {
  const pageNumber = count * (page - 1);
  let getQuestionsQuery = {
    text: `SELECT json_agg(t.json_build_object) FROM (SELECT(json_build_object(
              'question_id', q.id,
              'question_body', q.body,
              'question_date', q.date_written,
              'asker_name', q.asker_name,
              'question_helpfulness', q.helpful,
              'reported', q.reported,
              'answers', (select json_object_agg(id, json_build_object(
                  'id', a.id,
                  'body', a.body,
                  'date', a.date_written,
                  'answerer_name', a.answerer_name,
                  'helpfulness', a.helpful,
                  'photos', (select coalesce(json_agg(photo),'[]') from
                  (select id, url from "Answers_photos" ph where answer_id = a.id) as photo)))
                 from "Answers" a where a.question_id = q.id)
              )) from "Questions" q where q.product_id = $1 AND q.reported = 0  OFFSET $2 LIMIT $3) t`,
    values: [product_id, pageNumber, count],
  };

  return pool
    .query(getQuestionsQuery)
    .then((res) => {
      return res.rows;
    })
    .catch((err) => console.log(err));
};

//GET Answers
const getAnswers = (question_id, page = 1, count = 5) => {
  const pageNumber = count * (page - 1);
  const getAnswersQuery = {
    text: `SELECT json_agg(t.json_build_object)
              FROM (SELECT (json_build_object(
                  'answer_id', a.id,
                  'body', a.body,
                  'date', a.date_written,
                  'answerer_name', a.answerer_name,
                  'helpfulness', a.helpful,
                  'photos', (select coalesce(json_agg(photo),'[]') from
                      (select id, url from "Answers_photos" ph where answer_id = a.id) as photo)))
                        from "Answers" a where a.question_id = $1 AND a.reported = 0 OFFSET $2 LIMIT $3) t`,
    values: [question_id, pageNumber, count],
  };
  return pool
    .query(getAnswersQuery)
    .then((res) => {
      return res.rows;
    })
    .catch((err) => console.log(err));
};

//add Question
const addQuestion = ({ body, name, email, product_id }) => {
  const date = new Date().getTime();
  const productId = parseInt(product_id);
  const addQuestionQuery = `INSERT INTO "Questions" (product_id, body, asker_name, asker_email, date_written, reported, helpful)
    VALUES ('${productId}', '${body}', '${name}', '${email}', '${date}', 0, 0)
    RETURNING *`;
  return pool
    .query(addQuestionQuery)
    .then((res) => {
      return res.rows;
    })
    .catch((err) => console.log(err));
};

//add Answer
const addAnswer = (question_id, body, name, email, photos) => {
  const date = new Date().getTime();
  const addAnswerQuery = `INSERT INTO "Answers" (question_id, body, date_written, answerer_name, answerer_email, reported, helpful)
    VALUES ('${question_id}', '${body}', '${date}', '${name}', '${email}', 0, 0)
    RETURNING *`;
  return pool
    .query(addAnswerQuery)
    .then((res) => {
      const answer_id = res.rows[0].id;
      const addAnswerPhotoQuery = `INSERT INTO "Answers_photos" (answer_id, url)
      VALUES ('${answer_id}', unnest(array${photos}))
      RETURNING *`;
      pool.query(addAnswerPhotoQuery);
    })
    .then((data) => {
      return "Inserted successfully";
    })
    .catch((err) => console.log(err));
};

const markQuestion = (question_id) => {
  return pool
    .query(`UPDATE "Questions" SET helpful = helpful + 1 WHERE id = $1`, [
      question_id,
    ])
    .then((res) => {
      return "Updated successfully";
    })
    .catch((err) => console.log(err));
};

const reportQuestion = (question_id) => {
  return pool
    .query(`UPDATE "Questions" SET reported = 1 WHERE id = $1`, [question_id])
    .then((res) => {
      return "Reported successfully";
    })
    .catch((err) => console.log(err));
};

const markAnswer = (answer_id) => {
  return pool
    .query(`UPDATE "Answers" SET helpful = helpful + 1 WHERE id = $1`, [
      answer_id,
    ])
    .then((res) => {
      return "Updated successfully";
    })
    .catch((err) => console.log(err));
};

const reportAnswer = (answer_id) => {
  return pool
    .query(`UPDATE "Answers" SET reported = 1 WHERE id = $1`, [answer_id])
    .then((res) => {
      return "Reported successfully";
    })
    .catch((err) => console.log(err));
};

module.exports = {
  getQuestions,
  getAnswers,
  addQuestion,
  addAnswer,
  markQuestion,
  reportQuestion,
  markAnswer,
  reportAnswer
};
