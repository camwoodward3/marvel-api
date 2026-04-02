const router = require('express').Router();
const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');

const getCollection = () => {
  return mongodb.getDb().db().collection('Movies');
};

const buildMovie = (body) => {
  return {
    title: body.title,
    releaseDate: body.releaseDate || '',
    director: body.director || '',
    characters: body.characters || [],
    phase: body.phase || ''
  };
};

const validateMovie = (movie) => {
  if (!movie.title ) return 'title is required';
  return null;
};

router.get('/', async (req, res) => {
  try {
    const result = await getCollection().find().toArray();
    res.status(200).json(result);
  } catch (error) {
    console.error('GET /Movies error:', error);
    res.status(500).json({ message: 'Failed to get Movies', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const Movie = buildMovie(req.body);
    const validationError = validateMovie(Movie);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const result = await getCollection().insertOne(Movie);

    res.status(201).json({
      message: 'Movie created successfully',
      id: result.insertedId,
      Movie: Movie
    });
   } catch (error) {
    console.error('POST /Movies error:', error);
    res.status(500).json({ message: 'Failed to create Movie', error: error.message });
   }
});

router.put('/:id', async(req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Movie ID' });
    }
    
    const updateMovie = buildMovie(req.body);
    const validationError = validateMovie(updateMovie);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const result = await getCollection().replaceOne(
      { _id: new ObjectId(req.params.id) },
      updateMovie
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.status(200).json({
      message: 'Movie updated successfully',
      id: req.params.id
    });
  } catch (error) {
    console.error('PUT /Movies/:id error:', error);
    res.status(500).json({ message: 'Failed to update Movie', error: error.message });
  }
});

router.delete('/:id', async(req, res) => {
  try {
    if(!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Movie ID' });
    }

    const result = await getCollection().deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.status(200).json({ message: 'Movie deleted successfully' });
  } catch (error) {
    console.error('DELETE /Movies/:id error:', error);
    res.status(500).json({ message: 'Failed to delete Movie', error: error.message });
  }
});

module.exports = router;