'use strict';

const express = require('express');

const githubMW = require('../../middleware/oauth/github-mw.js');
const router = express.Router();

router.get('/github', (req, res, next) => {
    let githubOAuthURL = process.env.GITHUB_AUTH_SERVICE;
    let options = {
      client_id: process.env.GITHUB_CLIENT_ID,
      redirect_uri: process.env.HOME_URL + '/github-oauth',
      scope: 'email openid profile',
      prompt: 'consent',
      response_type: 'code'
    };
  
    // TODO: Comment
    // adds a query to the URL
    githubOAuthURL += '?';
  
    // TODO: Comment
    Object.keys(options).forEach((key, indx) => {
      githubOAuthURL += key + '=' + encodeURIComponent(options[key]);
      githubOAuthURL += '&';
    });
  
    // TODO: Comment
    res.status(200).json({ url: githubOAuthURL });

});

router.get('/github-oauth', async (req, res, next) => {
    let data = await githubMW(req);
    console.log('data', data);

    // TODO: Comment
    res.status(200).json({ name: data.name, login: data.login });
});

module.exports = router;
