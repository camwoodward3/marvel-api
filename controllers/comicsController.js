const Comic = require('../models/Comic');

// GET all
exports.getAllComics = async (req, res) => {
  try {
    const comics = await Comic.find();
    res.status(200).json(comics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET by ID
exports.getComicById = async (req, res) => {
  try {
    const comic = await Comic.findById(req.params.id);
    if (!comic) {
      return res.status(404).json({ message: 'Comic not found' });
    }
    res.status(200).json(comic);
  } catch (err) {
    res.status(400).json({ message: 'Invalid ID format' });
  }
};

// CREATE
exports.createComic = async (req, res) => {
  try {
    const comic = new Comic(req.body);
    await comic.save();
    res.status(201).json(comic);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// UPDATE (PUT)
exports.updateComic = async (req, res) => {
  try {
    const comic = await Comic.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!comic) {
      return res.status(404).json({ message: 'Comic not found' });
    }
    res.status(200).json(comic);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//DELETE
exports.deleteComic = async (req, res) => {
  try {
    const comic = await Comic.findByIdAndDelete(req.params.id);

    if (!comic) {
      return res.status(404).json({ message: 'Comic not found' });
    }

    res.status(200).json({ message: 'Comic deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid ID format' });
  }
};