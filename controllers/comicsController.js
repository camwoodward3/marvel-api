const Comic = require('../models/Comic');

exports.getAllComics = async (req, res) => {
  const comics = await Comic.find();
  res.json(comics);
};

exports.getComicById = async (req, res) => {
  const comic = await Comic.findById(req.params.id);
  if (!comic) return res.status(404).json({ message: 'Comic not found' });
  res.json(comic);
};

exports.createComic = async (req, res) => {
  const comic = new Comic(req.body);
  await comic.save();
  res.status(201).json(comic);
}