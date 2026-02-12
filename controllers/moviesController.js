const Movie = require('../models/Movie');

exports.getAllMovies = async (req, res) => {
    try {
        const movies = await Movie.find().lean();
        res.json(movies);
      }  catch (err) {
        res.status(500).json({ message: 'Failed to fetch movies '});
      }
};

exports.getMovieById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid movie ID' });
    }
    const movie = await Movie.findById(id).lean();
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch movie' });
  }
};

exports.createMovie = async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    res.status(201).json(movie);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create movie', error: err.message });
  }
};