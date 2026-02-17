const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const candidateRoutes = require('./routes/candidateRoutes');
const authRoutes = require('./routes/authRoutes');

app.use(cors());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use('/uploads', express.static(uploadsDir));

const connectDB = async () => {
  try {

    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    console.error('Full error:', err);
     }
};

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running successfully',
    timestamp: new Date().toISOString(),
    mongoConnected: mongoose.connection.readyState === 1,
    environment: process.env.NODE_ENV || 'development'
  });
});


app.use((error, req, res, next) => {
  console.error('Global error handler caught:', error);
  console.error('Error stack:', error.stack);
  
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File too large. Maximum file size is 5MB.'
    });
  }
  
  if (error.message === 'Only PDF files are allowed!') {
    return res.status(400).json({
      success: false,
      message: 'Only PDF files are allowed for resume upload.'
    });
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'production' ? 'Something went wrong' : error.message
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});