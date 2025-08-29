require("dotenv").config();
const express = require("express");
const postsRouter = require("./routes/posts_route.js");
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use("/posts", postsRouter);

app.listen(port, () => {
  console.log(`Server: Listening on port ${port} ...`);
});
