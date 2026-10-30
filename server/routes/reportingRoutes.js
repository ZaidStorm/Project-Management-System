const express = require('express');
const router = express.Router({ mergeParams: true });
const reportingController = require('../controllers/reportingController');

router.get('/performance', reportingController.getPerformanceDashboard);
router.get('/report', reportingController.getFullReport);

module.exports = router;
