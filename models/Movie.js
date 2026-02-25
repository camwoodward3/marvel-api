const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  releaseDate: Date,
  characters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Character' }]
}, { timestamps: true});

module.exports =
  mongoose.models.Movie ||
  mongoose.model('Movie', movieSchema);