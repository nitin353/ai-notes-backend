require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const summaryRoutes = require('./routes/summaries');

const app = express();

// ----------------- CORS -----------------
app.use(cors({
  origin: [
    'https://ai-notes-frontend-pi.vercel.app',
    'https://ai-notes-frontend-eedip516j-nitin-nandas-projects.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/summaries', summaryRoutes);

const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => console.error('MongoDB connection error:', err));
