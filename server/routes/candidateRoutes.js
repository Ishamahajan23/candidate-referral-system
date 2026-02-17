const express = require('express');
const router = express.Router();
const {
  getAllCandidates,
  createCandidate,
  updateCandidateStatus,
  deleteCandidate,
  getCandidateStats,
  upload
} = require('../controllers/candidateController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getAllCandidates);

router.get('/stats', getCandidateStats);

router.post('/', upload.single('resume'), createCandidate);

router.put('/:id/status', updateCandidateStatus);

router.delete('/:id', deleteCandidate);

module.exports = router;