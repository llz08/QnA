const express = require("express");
const app = express();
const { getQuestions, getAnswers, addQuestion, addAnswer, markQuestion, reportQuestion, markAnswer, reportAnswer } = require("../database/models");
require("dotenv").config();

//MIDDLEWARE
app.use(express.json());

//ROUTES
//Questions
app.get("/qa/questions", (req, res) => {
  const { product_id, page, count } = req.query;
  const response = {};
  response.product_id = product_id;
  getQuestions(product_id, page, count)
    .then((data) => {
      response.results = data[0].json_agg;
      res.send(response);
    })
    .catch((err) => console.log(err));
});

//Answers List
app.get(`/qa/questions/:question_id/answers`, (req, res) => {
  const question_id = req.params.question_id;
  const { page, count } = req.query;
  getAnswers(question_id, page, count)
    .then((data) => {
      res.send({
        questions: question_id,
        page: page,
        count: count,
        results: data[0].json_agg,
      });
    })
    .catch((err) => console.log(err));
});

//Add Quesions
app.post(`/qa/questions`, (req, res) => {
  addQuestion(req.body)
  .then(data=>res.sendStatus(201))
  .catch(err=>console.log(err))
});

//Add Answer
app.post(`/qa/questions/:question_id/answers`, (req, res) => {
  const question_id = req.params.question_id;
  const { body, name, email, photos } = req.body;
  addAnswer(question_id, body, name, email, photos)
  .then(data=>res.sendStatus(201))
  .catch(err=>console.log(err))
});

//Mark Question as Helpful
app.put(`/qa/questions/:question_id/helpful`, (req, res) => {
  markQuestion(req.params.question_id)
  .then(data=>res.send(data))
  .catch(err=>console.log(err))
});

//Report Question
app.put(`/qa/questions/:question_id/report`, (req, res) => {
  reportQuestion(req.params.question_id)
  .then(data=>res.send(data))
  .catch(err=>console.log(err))
});

//Mark Answer as Helpful
app.put(`/qa/answers/:answer_id/helpful`, (req, res) => {
  markAnswer(req.params.answer_id)
  .then(data=>res.send(data))
  .catch(err=>console.log(err))
});

//Report Answer
app.put(`/qa/answers/:answer_id/report`, (req, res) => {
  reportQuestion(req.params.answer_id)
  .then(data=>res.send(data))
  .catch(err=>console.log(err))
});

//loader.io
app.get(`/loaderio-109fa06a88f79ba98ba6b9ca4b72f3fe`, (req, res) => {
  res.sendFile(__dirname + '/loaderio-109fa06a88f79ba98ba6b9ca4b72f3fe.txt')
})

app.listen(process.env.PORT, () => {
  console.log(`Server listening at ${process.env.PORT}`);
});
