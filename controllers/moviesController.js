const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');
const { validationResult } = require('express-validator');

exports.getAllMovies = async (req, res) => {
    try {
          const result = await mongodb.getDb().db().collection('movies').find();     // Get the DB instance and target the collection
          const movies = await result.toArray();      // Convert the cursor to an array
    
          res.setHeader('Content-Type', 'application/json');
          res.status(200).json(movies);
        } catch (err) {
          res.status(500).json({ message: 'Failed to fetch movies' });
        }
};

exports.getMovieById = async (req, res) => {
  try {
      if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json('Invalid Movie ID');
      }
      const movieId = new ObjectId(req.params.id);
  
      const movie = await mongodb
        .getDb()
        .db()
        .collection('movies')
        .findOne({ _id: movieId });
  
      if(!movie) {
        return res.status(404).json({ message: 'Movie not found' });
      }
      
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(movie);
    } catch (err) {
      res.status(500).json({ message: err.message || 'Error retrieving movie' });
    }
};

exports.createMovie = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const movieData = {
      title: req.body.title,
      alias: req.body.alias,
      characters: req.body.characters,
      releaseDate: req.body.releaseDate
    };

    const response = await mongodb
      .getDb()
      .db()
      .collection('movies')
      .insertOne(movieData);

    if (response.acknowledged) {
      res.status(201).json({
        _id: response.insertedId,
        ...movieData
      });
    } else {
      res.status(500).json({ message: 'Some error occurred while creating the movie.' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE (PUT)
exports.updateMovie = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    
    const movieId = new ObjectId(req.params.id);

    const updatedMovie = {
      title: req.body.title,
      alias: req.body.alias,
      characters: req.body.characters
    }
    
    const response = await mongodb
      .getDb()
      .db()
      .collection('movies')
      .updateOne(
        { _id: movieId }, 
        { $set: updatedMovie}
      );

    
      if (response.modifiedCount > 0) {
        res.status(204).send();
      } else {
        res.status(404).json('Movie not found or no data changed.')
      }
    } catch (err) {
      res.status(500).json({ message: 'Update failed', error: err.message });
    }
  };

// DELETE
exports.deleteMovie = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const movieId = new ObjectId(req.params.id);
    const response = await mongodb.getDb().db().collection('movies').deleteOne({ _id: movieId });

    if (response.deletedCount > 0) {
      res.status(200).json({ message: 'Movie deleted successfully' });
    } else {
      res.status(404).json('Movie not found.');
    }
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};