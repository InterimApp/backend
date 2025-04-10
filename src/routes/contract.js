const express = require('express');
const router = express.Router();
const contractController = require('../controllers/contract');

// Temporary testing route - will be replaced with proper auth later
router.get('/', contractController.getContractsByUser);
router.get('/:id', contractController.getContractDetails);
router.post('/:id/sign', contractController.signContract);
router.get('/:id/download', contractController.downloadContract);

module.exports = router;