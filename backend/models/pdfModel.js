const mongoose = require('mongoose');

const pdfSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  courseName: {
    type: String,
    required: true
  },
  courseCode: {
    type: String,
    required: true
  },
  instructorName: {
    type: String,
    required: true
  },
  universityName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
}, { timestamps: true });

module.exports = mongoose.model('Pdf', pdfSchema);
