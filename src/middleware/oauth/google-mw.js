const superagent = require('superagent');

// TODO: JSDoc Comment
/** 
 * @function getUserData
 * @param {object} request
 * @returns {object} userData from google 
 * 
*/

let getUserData = async request => {
  // TODO: Comment
  //  sets the variable authCode to the request query code. We will use this in the next function.
  let authCode = request.query.code;

  // TODO: Comment
  // this uses the google token from env to authorize our application to use google OAuth 
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
