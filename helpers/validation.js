const { body, param, query } = require("express-validator");

const idValidator = () =>
  param("id")
    .notEmpty()
    .withMessage("ID must be a number")
    .isInt({ min: 1 })
    .withMessage("ID must be a positive integer");

const titleValidator = () =>
  body("title")
    .notEmpty()
    .withMessage("title is required")
    .isString()
    .withMessage("title must be a string")
    .isLength({ max: 50 })
    .withMessage("title length can not exceed 50");

const contentValidator = () =>
  body("content")
    .notEmpty()
    .withMessage("content is required")
    .isString()
    .withMessage("content must be a string")
    .isLength({ max: 10000 })
    .withMessage("content length can not exceed 10000");

const categoryValidator = () =>
  body("category")
    .notEmpty()
    .withMessage("category is required")
    .isString()
    .withMessage("category must be a string")
    .isLength({ max: 30 })
    .withMessage("category length can not exceed 30");

const tagsValidator = () =>
  body("tags")
    .notEmpty()
    .withMessage("tags is required")
    .isArray({ min: 1 })
    .withMessage("tags must be a non-empty array");

const tagsItemsValidator = () =>
  body("tags.*")
    .isString()
    .withMessage("tags items must be strings")
    .isLength({ max: 30 })
    .withMessage("tags items length can not exceed 30");

const termValidator = () =>
  query("term")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("term must have a value if provided")
    .isString()
    .withMessage("term must be a string")
    .isLength({ max: 500 })
    .withMessage("term length can not exceed 500");

const createPostValidator = () => [
  titleValidator(),
  contentValidator(),
  categoryValidator(),
  tagsValidator(),
  tagsItemsValidator(),
];

const updatePostValidator = () => [
  idValidator(),
  titleValidator().optional(),
  contentValidator().optional(),
  categoryValidator().optional(),
  tagsValidator().optional(),
  tagsItemsValidator().optional(),
];

module.exports = {
  idValidator,
  termValidator,
  createPostValidator,
  updatePostValidator,
};
