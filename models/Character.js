const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  alias: String,
  universe: { type: [String], enum: ['Comics', 'MCU'], required: true },
  firstAppearance: String,
  powers: [String],
  movies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
  comics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comic' }]
}, { timestamps: true });

module.exports = mongoose.model('Character', characterSchema);