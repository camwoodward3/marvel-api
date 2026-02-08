const express = require('express');
const router = express.Router();
const { getAllCharacters, getCharacterById, createCharacter } = require('../controllers/charactersController');

router.get('/', getAllCharacters);
router.get('/:id', getCharacterById);
router.get('/', createCharacter);

module.exports = router;