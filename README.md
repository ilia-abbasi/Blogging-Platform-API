# Blogging Platform API

**The project assignment for roadmap.sh**

URL of the assignment in roadmap.sh:  
https://roadmap.sh/projects/blogging-platform-api

This API makes CRUD operations on a postgres database to handle different blog posts.  
Each post has a title, content, category, tags, created_at and updated_at properties.  
There are no authentication or authorization.

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/ilia-abbasi/Blogging-Platform-API.git
   cd Blogging-Platform-API
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Create the `.env` file in the root of the project and set the variables:

   ```env
   PORT=your_port
   DB_USER=database_username
   DB_HOST=database_host
   DB_NAME=database_name
   DB_PASSWORD=database_password
   DB_PORT=database_port
   ```

4. Create the `posts` table in your postgres database based on the [validation rules](https://github.com/ilia-abbasi/Blogging-Platform-API/blob/main/Documentation.md#validation-rules).

## Usage

1. Run the server with:

   ```sh
   npm run start
   ```

2. Send requests using [Postman](https://www.postman.com/).

## Dependencies

- dotenv
- express
- lodash
- morgan
- pg

The source code is formatted with [Prettier](https://prettier.io/).

---

Read the docs [here](https://github.com/ilia-abbasi/Blogging-Platform-API/blob/main/Documentation.md).  
Blogging-Platform-API is licensed under the [GPL-3.0 license](https://github.com/ilia-abbasi/Blogging-Platform-API/blob/main/LICENSE).
