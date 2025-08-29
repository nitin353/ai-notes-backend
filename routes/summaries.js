const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const { parseFile } = require('../services/parser');
const { summarizeText } = require('../services/ai');
const Summary = require('../models/Summary');

const upload = multer({ dest: path.join(__dirname, '..', 'uploads/') });

// create summary from text
router.post('/from-text', authMiddleware, async (req,res)=>{
  const { text, title, length } = req.body;
  try {
    const summary = await summarizeText(text, { length });
    const doc = await Summary.create({
      userId: req.user.id,
      originalText: text,
      summaryText: summary,
      title: title || 'Untitled',
      length
    });
    res.json(doc);
  } catch (err) { res.status(500).json({ message: err.message }) }
});

// upload file and summarize
router.post('/from-file', authMiddleware, upload.single('file'), async (req,res)=>{
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: 'No file uploaded' });
    const text = await parseFile(file.path, file.mimetype);
    const summary = await summarizeText(text, { length: req.body.length || 'short' });
    const doc = await Summary.create({
      userId: req.user.id,
      originalText: text,
      summaryText: summary,
      title: req.body.title || file.originalname,
      sourceFile:` /uploads/${file.filename}`,
      length: req.body.length || 'short'
    });
    res.json(doc);
  } catch (err) { res.status(500).json({ message: err.message }) }
});

// list user summaries
router.get('/', authMiddleware, async (req,res)=>{
  const summaries = await Summary.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(summaries);
});

// get a single summary
router.get('/:id', authMiddleware, async (req,res)=>{
  const doc = await Summary.findOne({ _id: req.params.id, userId: req.user.id });
  if (!doc) return res.status(404).json({ message: 'Not found' });
  res.json(doc);
});

// delete
router.delete('/:id', authMiddleware, async (req,res)=>{
  const removed = await Summary.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  if (!removed) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
});

module.exports = router;