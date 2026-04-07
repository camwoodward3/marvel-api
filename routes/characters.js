const router = require('express').Router();
const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');
const {ensureAuth} = require('../middleware/auth');

const getCollection = () => {
  return mongodb.getDb().db().collection('characters');
};

const buildCharacter = (body) => {
  return {
    name: body.name,
    realName: body.realName || '',
    universe: body.universe,
    powers: body.powers || [],
    teams: body.teams || [],
    firstAppearance: body.firstAppearance || '',
  };
};

const validateCharacter = (character) => {
  if (!character.name || !character.universe ) {
    return 'name and universe are required';
  }
  return null;
};

router.get('/', async (req, res) => {
  try {
    const result = await getCollection().find().toArray();
    res.status(200).json(result);
  } catch (error) {
    console.error('GET /characters error:', error);
    res.status(500).json({ message: 'Failed to get characters', error: error.message });
  }
});

router.post('/', ensureAuth, async (req, res) => {
  try {
    const character = buildCharacter(req.body);
    const validationError = validateCharacter(character);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const result = await getCollection().insertOne(character);

    res.status(201).json({
      message: 'Character created successfully',
      id: result.insertedId,
      character: character
    });
   } catch (error) {
    console.error('POST /characters error:', error);
    res.status(500).json({ message: 'Failed to create character', error: error.message });
   }
});

router.put('/:id', ensureAuth, async(req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid character ID' });
    }
    
    const updateCharacter = buildCharacter(req.body);
    const validationError = validateCharacter(updateCharacter);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const result = await getCollection().replaceOne(
      { _id: new ObjectId(req.params.id) },
      updateCharacter
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Character not found' });
    }

    res.status(200).json({
      message: 'Character updated successfully',
      id: req.params.id
    });
  } catch (error) {
    console.error('PUT /characters/:id error:', error);
    res.status(500).json({ message: 'Failed to update character', error: error.message });
  }
});

router.delete('/:id', ensureAuth, async(req, res) => {
  try {
    if(!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid character ID' });
    }

    const result = await getCollection().deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Character not found' });
    }

    res.status(200).json({ message: 'Character deleted successfully' });
  } catch (error) {
    console.error('DELETE /characters/:id error:', error);
    res.status(500).json({ message: 'Failed to delete character', error: error.message });
  }
});

module.exports = router;