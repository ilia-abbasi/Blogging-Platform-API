const { pool } = require("../models/db.js");
const { makeResponseObj } = require("../models/response.js");

async function createPost(req, res) {
  const title = req.body.title;
  const content = req.body.content;
  const category = req.body.category;
  const tags = req.body.tags;

  if (!title || !content || !category || !tags || !tags.length) {
    const resObj = makeResponseObj(
      false,
      "title, content, category and tags are all mandatory"
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

  const query = `
  INSERT INTO posts (title, content, category, tags, created_at, updated_at)
  VALUES ($1, $2, $3, $4, NOW(), NOW())
  RETURNING *;
  `;

  let result;

  try {
    result = await pool.query(query, [title, content, category, tags]);
    console.log(`Database: Inserted post with an ID of ${result.rows[0].id}`);
  } catch (err) {
    console.log(`Database: Could not insert post. ${err}`);
    const resObj = makeResponseObj(
      false,
      "Something went wrong while completing your request"
    );
    return res.status(500).send(resObj);
  }

  const resObj = makeResponseObj(true, "Created post", result.rows[0]);

  return res.status(201).send(resObj);
}

module.exports = { createPost };
