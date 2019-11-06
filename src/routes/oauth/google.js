'use strict';

const express = require('express');

const googleMW = require('../../middleware/oauth/google-mw.js');
const router = express.Router();

// TODO: Swagger Comment
/**
 * @route GET /google
 * This route authenticates and signs in a user via google oath. 
 * @param {object}   req   The request object. 
 * @param {object}   res   The response object.
 * @param {Function} next  
 * @security oauth
 * @returns {object} 200 - An object with a key-value token, which represents our generated JSON google OAuth URL
 */
router.get('/google', (req, res, next) => {
  let googleOAuthURL = process.env.GOOGLE_AUTH_SERVICE;
  let options = {
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.HOME_URL + '/google-oauth',
    scope: 'email openid profile',
    prompt: 'consent',
    response_type: 'code',
  };

  // TODO: Comment
  // adds a query to the URL
  googleOAuthURL += '?';

  // TODO: Comment
  // adds our keys to the googleOAuthURL

  Object.keys(options).forEach((key, indx) => {
    googleOAuthURL += key + '=' + encodeURIComponent(options[key]);
    googleOAuthURL += '&';
  });

  // TODO: Comment
  // This response isthe updated googleOAuthURL
  res.status(200).json({ url: googleOAuthURL });
});

// TODO: Swagger Comment
/**
 * @route GET /google-oauth
 * This route is the return from google's authentication service and keys our middleware to grab the user data and display it as json data 
 * @param {object}   req   The request object. 
 * @param {object}   res   The response object.
 * @param {Function} next  
 * @security oauth
 * @returns {object} 200 - json object {name: data.name, email: data.email}
 */
router.get('/google-oauth', async (req, res, next) => {
  let data = await googleMW(req);

  // TODO: Comment
  // response sends json data of the name & email of the user 

  res.status(200).json({ name: data.name, email: data.email });

  // TODO: README Question:
  // Now that we have some data about the user, how would we go about
  // adding this user to our database?
  // What data should we save?
  // What data is missing?
  // What considerations about storing this data do we need to take?
});

module.exports = router;
