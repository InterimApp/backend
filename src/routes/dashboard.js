const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard');

// Worker dashboard endpoints
router.get('/:workerId', dashboardController.getDashboardData);
router.get('/:workerId/jobs/search', dashboardController.searchJobs);

// Job applications endpoint - now properly prefixed with /dashboard
router.post('/job-applications', dashboardController.applyForJob);

module.exports = router;