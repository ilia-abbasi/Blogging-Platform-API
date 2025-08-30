function makeResponseObj(success, message, data = {}) {
  return { success, message, data };
}

module.exports = { makeResponseObj };
