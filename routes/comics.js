const router = require('express').Router();
const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');

const getCollection = () => {
  return mongodb.getDb().db().collection('comics');
};

const buildComic = (body) => {
  return {
    title: body.title,
    issueNumber: parseInt(body.issueNumber) || 0,
    publisher: body.publisher || 'Marvel',
    characters: body.characters || [],
    releaseYear: body.releaseYear || ''
  };
};

const validateComic = (comic) => {
  if (!comic.title) return 'Title is required';
  return null;
};

// GET all
router.get('/', async (req, res) => {
  try {
    const result = await getCollection().find().toArray();
    res.status(200).json(result);
  } catch (error) {
    console.error('GET /comics error:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST

router.post('/', async (req, res) => {
  try {
    const comic = buildComic(req.body);
    const validationError = validateComic(comic);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const result = await getCollection().insertOne(comic);
    res.status(201).json({ id: result.insertedId, comic });
   } catch (error) {
    res.status(500).json({ message: error.message });
   }
});

// PUT
router.put('/:id', async(req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Comic ID' });
    }
    
    const updateComic = buildComic(req.body);
    const validationError = validateComic(updateComic);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const result = await getCollection().replaceOne(
      { _id: new ObjectId(req.params.id) },
      updateComic
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Comic not found' });
    }

    res.status(200).json({
      message: 'Comic updated successfully',
      id: req.params.id
    });
  } catch (error) {
    console.error('PUT /comics/:id error:', error);
    res.status(500).json({ message: 'Failed to update Comic', error: error.message });
  }
});

// DELETE
router.delete('/:id', async(req, res) => {
  try {
    if(!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Comic ID' });
    }

    const result = await getCollection().deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Comic not found' });
    }

    res.status(200).json({ message: 'Comic deleted successfully' });
  } catch (error) {
    console.error('DELETE /comics/:id error:', error);
    res.status(500).json({ message: 'Failed to delete Comic', error: error.message });
  }
});

module.exports = router;