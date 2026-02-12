const mongoose = require('mongoose');

const comicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  issueNumber: { type: Number, required: true}
}, { timestamps: true });

module.exports =
  mongoose.models.Comic ||
  mongoose.model('Comic', comicSchema);