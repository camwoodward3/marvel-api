const Character = require('../models/Character');

exports.getAllCharacters = async (req, res) => {
  const characters = await Character.find();
  res.json(characters);
};

exports.getCharacterById = async (req, res) => {
  const character = await Character.findById(req.params.id);
  if (!character) return res.status(404).json({ message: 'Character not found' });
  res.json(character);
};

exports.createCharacter = async (req, res) => {
  const character = new Character(req.body);
  await character.save();
  res.status(201).json(character);
}