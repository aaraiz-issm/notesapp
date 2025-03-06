const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Pdf = require('../models/pdfModel');

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'data'); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extName = path.extname(file.originalname);
    cb(null, uniqueSuffix + extName);
  }
});

const upload = multer({ storage });

// =========================
//  POST /api/pdfs
//  Upload a PDF and store metadata
// =========================
router.post('/', upload.single('pdf'), async (req, res) => {
  try {
    const {
      title,
      courseName,
      courseCode,
      instructorName,
      universityName
    } = req.body;

    // The file path where the PDF got stored
    const filePath = req.file.path; 

    const newPdf = new Pdf({
      title,
      courseName,
      courseCode,
      instructorName,
      universityName,
      filePath
    });

    await newPdf.save();

    res.status(201).json({
      message: 'PDF uploaded successfully',
      pdf: newPdf
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to upload PDF' });
  }
});

// =========================
//  GET /api/pdfs
//  Get all PDF metadata
// =========================
router.get('/', async (req, res) => {
  try {
    const pdfs = await Pdf.find({});
    res.json(pdfs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch PDFs' });
  }
});

// =========================
//  GET /api/pdfs/search
//  Find PDFs by instructorName, universityName, or courseCode
//  Query example:
//    /api/pdfs/search?instructorName=John&universityName=ABC&courseCode=COMP101
//  Any combination of these three is valid
// =========================
router.get('/search', async (req, res) => {
  try {
    const { instructorName, universityName, courseCode } = req.query;

    // Build a filter object with case-insensitive regex for partial matching
    const filter = {};
    if (instructorName) {
      filter.instructorName = { $regex: instructorName, $options: 'i' };
    }
    if (universityName) {
      filter.universityName = { $regex: universityName, $options: 'i' };
    }
    if (courseCode) {
      filter.courseCode = { $regex: courseCode, $options: 'i' };
    }

    const results = await Pdf.find(filter);
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to search PDFs' });
  }
});

// =========================
//  GET /api/pdfs/:id/file
//  Serve the actual PDF file from local storage
// =========================
router.get('/:id/file', async (req, res) => {
  try {
    const pdf = await Pdf.findById(req.params.id);
    if (!pdf) {
      return res.status(404).json({ error: 'PDF not found' });
    }
    res.sendFile(path.resolve(pdf.filePath));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to download PDF' });
  }
});

// =========================
//  GET /api/pdfs/:id
//  Get single PDF metadata by ID
// =========================
router.get('/:id', async (req, res) => {
  try {
    const pdf = await Pdf.findById(req.params.id);
    if (!pdf) {
      return res.status(404).json({ error: 'PDF not found' });
    }
    res.json(pdf);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch PDF' });
  }
});

module.exports = router;
