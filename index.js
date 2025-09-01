require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const postsRouter = require("./routes/posts_route.js");
const {
  send404Error,
  send418Error,
  generalErrorHandler,
} = require("./models/response.js");
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(morgan(":method :url :status - :response-time ms"));
app.use("/posts", postsRouter);

app.all("/coffee", send418Error);

app.all("/{*anything}", send404Error);

app.use(generalErrorHandler);

app.listen(port, () => {
  console.log(`Server: Listening on port ${port} ...`);
});
