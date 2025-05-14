const express = require('express');
const Attendance = require('../models/Attendance');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

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

router.post('/mark-admin', verifyToken, async (req, res) => {
    if (!['admin', 'teacher'].includes(req.user.role)) {
        return res.status(403).json({ error: 'Access denied.' });
    }

    const { studentId, date, status } = req.body;
    const record = await Attendance.create({ studentId, date, status });
    res.json(record);
});

router.get('/all', verifyToken, async (req, res) => {
    if (!['admin', 'teacher'].includes(req.user.role)) {
        return res.status(403).json({ error: 'Access denied.' });
    }

    const records = await Attendance.find().populate('studentId', 'name email');
    res.json(records);
});

module.exports = router;
