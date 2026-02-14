const express = require('express');
const router = express.Router();
const { 
  getAllCharacters, 
  getCharacterById, 
  createCharacter,
  updateCharacter,
  deleteCharacter 
} = require('../controllers/charactersController');

router.get('/', getAllCharacters);
router.get('/:id', getCharacterById);
router.post('/', createCharacter);
router.put('/:id', updateCharacter);
router.delete('/:id', deleteCharacter);

module.exports = router;