'use strict';

const express = require('express');

const githubMW = require('../../middleware/oauth/github-mw.js');
const router = express.Router();

router.get('/github', (req, res, next) => {});

router.get('/github-oauth', async (req, res, next) => {});

module.exports = router;
