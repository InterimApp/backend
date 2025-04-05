const express = require('express');
const router = express.Router();
const {
  getPayslipsHandler,
  getPayslipDetailsHandler,
  downloadPayslipHandler
} = require('../controllers/payslips');

// Make sure these routes match what you're calling from Postman
router.get('/user/:userId', getPayslipsHandler);
router.get('/:id', getPayslipDetailsHandler);
router.get('/download/:id', downloadPayslipHandler);  // This is the endpoint you're testing

module.exports = router;