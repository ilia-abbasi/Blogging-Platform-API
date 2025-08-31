// Base route: /posts

const express = require("express");
const {
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/posts_controller");
const router = express.Router();

router.get("/", () => {});
router.post("/", createPost);

router.get("/:id", () => {});
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

module.exports = router;
