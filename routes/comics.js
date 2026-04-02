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
  ensureAuth, 
  [
    body('title', 'Title is required').trim().notEmpty(),
    body('issueNumber', 'Issue number must be a number').optional().isNumeric(),
    body('characters').optional().isArray(),
  ],
  createComic
);

router.put(
  '/:id', 
  ensureAuth, 
  [
    param('id', 'Invalid ID').isMongoId(),
    body('title').optional().notEmpty(),
    body('publisher').optional().notEmpty(),
    body('characters').optional().isArray()
  ],
  updateComic
);
router.delete(
  '/:id', 
  ensureAuth, 
  param('id', 'Invalid ID').isMongoId(),
  deleteComic);

module.exports = router;