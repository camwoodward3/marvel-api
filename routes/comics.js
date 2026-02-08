const express = require('express');
const router = express.Router();
const { getAllComics, getComicsById, createComic } = require('../controllers/comicsController');

router.get('/', getAllComics);
router.get('/:id', getComicsById);
router.get('/', createComic);

module.exports = router;