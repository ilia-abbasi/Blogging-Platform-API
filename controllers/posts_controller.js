const { isEmpty } = require("lodash");
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
  const id = Number(req.params.id);
  const title = req.body.title;
  const content = req.body.content;
  const category = req.body.category;
  const tags = req.body.tags;
  const validationResults = [];
  const providedParams = {};

  validationResults.push(validateID(id));
  if (title) {
    validationResults.push(validateTitle(title));
    providedParams.title = title;
  }
  if (content) {
    validationResults.push(validateContent(content));
    providedParams.content = content;
  }
  if (category) {
    validationResults.push(validateCategory(category));
    providedParams.category = category;
  }
  if (tags) {
    validationResults.push(validateTags(tags));
    providedParams.tags = tags;
  }

  if (isEmpty(providedParams)) {
    const resObj = makeResponseObj(
      false,
      "At least one parameter must be provided to update the post"
    );

    return res.status(400).send(resObj);
  }

  for (const validationResult of validationResults) {
    if (validationResult === "success") {
      continue;
    }

    const resObj = makeResponseObj(false, validationResult);
    return res.status(400).send(resObj);
  }

  let query = "UPDATE posts SET ";
  let i = 1;
  for (const key in providedParams) {
    query = `${query}${key} = $${i}, `;
    i++;
  }
  query = query.slice(0, -2);
  query = `${query} WHERE id = $${i};`;

  let result;
  try {
    result = await pool.query(query, [...Object.values(providedParams), id]);

    console.log(`Database: Updated post with an ID of ${id}`);
  } catch (err) {
    console.log(`Database: Could not update post. ${err}`);

    const resObj = makeResponseObj(
      false,
      "Something went wrong while completing your request"
    );

    return res.status(500).send(resObj);
  }

  const resObj = makeResponseObj(true, "Updated post");

  return res.status(200).send(resObj);
}

module.exports = {
  createPost,
  updatePost,
};
