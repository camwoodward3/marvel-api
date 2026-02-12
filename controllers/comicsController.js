const Comic = require('../models/Comic');

exports.getAllComics = async (req, res) => {
  try {
    const comics = await Comic.find().lean();
    res.json(comics);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch comics' });
  }
};

exports.getComicById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid comic ID' });
    }

    const comic = await Comic.findById(id).lean();
    if (!comic) return res.status(404).json({ message: 'Comic not found' });

    res.json(comic);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch comic' });
  }
};

exports.createComic = async (req, res) => {
  try {
    const comic = new Comic(req.body);
    await comic.save();
    res.status(201).json(comic);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create omic', error: err.message });
  }
};