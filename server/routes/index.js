const express = require('express');
const bookmark = require('./bookmark');
 
const router = express.Router();
router.use('/bookmark',bookmark);
 
module.exports =  router;