const Candidate = require('../models/candidate');
const multer = require('multer');
const { S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const path = require('path');

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 
  },
  fileFilter: fileFilter
});

const uploadToS3 = async (file) => {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  const fileName = `resumes/${uniqueSuffix}${path.extname(file.originalname)}`;
  
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    },
  });

  const result = await upload.done();
  return result.Location;
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  const phoneRegex = /^\+?[\d\s-()]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

const getAllCandidates = async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { jobTitle: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    const candidates = await Candidate.find(query).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: candidates,
      count: candidates.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

const createCandidate = async (req, res) => {
  try {
    const { name, email, phone, jobTitle } = req.body;

    if (!name || !email || !phone || !jobTitle) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    if (!validatePhone(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid phone number'
      });
    }

    const existingCandidate = await Candidate.findOne({ email });
    if (existingCandidate) {
      return res.status(400).json({
        success: false,
        message: 'Candidate with this email already exists'
      });
    }

    const candidateData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      jobTitle: jobTitle.trim()
    };

    // Upload resume to S3 if provided
    if (req.file) {
      try {
        const s3Url = await uploadToS3(req.file);
        candidateData.resumeUrl = s3Url;
      } catch (uploadError) {
        console.error('S3 upload error:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload resume. Please try again.'
        });
      }
    }

    const candidate = new Candidate(candidateData);
    await candidate.save();

    res.status(201).json({
      success: true,
      message: 'Candidate referred successfully',
      data: candidate
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

const updateCandidateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const validStatuses = ['Pending', 'Reviewed', 'Hired'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: Pending, Reviewed, Hired'
      });
    }

    const candidate = await Candidate.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Candidate status updated successfully',
      data: candidate
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

const deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params;

    const candidate = await Candidate.findByIdAndDelete(id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Candidate deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

const getCandidateStats = async (req, res) => {
  try {
    const totalCandidates = await Candidate.countDocuments();
    const pendingCandidates = await Candidate.countDocuments({ status: 'Pending' });
    const reviewedCandidates = await Candidate.countDocuments({ status: 'Reviewed' });
    const hiredCandidates = await Candidate.countDocuments({ status: 'Hired' });

    res.status(200).json({
      success: true,
      data: {
        total: totalCandidates,
        pending: pendingCandidates,
        reviewed: reviewedCandidates,
        hired: hiredCandidates
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

module.exports = {
  getAllCandidates,
  createCandidate,
  updateCandidateStatus,
  deleteCandidate,
  getCandidateStats,
  upload
};