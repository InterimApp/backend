const express = require("express");
const { postUserHandler } = require("../controllers/user");
const router = express.Router();

// Route for user creation
router.post("/createUsers", postUserHandler);

module.exports = router;
