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
  createPostValidator,
  updatePostValidator,
} = require("../helpers/validation");
const router = express.Router();

router.get("/", getPosts);
router.post("/", createPostValidator(), createPost);
router.all("/", send405Error(["GET", "POST"]));

router.get("/:id", getSinglePost);
router.put("/:id", updatePostValidator(), updatePost);
router.delete("/:id", deletePost);
router.all("/:id", send405Error(["GET", "PUT", "DELETE"]));

router.all("/{*anything}", send404Error);

module.exports = router;
