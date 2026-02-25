const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { 
  getAllCharacters, 
  getCharacterById, 
  createCharacter,
  updateCharacter,
  deleteCharacter 
} = require('../controllers/charactersController');

const { ensureAuth } = require('../middleware/auth');

router.get('/', getAllCharacters);
router.get(
  '/:id', 
  param('id', 'Invalid ID').isMongoId(),
  getCharacterById);

router.post(
  '/', 
  [
    body('name', 'Name is required').trim().notEmpty(),
    body('universe', 'Universe must be "Comics" or "MCU"')
      .isIn(['Comics', 'MCU']),
    body('powers', 'Powers must be an array').isArray(),
  ],
  ensureAuth, 
  createCharacter);

router.put(
  '/:id',
  [
    param('id', 'Invalid ID').isMongoId(),
    body('universe').optional().isIn(['Comics', 'MCU']),
    body('powers').optional().isArray(),
  ],
   ensureAuth, 
   updateCharacter);
router.delete(
  '/:id',
  param('id', 'Invalid ID').isMongoId(),
  ensureAuth, 
  deleteCharacter
);

module.exports = router;