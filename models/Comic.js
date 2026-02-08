const mongoose = require('mongoose');

const comicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  releaseDate: Date,
  characters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Character' }]
});

module.exports = mongoose.model('Comic', comicSchema);