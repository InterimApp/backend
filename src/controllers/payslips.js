const { getPayslipsByUser, getPayslipDetails } = require('../queries/payslips');
const { bucket } = require('../../config/firebase');

// In controllers/payslips.js
const getPayslipsHandler = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(`Fetching payslips for user ${userId}`); // Debug log
    
    if (!userId || isNaN(userId)) {
      return res.status(400).json({
        status: "fail",
        message: "Valid user ID is required"
      });
    }

    const payslips = await getPayslipsByUser(userId);
    console.log('Database returned:', payslips); // Debug log
    
    res.status(200).json({
      status: "success",
      data: payslips
    });
   
  } catch (error) {
    console.error("Error in getPayslipsHandler:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to fetch payslips"
    });
  }
};

const getPayslipDetailsHandler = async (req, res) => {
  try {
    const payslipId = req.params.id;
    
    if (!payslipId || isNaN(payslipId)) {
      return res.status(400).json({
        status: "fail",
        message: "Valid payslip ID is required"
      });
    }

    const payslip = await getPayslipDetails(payslipId);
    
    if (!payslip) {
      return res.status(404).json({
        status: "fail",
        message: "Payslip not found"
      });
    }

    res.status(200).json({
      status: "success",
      data: payslip
    });
  } catch (error) {
    console.error("Error in getPayslipDetailsHandler:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to fetch payslip details"
    });
  }
};

const downloadPayslipHandler = async (req, res) => {
  try {
    const payslipId = req.params.id;
    console.log(`Download requested for payslip ID: ${payslipId}`);

    // Get the payslip file path from database
    const [[payslip]] = await mySql.query(
      `SELECT payslip_path FROM payslips WHERE id = ?`,
      [payslipId]
    );

    if (!payslip?.payslip_path) {
      console.error('Payslip path not found for ID:', payslipId);
      return res.status(404).json({
        status: "fail",
        message: "Payslip file not found"
      });
    }

    console.log('Found payslip path:', payslip.payslip_path);

    // For local files (development):
    if (payslip.payslip_path.startsWith('/')) {
      const filePath = path.join(__dirname, '../../uploads', payslip.payslip_path);
      return res.download(filePath);
    }
    
    // For Firebase Storage files (production):
    const file = bucket.file(payslip.payslip_path);
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 15 * 60 * 1000 // 15 minutes
    });

    res.status(200).json({
      status: "success",
      data: { downloadUrl: url }
    });

  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to generate download URL"
    });
  }
};

module.exports = {
  getPayslipsHandler,
  getPayslipDetailsHandler,
  downloadPayslipHandler
};