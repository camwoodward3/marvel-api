const express = require('express');
const router = express.Router();
const { 
  getAllComics, 
  getComicById, 
  createComic,
  updateComic,
  deleteComic
} = require('../controllers/comicsController');

router.get('/', getAllComics);
router.get('/:id', getComicById);
router.post('/', createComic);
router.put('/:id', updateComic);
router.delete('/:id', deleteComic);

module.exports = router;