const postprocess = require('../src/postprocess');

module.exports = function (data) {
  if (!data.req.query.js) return data.res.sendStatus(400);
  try {
    data.res.send(postprocess(decodeURIComponent(data.req.query.js)));
  } catch (e) {
    data.res.sendStatus(500);
  }
}