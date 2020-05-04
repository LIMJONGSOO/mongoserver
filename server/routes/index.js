const express = require('express');
const board = require('./board');
 
const router = express.Router();
router.use('/board',board);
 
module.exports =  router;