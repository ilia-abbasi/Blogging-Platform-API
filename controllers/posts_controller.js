const { pool } = require("./models/db.js");
const { makeResponseObj } = require("../models/response.js");

function createPost(req, res) {
  const title = req.body.title;
  const content = req.body.content;
  const category = req.body.category;
  const tags = req.body.tags;

  if (!title) {
    const resObj = makeResponseObj(
      false,
      "Title is required but was not provided"
    );
    return res.status(422).send(resObj);
  }

  if (!content) {
    const resObj = makeResponseObj(
      false,
      "Content is required but was not provided"
    );
    return res.status(422).send(resObj);
  }

  if (!category) {
    const resObj = makeResponseObj(
      false,
      "Category is required but was not provided"
    );
    return res.status(422).send(resObj);
  }

  if (!tags) {
    const resObj = makeResponseObj(
      false,
      "Tags is required but was not provided"
    );
    return res.status(422).send(resObj);
  }

  if (title.length > 50 || title.length < 1) {
    const resObj = makeResponseObj(
      false,
      "Title length can only be from 1 to 50"
    );
    return res.status(400).send(resObj);
  }

  if (content.length > 10000 || content.length < 1) {
    const resObj = makeResponseObj(
      false,
      "Content length can only be from 1 to 10000"
    );
    return res.status(400).send(resObj);
  }

  if (category.length > 30 || category.length < 1) {
    const resObj = makeResponseObj(
      false,
      "Category length can only be from 1 to 30"
    );
    return res.status(400).send(resObj);
  }
}

module.exports = { createPost };
