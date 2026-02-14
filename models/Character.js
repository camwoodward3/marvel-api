const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  alias: {
    type: String,
    trim: true
  },
  universe: { 
    type: [String], 
    enum: ['Comics', 'MCU'], 
    required: true },
  firstAppearance: {
    type: String
  },
  powers: [String],
  movies: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Movie' 
  }],
  comics: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Comic'
  }]
}, { timestamps: true });

module.exports = 
  mongoose.models.Character ||
  mongoose.model('Character', characterSchema);