const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const candidateRoutes = require('./routes/candidateRoutes');



app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use('/uploads', express.static(uploadsDir));

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('MongoDB URI exists:', !!process.env.MONGO_URI);
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    console.error('Full error:', err);
   
    setTimeout(connectDB, 5000); 
  }
};

connectDB();


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




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});