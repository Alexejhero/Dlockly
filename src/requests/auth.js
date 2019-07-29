const querystring = require('querystring');
const request = require('request-promise');

module.exports = function (data) {
  try {
    if (data.auth.sessionValid(data.authUserID, data.authSession, data.db)) {
      data.res.redirect("/#sessionValid");
    } else {
      if (!data.req.query.code) {
        data.res.redirect("/login#invalidCode");
      } else {
        var bodyObj = {
          'client_id': data.bot.user.id,
          'client_secret': process.env.DISCORD_CLIENT_SECRET,
          'grant_type': 'authorization_code',
          'redirect_uri': 'https://dlockly.glitch.me/auth',
          'scope': 'identify',
          'code': data.req.query.code
        };
        var body = querystring.stringify(bodyObj);

        request.post({
          uri: "https://discordapp.com/api/oauth2/token",
          body: body,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(async response => {
          var reqObj = JSON.parse(response);

          var tokenType = reqObj.token_type;
          var accessToken = reqObj.access_token;

          var userData = await data.auth.getUserData(accessToken, tokenType, data.db);
          var userID = userData.id;
          var sessionToken = data.auth.generateToken();

          data.auth.setToken(userID, sessionToken, accessToken, data.db);
          data.auth.setCookies(data.res, userID, sessionToken);

          data.res.redirect("/#loggedIn");
        }).catch(e => {
          console.error(e);
          if (e.response && e.response.body)
            data.res.send(e.response.body);
          else
            data.res.redirect("/login#promiseRejected");
        });
      }
    }
  } catch (e) {
    console.error(e);
    data.res.redirect("/login#caughtError");
  }
}