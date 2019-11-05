'use strict';

// External Resources
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

// Internal Resources
const errorHandler = require('./middleware/error.js');
const notFound = require('./middleware/404.js');
const authRouter = require('./routes/auth-router.js');
const googleRouter = require('./routes/oauth/google.js');
const githubRouter = require('./routes/oauth/github.js');

// == Create our server =======================================
const app = express();

// == App Level Middleware ====================================
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// The following line allows the client-side html
// files to access anything in the public folder,
// i.e. our client-side javascript files
app.use(express.static('./public'));

// == Routes ==================================================

/**
 * @route GET /
 * This route sends the index HTML file as a response
 * @returns {file} 200 - The HTML file index.html
 */
app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname + '/../public/index.html'));
});

app.use(authRouter);
app.use(googleRouter);
app.use(githubRouter);

// == Error Handling ==========================================
app.use(notFound);
app.use(errorHandler);

// == Exports =================================================
module.exports = {
  server: app,
  start: port => {
    const PORT = port || process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Server Up on ${PORT}`);
    });

    // Start up DB Server
    const PATH = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/app';
    const options = {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
    };

    mongoose.connect(PATH, options);
  }
};
