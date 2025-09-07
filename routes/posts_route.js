// Base route: /posts

const express = require("express");
const {
  createPost,
  updatePost,
  deletePost,
  getSinglePost,
  getPosts,
} = require("../controllers/posts_controller");
const { send404Error, send405Error } = require("../helpers/response");
const {
  termValidator,
  idValidator,
  createPostValidator,
  updatePostValidator,
} = require("../helpers/validation");
const router = express.Router();

router.get("/", termValidator(), getPosts);
router.post("/", createPostValidator(), createPost);
router.all("/", send405Error(["GET", "POST"]));

router.get("/:id", idValidator(), getSinglePost);
router.put("/:id", updatePostValidator(), updatePost);
router.delete("/:id", idValidator(), deletePost);
router.all("/:id", send405Error(["GET", "PUT", "DELETE"]));

router.all("/{*anything}", send404Error);

module.exports = router;
