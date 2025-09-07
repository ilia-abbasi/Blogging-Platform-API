require("dotenv").config();
const { Client } = require("pg");

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function createPostsTable() {
  await client.connect();
  const result = await client.query(`
    CREATE TABLE posts(
    id serial PRIMARY KEY,
    title VARCHAR (50) NOT NULL,
    content VARCHAR (10000) NOT NULL,
    category VARCHAR (30) NOT NULL,
    tags VARCHAR (30) [] NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
    );
  `);
  await client.end();
}

createPostsTable()
  .then(() => {
    console.log('Database: Successfully created "posts" table');
    console.log("Database: Setup is completed");
  })
  .catch((err) => {
    console.log(
      `Database: Something went wrong while running the setup. ${err}`
    );
  });
