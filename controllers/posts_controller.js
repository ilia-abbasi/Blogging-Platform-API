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
const { matchedData, validationResult } = require("express-validator");

async function createPost(req, res, next) {
  const validationErrors = validationResult(req).errors;

  if (!isEmpty(validationErrors)) {
    const resObj = makeResponseObj(false, validationErrors[0].msg);

    return res.status(400).json(resObj);
  }

  const { title, content, category, tags } = matchedData(req);

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

    next(err);
    return;
  }

  const resObj = makeResponseObj(true, "Created post", result.rows[0]);

  return res.status(201).json(resObj);
}

async function updatePost(req, res, next) {
  const validationErrors = validationResult(req).errors;

  if (!isEmpty(validationErrors)) {
    const resObj = makeResponseObj(false, validationErrors[0].msg);

    return res.status(400).json(resObj);
  }

  const data = matchedData(req);

  if (Object.keys(data).length < 2) {
    const resObj = makeResponseObj(
      false,
      "At least one parameter must be provided to update the post"
    );

    return res.status(400).json(resObj);
  }

  let query = "UPDATE posts SET updated_at = NOW(), ";
  let i = 1;
  for (const key in data) {
    if (key === "id") continue;
    query = `${query}${key} = $${i}, `;
    i++;
  }
  query = query.slice(0, -2);
  query = `${query} WHERE id = $${i} RETURNING *;`;

  let result;
  try {
    result = await pool.query(query, [
      ...Object.values(data).slice(1),
      data.id,
    ]);
  } catch (err) {
    console.log(`Database: Could not update post. ${err}`);

    next(err);
    return;
  }

  if (isEmpty(result.rows[0])) {
    console.log(`Database: No posts found with an ID of ${data.id}`);

    const resObj = makeResponseObj(false, "Post was not found");

    return res.status(404).json(resObj);
  }

  console.log(`Database: Updated post with an ID of ${data.id}`);

  const resObj = makeResponseObj(true, "Updated post", result.rows[0]);

  return res.status(200).json(resObj);
}

async function deletePost(req, res, next) {
  const id = Number(req.params.id);
  const validationResult = validateID(id);

  if (validationResult !== "success") {
    const resObj = makeResponseObj(false, validationResult);

    return res.status(400).json(resObj);
  }

  const query = "DELETE FROM posts WHERE id = $1;";
  let result;
  try {
    result = await pool.query(query, [id]);
  } catch (err) {
    console.log(`Database: Could not delete post. ${err}`);

    next(err);
    return;
  }

  if (!result.rowCount) {
    console.log(`Database: No posts found with an ID of ${id}`);

    const resObj = makeResponseObj(false, "Post was not found");

    return res.status(404).json(resObj);
  }

  console.log(`Database: Deleted post with an ID of ${id}`);

  const resObj = makeResponseObj(true, "Deleted post");

  return res.status(204).json(resObj);
  // resObj will be discarded anyway but I will keep this code
}

async function getSinglePost(req, res, next) {
  const id = Number(req.params.id);
  const validationResult = validateID(id);

  if (validationResult !== "success") {
    const resObj = makeResponseObj(false, validationResult);

    return res.status(400).json(resObj);
  }

  const query = "SELECT * FROM posts WHERE id = $1;";
  let result;
  try {
    result = await pool.query(query, [id]);
  } catch (err) {
    console.log(`Database: Could not get post. ${err}`);

    next(err);
    return;
  }

  if (isEmpty(result.rows[0])) {
    console.log(`Database: No posts found with an ID of ${id}`);

    const resObj = makeResponseObj(false, "Post was not found");

    return res.status(404).json(resObj);
  }

  console.log(`Database: Got post with an ID of ${id}`);

  const resObj = makeResponseObj(true, "Got post", result.rows[0]);

  return res.status(200).json(resObj);
}

async function getPosts(req, res, next) {
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

    next(err);
    return;
  }

  let message = "Got posts";
  if (isEmpty(result.rows)) {
    message = "No matches";
  }
  console.log(`Database: ${message}`);

  const resObj = makeResponseObj(true, message, result.rows);

  return res.status(200).json(resObj);
}

module.exports = {
  createPost,
  updatePost,
  deletePost,
  getSinglePost,
  getPosts,
};
