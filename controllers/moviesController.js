const Movie = require('../models/Movie');

exports.getAllMovies = async (req, res) => {
  const movies = await Movie.find();
  res.json(movies);
};

exports.getMovieById = async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).json({ message: 'Character not found' });
  res.json(movie);
};

exports.movieCharacter = async (req, res) => {
  const movie = new Movie(req.body);
  await movie.save();
  res.status(201).json(movie);
}