const express = require('express');
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');


// Protected route - Only logged-in users can access
router.post('/mark', verifyToken, async (req, res) => {
    const { date, status } = req.body;
    const studentId = req.user.userId;
  
    const record = await Attendance.create({ studentId, date, status });
    res.json(record);
  });
  
  router.get('/my', verifyToken, async (req, res) => {
    const studentId = req.user.userId;
    const records = await Attendance.find({ studentId });
    res.json(records);
  });


//// Admin can mark attendance for any student
router.post('/mark-admin', verifyToken, async (req, res) => {
  if (!['admin', 'teacher'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Access denied.' });
  }

  const { studentId, date, status } = req.body;
  try {
    const record = await Attendance.create({ studentId, date, status });
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark attendance' });
  }
});


// 🔸 View Attendance Records
router.get('/all', verifyToken, async (req, res) => {
    if (!['admin', 'teacher'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied.' });
    }
  
    const records = await Attendance.find().populate('studentId', 'name email');
    res.json(records);
  });
  
module.exports = router;
