const { pool } = require("./database/db.js");

function createPost(req, res) {
  const title = req.body.title;
  const content = req.body.content;
  const category = req.body.category;
  const tags = req.body.tags;
}

module.exports = { createPost };
