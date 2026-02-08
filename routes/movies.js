const express = require('express');
const router = express.Router();
const { getAllMovies, getMovieById, createMovie } = require('../controllers/moviesController');

router.get('/', getAllMovies);
router.get('/:id', getMovieById);
router.get('/', createMovie);

module.exports = router;