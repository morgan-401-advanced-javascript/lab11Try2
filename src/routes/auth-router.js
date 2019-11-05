'use strict';

const express = require('express');
const router = express.Router();

const Users = require('../models/users-model.js');
const authError = require('../middleware/401.js');
const basicAuth = require('../middleware/basic-auth.js');
const googleGetData = require('./oauth/google.js');

const users = new Users();
/**
 * @route POST /signin
 * This route authenticates and signs in a user. We first run the middleware basicAuth, and for basicAuth we have some catching error middleware, and then we reach the route endpoint
 * @param {object}   req   The request object. Even though this is a post, we don't actually need any body data, all the sign in data should be in req.headers.authorization
 * @param {object}   res   The response object
 * @param {Function} next  We don't use it in here, but this is our method for going to the next middleware or error middleware in the request-response chain
 * @security basicAuth
 * @returns {object} 200 - An object with a key-value token, which represents our generated JSON Web Token
 */
router.post('/signin', basicAuth, authError, async (req, res, next) => {
  // The basicAuth middleware should find us an authenticated user
  // (or throw a 401 error if it can't find one). We then take that
  // user, and generate a JSON Web Token, which we send in our response
  let token = req.user.generateToken();
  res.json({ token: token });
});

module.exports = router;
