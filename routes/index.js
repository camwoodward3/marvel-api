const express = require('express');
const router = require('express').Router();


router.use('/characters', require('./characters'));
router.use('/movies', require('./movies'));
router.use('/comics', require('./comics'));

module.exports = router;