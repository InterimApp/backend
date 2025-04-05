const express = require("express");
const router = express.Router();
const { 
    getUserProfile, 
    updateUserProfile 
} = require("../controllers/profile");
const cvUpload = require("../../middlewares/cvUpload");

// Get user profile
router.get("/:id", getUserProfile);

// Update profile
router.put("/:id", updateUserProfile);

// Upload CV
router.post("/:id/cv", cvUpload.single('cv'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                status: 'error',
                message: "No file uploaded" 
            });
        }

        await pool.query(
            "UPDATE interim_collaborators SET cv_path = ? WHERE user_id = ?",
            [req.file.filename, req.params.id]
        );

        res.status(200).json({ 
            status: 'success',
            message: "CV uploaded successfully",
            filename: req.file.filename,
            path: `/uploads/cvs/${req.file.filename}`
        });

    } catch (error) {
        console.error("CV upload error:", error);
        res.status(500).json({ 
            status: 'error',
            message: "Failed to upload CV",
            error: error.message 
        });
    }
});

module.exports = router;