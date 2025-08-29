const express = require("express");
const app = express();
const postsRouter = require("./routes/posts_route.js");
require("dotenv").config();
const port = process.env.PORT;

app.use("/posts", postsRouter);

app.listen(port, () => {
  console.log(`Server: Listening on port ${port} ...`);
});
