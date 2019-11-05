'use strict';

const Users = require('../models/users-model.js');
const users = new Users();

/**
 * This function uses the basic auth encoding pattern to decode a username password string sent in the request header.
 * @param  {string}   authString  The encoded username and password that we are going to decode
 * @return {object}               An object containing the decoded, plain-text username and password
 */
function basicDecode(authString) {
  let base64Buffer = Buffer.from(authString, 'base64'); // base64 buffer conversion of string
  let bufferString = base64Buffer.toString(); // conversion from base64 buffer back to string
  let [username, password] = bufferString.split(':'); // split string using delimiter : to get pieces

  return {
    username: username,
    password: password
  }; // return decoded
}

/**
 * This function takes an encoded username and password from a request header, decodes the username and password, and then authenticates those user credentials to (hopefully) return a user record from the database
 * @param  {object}   req   Our request object. We need to access the req.headers.authorization key-value.
 * @param  {object}   res   The response object. Because this is just middleware, we won't be editing the response value in this function
 * @param  {Function} next  This is what we use to either go to the next middleware or endpoint for our route, or to go to some error handling middleware
 */
module.exports = async (req, res, next) => {
  // First, we want to get the authorization string from the header
  let auth = req.headers.authorization;

  // auth should be a string that looks something like:
  // Basic 42e910af943rcc99b13
  // We want to pull out that encoded portion so we
  // can interpret the username and password

  // Split the auth string based on space, and then
  // grab the 42e910af943rcc99b13 piece from the resulting
  // pieces array
  let encodedData = auth.split(/\s+/)[1];

  // Decode the data based on how we know Basic Auth strings
  // are encoded
  let credentials = basicDecode(encodedData);

  // now that we have the credentials, let's authenticate
  let user = await users.authBasic(credentials);

  // We store the authenticated user back into the request for
  // other route endpoints to use if the user is valid. If the
  // user is not valid, we throw the next error middleware in the
  // chain
  if (user) {
    req.user = user;
    next();
  } else next('User not found');
};
