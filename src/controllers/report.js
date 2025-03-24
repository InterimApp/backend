const { postReport, getUserReports } = require("../queries/report");

const postReportHandler = async (req, res) => {
    try {
        // EXACT same validation pattern as users
        const { submitted_by, submitted_to, subject, description } = req.body;
        
        if (!submitted_by || !submitted_to || !subject || !description) {
            return res.status(400).json({ 
                status: "fail", 
                message: "All fields are required" // Same response format
            });
        }

        // Same DB call pattern
        const report = await postReport(submitted_by, submitted_to, subject, description);

        // Same success response structure
        return res.status(201).json({ 
            status: "success",
            message: "Report submitted successfully",
            data: report 
        });
    } catch (error) {
        // Identical error handling
        console.error("Error in postReportHandler:", error);
        return res.status(500).json({ 
            status: "fail",
            message: error.message || "Failed to submit report" 
        });
    }
};
const getUserReportsHandler = async (req, res) => {
    try {
        const userId = req.params.userId;
        
        if (!userId || isNaN(userId)) {
            return res.status(400).json({
                status: "fail",
                message: "Valid user ID is required"
            });
        }

        const reports = await getUserReports(userId);
        
        res.status(200).json({
            status: "success",
            data: reports
        });
    } catch (error) {
        console.error("Error in getUserReportsHandler:", error);
        res.status(500).json({
            status: "fail",
            message: error.message || "Failed to fetch reports"
        });
    }
};

module.exports = { 
    postReportHandler,
    getUserReportsHandler // Add this export
};

