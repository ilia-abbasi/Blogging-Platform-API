function validateID(id) {
  if (isNaN(id)) {
    return "ID must be a number";
  }
  if (!Number.isInteger(id)) {
    return "ID must be an integer";
  }

  return "success";
}

function validateTitle(title) {
  if (!title) {
    return "title is required";
  }
  if (typeof title !== "string") {
    return "title must be a string";
  }
  if (title.length > 50) {
    return "title length can not exceed 50";
  }

  return "success";
}

function validateContent(content) {
  if (!content) {
    return "content is required";
  }
  if (typeof content !== "string") {
    return "content must be a string";
  }
  if (content.length > 10000) {
    return "content length can not exceed 10000";
  }

  return "success";
}

function validateCategory(category) {
  if (!category) {
    return "category is required";
  }
  if (typeof category !== "string") {
    return "category must be a string";
  }
  if (category.length > 30) {
    return "category length can not exceed 30";
  }

  return "success";
}

function validateTags(tags) {
  if (!tags) {
    return "tags is required";
  }
  if (!Array.isArray(tags)) {
    return "tags must be an array";
  }
  if (!tags.length) {
    return "tags must have at least 1 item";
  }

  return "success";
}

module.exports = {
  validateID,
  validateTitle,
  validateContent,
  validateCategory,
  validateTags,
};
