const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');
const { validationResult } = require('express-validator');

const getCollection = () => 
  mongodb.getDb().db().collection('comics');

exports.getAllComics = async (req, res) => {
    try {
      const result = await getCollection().find();     // Get the DB instance and target the collection
      const comics = await result.toArray();      // Convert the cursor to an array

      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(comics);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch comics' });
    }
};

exports.getComicById = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json('Invalid comic ID');
    }
    const comicId = new ObjectId(req.params.id);

    const comic = await getCollection().findOne({ _id: comicId });

    if(!comic) {
      return res.status(404).json({ message: 'comic not found' });
    }
    
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(comic);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Error retrieving comic' });
  }
};

exports.createComic = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const comicData = {
      title: req.body.title,
      issueNumber: req.body.issueNumber
    };

    const response = await getCollection().insertOne(comicData);

    if (response.acknowledged) {
      res.status(201).json({
        _id: response.insertedId,
        ...comicData
      });
    } else {
      res.status(500).json({ message: 'Some error occurred while creating the comic.' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateComic = async(req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const comicId = new ObjectId(req.params.id);

    const updatedComic = {
      title: req.body.title,
      issueNumber: req.body.issueNumber,
      publisher: req.body.publisher,
      characters: req.body.characters
    };

    const response = await getCollection().updateOne(
          { _id: comicId },
          { $set: updatedComic }
      );

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Comic not found or no changes made' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

exports.deleteComic = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const comicId = new ObjectId(req.params.id);
    
    const response = await getCollection.deleteOne({ _id: comicId });

    if (response.deletedCount > 0) {
      res.status(200).json({ message: 'Comic deleted successfully' });
    } else {
      res.status(404).json({ message: 'Comic not found' });
    }
  } catch(err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
}