// Base route: /posts

const express = require("express");
const {
  createPost,
  updatePost,
  deletePost,
  getSinglePost,
  getPosts,
} = require("../controllers/posts_controller");
const { send404Error, send405Error } = require("../models/response");
const {
  titleValidator,
  contentValidator,
  categoryValidator,
  tagsValidator,
  tagsItemsValidator,
  idValidator,
} = require("../helpers/validation");
const router = express.Router();

router.get("/", getPosts);
router.post(
  "/",
  [
    titleValidator(),
    contentValidator(),
    categoryValidator(),
    tagsValidator(),
    tagsItemsValidator(),
  ],
  createPost
);
router.all("/", send405Error(["GET", "POST"]));

router.get("/:id", idValidator(), getSinglePost);
router.put(
  "/:id",
  [
    idValidator(),
    titleValidator(),
    contentValidator(),
    categoryValidator(),
    tagsValidator(),
    tagsItemsValidator(),
  ],
  updatePost
);
router.delete("/:id", idValidator(), deletePost);
router.all("/:id", send405Error(["GET", "PUT", "DELETE"]));

router.all("/{*anything}", send404Error);

module.exports = router;
