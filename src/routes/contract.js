const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // Temporarily store files in an "uploads" folder

const {
  getActiveContracts,
  getContractHistory,
  getContractDetails,
  signContract,
  downloadContract,
} = require("../controllers/contract");

// Define routes
router.get("/active", getActiveContracts);
router.get("/history", getContractHistory);
router.get("/:id", getContractDetails);
router.put("/:id/sign", upload.single("signedDocument"), signContract); // Add file upload middleware
router.get("/:id/download", downloadContract);

module.exports = router;