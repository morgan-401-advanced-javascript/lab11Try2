'use strict';

/**
 * This function is the default middleware for handling server code errors
 * @param  {Error}    err   This is the error object that should (ideally) contain information about the error
 * @param  {object}   req   This is the request object from the original client
 * @param  {object}   res   This is the response object. Because we're in an error, we're not actually going to send a response to the client, instead we're going to pass the error along to the client
 * @param  {Function} next  The next function to continue the middleware / endpoint chain. We don't call it in this function, because any error should be the mark of the end of our chain
 * @return {500}            We don't send any data in our response, instead we just set a status code and status message as our Server Error, and then we end our request-response chain
 */
module.exports = (err, req, res, next) => {
  console.error('__SERVER_ERROR__', err);
  let error = { error: err.message || err };
  res.statusCode = err.status || 500;
  res.statusMessage = err.statusMessage || 'Server Error';
  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify(error));
  res.end();
};
