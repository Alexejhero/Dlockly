const base64 = require('nodejs-base64');
const request = require("request-promise");

module.exports = async function (data) {
  if (!data.req.query.orderID) {
    return data.res.status(402).send("{'error':'Payment required'}");
  } else if (!data.req.query.guild) {
    return data.res.status(400).send("{'error':'Bad request'}");
  }

  var auth = await request.post({
    uri: 'https://api.sandbox.paypal.com/v1/oauth2/token?grant_type=client_credentials',
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${base64.base64encode(`${process.env.PAYPAL_ID}:${process.env.PAYPAL_SECRET}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  auth = JSON.parse(auth);

  var capture = await request.post({
    uri: `https://api.sandbox.paypal.com/v2/checkout/orders/${data.req.query.orderID}/capture`,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${auth.access_token}`,
      'Content-Type': 'application/json',
    },
  });
  capture = JSON.parse(capture);

  if (!capture.error) {
    captureID = capture.purchase_units[0].payments.captures[0].id;
    return data.res.status(200).send(JSON.stringify(capture));
  } else {
    console.error(capture.error);
    return data.res.sendStatus(500).send(JSON.stringify(capture.error));
  }
}