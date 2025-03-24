const express = require("express");
const router = express.Router();
const { getUserProfile, updateUserProfile } = require("../controllers/profile");

// Use /api/user/:id for both GET and PUT requests
router.get("/:id", getUserProfile); // For fetching user profile
router.put("/:id", updateUserProfile); // For updating user profile (changed from POST to PUT)

module.exports = router;