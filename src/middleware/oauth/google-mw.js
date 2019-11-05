const superagent = require('superagent');

// TODO: JSDoc Comment
let getUserData = async request => {
  // TODO: Comment
  let authCode = request.query.code;

  // TODO: Comment
  let googleRes = await superagent
    .post(process.env.GOOGLE_TOKEN_SERVICE)
    .type('form')
    .send({
      code: authCode,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${process.env.HOME_URL}/google-oauth`,
      grant_type: 'authorization_code'
    });

  // TODO: Comment
  let access_token = googleRes.body.access_token;

  // TODO: Comment
  googleRes = await superagent
    .get(process.env.GOOGLE_API)
    .set('Authorization', `Bearer ${access_token}`);

  // TODO: Comment
  let userData = googleRes.body;
  return userData;
};

module.exports = getUserData;
