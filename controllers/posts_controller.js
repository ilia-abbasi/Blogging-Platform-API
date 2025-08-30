const { pool } = require("../models/db.js");
const { makeResponseObj } = require("../models/response.js");
const {
  validateTitle,
  validateContent,
  validateCategory,
  validateTags,
  validateID,
} = require("../helpers/validation.js");

async function createPost(req, res) {
  const title = req.body.title;
  const content = req.body.content;
  const category = req.body.category;
  const tags = req.body.tags;
  const validationResults = [];

  validationResults.push(validateTitle(title));
  validationResults.push(validateContent(content));
  validationResults.push(validateCategory(category));
  validationResults.push(validateTags(tags));

  for (const validationResult of validationResults) {
    if (validationResult === "success") {
      continue;
    }

    const resObj = makeResponseObj(false, validationResult);
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

async function updatePost(req, res) {
  const id = req.params.id;
  const title = req.body.title;
  const content = req.body.content;
  const category = req.body.category;
  const tags = req.body.tags;
  const validationResults = [];
  const providedParams = {};

  validationResults.push(validateID(id));
  if (title) {
    validationResults.push(validateContent(title));
    providedParams.title = title;
  }
  if (content) {
    validationResults.push(validateContent(content));
    providedParams.content = content;
  }
  if (category) {
    validationResults.push(validateContent(category));
    providedParams.category = category;
  }
  if (tags) {
    validationResults.push(validateContent(tags));
    providedParams.tags = tags;
  }

  for (const validationResult of validationResults) {
    if (validationResult === "success") {
      continue;
    }

    const resObj = makeResponseObj(false, validationResult);
    return res.status(400).send(resObj);
  }

  let query = ""; // temp
}

module.exports = {
  createPost,
  updatePost,
};
