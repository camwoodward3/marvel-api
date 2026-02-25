const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { 
  getAllComics, 
  getComicById, 
  createComic,
  updateComic,
  deleteComic
} = require('../controllers/comicsController');

const { ensureAuth } = require('../middleware/auth');

router.get('/', getAllComics);
router.get(
  '/:id', 
  param('id', 'Invalid ID').isMongoId(),
  getComicById
);

router.post(
  '/', 
  [
    body('title', 'Title is required').trim().notEmpty(),
    body('issueNumber', 'Issue number must be a number').isNumeric(),
    body('characters').optional().isArray(),
  ],
  ensureAuth, 
  createComic
);

router.put(
  '/:id', 
  [
    param('id', 'Invalid ID').isMongoId(),
    body('title').optional().notEmpty(),
    body('publisher').optional().notEmpty(),
    body('characters').optional().isArray()
  ],
  ensureAuth, 
  updateComic
);
router.delete(
  '/:id', 
  param('id', 'Invalid ID').isMongoId(),
  ensureAuth, 
  deleteComic);

module.exports = router;