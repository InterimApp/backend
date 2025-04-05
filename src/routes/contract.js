const express = require('express');
const router = express.Router();
const contractController = require('../controllers/contract');
const { mockAuthenticate } = require('../middleware/auth'); // Use mock instead

// Apply mock auth to all routes
router.use(mockAuthenticate);

router.get('/', contractController.getContractsByUser);
router.get('/:id', contractController.getContractDetails);
router.post('/:id/sign', contractController.signContract);
router.get('/:id/download', contractController.downloadContract);

module.exports = router;