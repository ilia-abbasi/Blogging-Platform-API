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

  let query = "UPDATE posts SET updated_at = NOW(), ";
  let i = 1;
  for (const key in providedParams) {
    query = `${query}${key} = $${i}, `;
    i++;
  }
  query = query.slice(0, -2);
  query = `${query} WHERE id = $${i} RETURNING *;`;

  let result;
  try {
    result = await pool.query(query, [...Object.values(providedParams), id]);
  } catch (err) {
    console.log(`Database: Could not update post. ${err}`);

    const resObj = makeResponseObj(
      false,
      "Something went wrong while completing your request"
    );

    return res.status(500).send(resObj);
  }

  if (isEmpty(result.rows[0])) {
    console.log(`Database: No posts found with an ID of ${id}`);

    const resObj = makeResponseObj(false, "Post was not found");

    return res.status(404).send(resObj);
  }

  console.log(`Database: Updated post with an ID of ${id}`);

  const resObj = makeResponseObj(true, "Updated post", result.rows[0]);

  return res.status(200).send(resObj);
}

async function deletePost(req, res) {
  const id = Number(req.params.id);
  const validationResult = validateID(id);

  if (validationResult !== "success") {
    const resObj = makeResponseObj(false, validationResult);

    return res.status(400).send(resObj);
  }

  const query = "DELETE FROM posts WHERE id = $1;";
  let result;
  try {
    result = await pool.query(query, [id]);
  } catch (err) {
    console.log(`Database: Could not delete post. ${err}`);

    const resObj = makeResponseObj(
      false,
      "Something went wrong while completing your request"
    );

    return res.status(500).send(resObj);
  }

  if (!result.rowCount) {
    console.log(`Database: No posts found with an ID of ${id}`);

    const resObj = makeResponseObj(false, "Post was not found");

    return res.status(404).send(resObj);
  }

  console.log(`Database: Deleted post with an ID of ${id}`);

  const resObj = makeResponseObj(true, "Deleted post");

  return res.status(204).send(resObj);
  // resObj will be discarded anyway but I will keep this code
}

async function getSinglePost(req, res) {
  const id = Number(req.params.id);
  const validationResult = validateID(id);

  if (validationResult !== "success") {
    const resObj = makeResponseObj(false, validationResult);

    return res.status(400).send(resObj);
  }

  const query = "SELECT * FROM posts WHERE id = $1;";
  let result;
  try {
    result = await pool.query(query, [id]);
  } catch (err) {
    console.log(`Database: Could not get post. ${err}`);

    const resObj = makeResponseObj(
      false,
      "Something went wrong while completing your request"
    );

    return res.status(500).send(resObj);
  }

  if (isEmpty(result.rows[0])) {
    console.log(`Database: No posts found with an ID of ${id}`);

    const resObj = makeResponseObj(false, "Post was not found");

    return res.status(404).send(resObj);
  }

  console.log(`Database: Got post with an ID of ${id}`);

  const resObj = makeResponseObj(true, "Got post", result.rows[0]);

  return res.status(200).send(resObj);
}

async function getPosts(req, res) {
  let query = "SELECT * FROM posts";
  const term = req.query.term;

  if (term) {
    query = `
    ${query} WHERE title ILIKE $1
    OR content ILIKE $1
    OR category ILIKE $1
    `;
  }

  query = `${query};`;
  let result;
  try {
    result = term
      ? await pool.query(query, [`%${term}%`])
      : await pool.query(query);
  } catch (err) {
    console.log(`Database: Could not get posts. ${err}`);

    const resObj = makeResponseObj(
      false,
      "Something went wrong while completing your request"
    );

    return res.status(500).send(resObj);
  }

  let message = "Got posts";
  if (isEmpty(result.rows)) {
    message = "No matches";
  }
  console.log(`Database: ${message}`);

  const resObj = makeResponseObj(true, message, result.rows);

  return res.status(200).send(resObj);
}

module.exports = {
  createPost,
  updatePost,
  deletePost,
  getSinglePost,
  getPosts,
};
