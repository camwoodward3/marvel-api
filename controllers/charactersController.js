const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');
const { validationResult } = require('express-validator');

const getCollection = () => mongodb.getDb().db().collection('characters');

exports.getAllCharacters = async (req, res) => {
    try {
      const result = await getCollection.find();     // Get the DB instance and target the collection
      const characters = await result.toArray();      // Convert the cursor to an array

      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(characters);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch characters' });
    }
};

exports.getCharacterById = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json('Invalid Character ID');
    }

    const characterId = new ObjectId(req.params.id);

    const character = await mongodb
      .getDb()
      .db()
      .collection('characters')
      .findOne({ _id: characterId });

    if (!character) {
      return res.status(404).json({ message: 'Character not found' });
    }

    res.status(200).json(character);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Error retrieving character' });
  }
};

exports.createCharacter = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const characterData = {
      name: req.body.name,
      alias: req.body.alias,
      universe: req.body.universe,
      firstAppearance: req.body.firstAppearance,
      powers: req.body.powers,
      movies: req.body.movies,
      comics: req.body.comics
    };

    const response = await mongodb
      .getDb()
      .db()
      .collection('characters')
      .insertOne(characterData);

    if (response.acknowledged) {
      res.status(201).json({
        _id: response.insertedId,
        ...characterData
      });
    } else {
      res.status(500).json({ message: 'Some error occurred while creating the character.' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE (PUT)
exports.updateCharacter = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const characterId = new ObjectId(req.params.id);

    const updatedCharacter = {
      name: req.body.name,
      alias: req.body.alias,
      universe: req.body.universe,
      powers: req.body.powers,
      movies: req.body.movies,
      comics: req.body.comics
    }
    
    const response = await mongodb
      .getDb()
      .db()
      .collection('characters')
      .updateOne({ _id: characterId }, { $set: updatedCharacter}

      );

    
      if (response.modifiedCount > 0) {
        res.status(204).send();
      } else {
        res.status(404).json('Character not found or no data changed.')
      }
    } catch (err) {
      res.status(500).json({ message: 'Update failed', error: err.message });
    }
  };

// DELETE
exports.deleteCharacter = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const characterId = new ObjectId(req.params.id);
    const response = await getCollection().deleteOne({ _id: characterId });

    if (response.deletedCount > 0) {
      res.status(200).json({ message: 'Character deleted successfully' });
    } else {
      res.status(404).json('Character not found.');
    }
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};