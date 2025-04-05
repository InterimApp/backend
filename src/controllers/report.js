const { postReport, getUserReports } = require("../queries/report");

const postReportHandler = async (req, res) => {
  try {
    console.log("Request body:", req.body); // Debug logging
    
    const { submitted_by, submitted_to, subject, description } = req.body;
    
    if (!submitted_by || !submitted_to || !subject || !description) {
      return res.status(400).json({ 
        status: "fail", 
        message: "Tous les champs obligatoires doivent être remplis" 
      });
    }

    const report = await postReport(submitted_by, submitted_to, subject, description);

    return res.status(201).json({ 
      status: "success",
      message: "Report submitted successfully",
      data: {
        id: report.id,
        subject: report.subject,
        description: report.description,
        created_at: report.date
      }
    });
  } catch (error) {
    console.error("Error in postReportHandler:", error);
    return res.status(500).json({ 
      status: "fail",
      message: error.message || "Échec de la soumission du rapport" 
    });
  }
};

const getUserReportsHandler = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    if (!userId) {
      return res.status(400).json({
        status: "fail",
        message: "ID utilisateur requis"
      });
    }

    const reports = await getUserReports(userId);
    
    return res.status(200).json({
      status: "success",
      data: reports
    });
  } catch (error) {
    console.error("Error in getUserReportsHandler:", error);
    return res.status(500).json({
      status: "fail",
      message: error.message || "Échec de la récupération des rapports"
    });
  }
};

module.exports = { postReportHandler, getUserReportsHandler };