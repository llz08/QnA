CREATE TABLE "Questions"(
    "id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "body" VARCHAR(255) NOT NULL,
    "date_written" BIGINT NOT NULL,
    "asker_name" VARCHAR(255) NOT NULL,
    "asker_email" VARCHAR(255) NOT NULL,
    "reported" INTEGER NOT NULL,
    "helpful" INTEGER NULL
);
ALTER TABLE
    "Questions" ADD PRIMARY KEY("id");
CREATE TABLE "Answers"(
    "id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "body" VARCHAR(255) NOT NULL,
    "date_written" BIGINT NOT NULL,
    "answerer_name" VARCHAR(255) NOT NULL,
    "answerer_email" VARCHAR(255) NOT NULL,
    "reported" INTEGER NOT NULL,
    "helpful" INTEGER NULL
);
ALTER TABLE
    "Answers" ADD PRIMARY KEY("id");
CREATE TABLE "Answers_photos"(
    "id" INTEGER NOT NULL,
    "answer_id" INTEGER NOT NULL,
    "url" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "Answers_photos" ADD PRIMARY KEY("id");
ALTER TABLE
    "Answers" ADD CONSTRAINT "answers_question_id_foreign" FOREIGN KEY("question_id") REFERENCES "Questions"("id");
ALTER TABLE
    "Answers_photos" ADD CONSTRAINT "answers_photos_answer_id_foreign" FOREIGN KEY("answer_id") REFERENCES "Answers"("id");