const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  alias: String,
  universe: { type: [Strng], enum: ['Comics', 'MCU'] },
  firstApppearance: String,
  powers: [String],
  movies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
  comics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comic' }]
});

module.exports = mongoose.model('Character', characterSchema);