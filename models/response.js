function makeResponseObj(success, message, data = {}) {
  return { success, message, data };
}

function send404Error(req, res) {
  const resObj = makeResponseObj(false, "Not found");

  return res.status(404).send(resObj);
}

function send405Error(allowedMethods) {
  let allowHeaderValue = "";

  for (const allowedMethod of allowedMethods) {
    allowHeaderValue = `${allowHeaderValue}${allowedMethod}, `;
  }
  allowHeaderValue = allowHeaderValue.slice(0, -2);

  return (req, res) => {
    const resObj = makeResponseObj(
      false,
      `You can not ${req.method} ${req.baseUrl + req.path}`
    );

    res.set("Allow", allowHeaderValue);
    return res.status(405).send(resObj);
  };
}

module.exports = { makeResponseObj, send404Error, send405Error };
