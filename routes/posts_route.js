// Base route: /posts

const express = require("express");
const {
  createPost,
  updatePost,
  deletePost,
  getSinglePost,
  getPosts,
} = require("../controllers/posts_controller");
const router = express.Router();

router.get("/", getPosts);
router.post("/", createPost);

router.get("/:id", getSinglePost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

module.exports = router;
