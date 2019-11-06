const superagent = require('superagent');

let getUserData = async request => {
    let authCode = request.query.code;

  // TODO: Comment
  // this uses the github token from env to authorize our application to use google OAuth 
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
    // this is the access token that github returns us after Oauth

  let access_token = githubRes.body.access_token;

  // TODO: Comment
//   This updates our headers with the access token provided by github
  githubRes = await superagent
    .get(process.env.GITHUB_API)
    .set('Authorization', `Bearer ${access_token}`);

  // TODO: Comment
    // This returns the data provided by github about the user after Oauth

  let userData = githubRes.body;
  return userData;
};

module.exports = getUserData;
