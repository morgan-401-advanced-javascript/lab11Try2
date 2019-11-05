const superagent = require('superagent');

let getUserData = async request => {
    let authCode = request.query.code;

  // TODO: Comment
  // this uses the google token from env to authorize our application to use google OAuth 
  let githubRes = await superagent
    .post(process.env.GITHUB_TOKEN_SERVICE)
    .type('form')
    .send({
      code: authCode,
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      redirect_uri: `${process.env.HOME_URL}/github-oauth`,
      grant_type: 'authorization_code'
    });

  // TODO: Comment
  let access_token = githubRes.body.access_token;

  // TODO: Comment
  githubRes = await superagent
    .get(process.env.GITHUB_API)
    .set('Authorization', `Bearer ${access_token}`);

  // TODO: Comment
  let userData = githubRes.body;
  return userData;
};

module.exports = getUserData;
