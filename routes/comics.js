const express = require('express');
const router = express.Router();
const { getAllComics, getComicById, createComic } = require('../controllers/comicsController');

router.get('/', getAllComics);
router.get('/:id', getComicById);
router.post('/', createComic);

module.exports = router;