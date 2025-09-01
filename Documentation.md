# Documentation

Here is a straight-forward documentation for using Blogging-Platform-API

## Response format

Every response from this API is a JSON object with three properties:

- success (boolean)
- message (string)
- data (object or array)

The only exception is when the status code is `204` and there is no response body.

### Success

This is a boolean indicating whether the request was OK or not. If the API successfully understands the request and responds with the information you want, the value of `success` will be `true`, anything else will make this property to be `false`.  
Based on the different status codes that Blogging-Platform-API may use in the response of your request, `true` is for when the status code is `200`, `201` or `204` and `false` is for when it's anything else.

### Message

`message` is a short string explaining a summary of the response object. Its value is based on the status codes and `data`.

### Data

This is the property containing the actual data that a user wants. `data` will be an empty object if an error occurs.

Here is an example of a response object:

1. Request:
   `GET /posts/20`
2. Response:
   ```json
   {
     "success": true,
     "message": "Got post",
     "data": {
       "id": 20,
       "title": "My trip to Berlin",
       "content": "It was very nice and I had a lot of fun.",
       "category": "travel",
       "tags": ["Germany", "fun", "Europe"],
       "created_at": "2025-09-01T05:42:32.048Z",
       "updated_at": "2025-09-01T05:42:32.048Z"
     }
   }
   ```

## Validation rules

As you saw in the last section, a post has these properties in the database:

- `id`: serial PRIMARY KEY
- `title`: VARCHAR(50)
- `content`: VARCHAR(10000)
- `category`: VARCHAR(30)
- `tags`: VARCHAR(30)[]
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

The last two properties are determined by the server, but others may be provided by a user so there are validation rules for them. These rules are literally their data type in the database but I will explain them anyway.

`id` must be a positive integer. `title` must be a string and its length must not exceed 50. `content` must be a string and its length must not exceed 10000. `category` must be a string an its length must not exceed 30. `tags` must be an array, its items must be strings and their length must not exceed 30.

None of the properties can be null.

## Endpoints

- `GET` -> `/posts`:  
  Get all the posts in the database. A query parameter can be used here to filter the search results. `/posts?term=school` will only include the posts that has the word "school" anywhere in either their `title`, `content` or `category`. This search is case-insensitive so `school` and `SCHOOL` have the same effect. The status code will always be `200`. In response, `data` will be an array of posts.

- `GET` -> `/posts/:id`:  
  Get the post with an ID of `:id` where `:id` is a positive integer. The status code will either be `200` or `404`. In response, `data` will be an object containing the post.

- `POST` -> `/posts`:  
  A post will be created in the database based on the request body. The request body must be a JSON object with the properties of a post. Only `title`, `content`, `category` and `tags` must be provided. For example:

  ```json
  {
    "title": "Beautiful morning",
    "content": "Birds are singing and flowers are blooming",
    "category": "productivity",
    "tags": ["morning", "breakfast", "nature"]
  }
  ```

  The status code will either be `201`, or `400` in case of invalid data. In response, `data` will be the created post with all properties.

- `PUT` -> `/posts/:id`:  
  The post with an ID of `:id` will be updated based on the request body provided. The request body has the same rules mentioned in the previous endpoint but you are not obligated to provide all four properties. You can provide any of the properties you aim to change. For example:

  ```json
  {
    "title": "Beautiful afternoon",
    "category": "resting"
  }
  ```

  The status code will either be `200`, `404`, or `400` in case of invalid data or empty request body. In response, `data` will be the updated post with all properties.

- `DELETE` -> `/posts/:id`:  
  Delete the post with an ID of `:id`. The status code will either be `204`, `404`, or `400` in case of invalid `:id`. Response body will be empty if the status code is `204`.

## Status codes

Every possible status code recieved from the API:

- `200`: OK
- `201`: Created post
- `204`: Deleted post
- `400`: Invalid request body or route parameter (e.g. `:id`)
- `404`: Not found
- `405`: Method not allowed
- `500`: Internal server error

For every route not mentioned in the "Endpoints" section, status code `404` is used.  
For every route mentioned in the "Endpoints" section but with unsupported method, status code `405` is used and an `Allow` header is also provided with the supported methods as its value.  
In any of the endpoints if something goes wrong on the server side (probably the database), status code `500` is used.
