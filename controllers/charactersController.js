const mongoose = require('mongoose');
const Character = require('../models/Character');
const { validationResult } = require('express-validator');

exports.getAllCharacters = async (req, res) => {
  try {
    const characters = await Character.find().lean();
    res.json(characters);
  } catch(err) {
    res.status(500).json({ message: 'Failed to fetch characters' });
  }
};

exports.getCharacterById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Character ID' });
    }

    const character = await Character.findById(id).lean();
    if(!character) {
      return res.status(404).json({ message: 'Character not found' });
    }

    res.json(character);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch character' });
  }
};

exports.createCharacter = async (req, res) => {
  try {
    const character = new Character(req.body);
    await character.save();
    res.status(201).json(character);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// UPDATE (PUT)
exports.updateCharacter = async (req, res) => {
  try {
    const character = await Character.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!character) {
      return res.status(404).json({ message: 'Character not found' });
    }
    res.status(200).json(character);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE
exports.deleteCharacter = async (req, res) => {
  try {
    const character = await Character.findByIdAndDelete(req.params.id);

    if (!character) {
      return res.status(404).json({ message: 'Character not found' });
    }

    res.status(200).json({ message: 'Character deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid ID format' });
  }
};