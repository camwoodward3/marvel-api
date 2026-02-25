const express = require('express');
const router = express.Router();
const { body, param} = require('express-validator');
const { 
  getAllMovies, 
  getMovieById, 
  createMovie,
  updateMovie,
  deleteMovie
 } = require('../controllers/moviesController');

 const { ensureAuth } = require('../middleware/auth');
 
router.get('/', getAllMovies);

router.get(
  '/:id',
  param('id', 'Invalid ID').isMongoId(),
  getMovieById);
router.post(
  '/',
  [
    body('title', 'Title is required').notEmpty(),
    body('releaseDate', 'Release date must be a valid date')
      .optional()
      .isISO8601(),
    body('characters', 'Characters must be an array of IDs')
      .optional()
      .isArray()
      .custom(arr => arr.every(id => typeof id === 'string'))
  ],  
  ensureAuth, 
  createMovie
);

router.put(
  '/:id', 
  [
    param('id', 'Invalid ID').isMongoId(),
    body('title').optional().notEmpty(),
    body('releaseDate').optional().isISO8601(),
    body('characters').optional().isArray()
  ],
  ensureAuth, 
  updateMovie
);

router.delete(
  '/:id', 
  param('id', 'Invalid ID').isMongoId(),
  ensureAuth, 
  deleteMovie);

module.exports = router;