const { getPayslipsByUser, getPayslipDetails } = require("../queries/payslips");

const getPayslipsHandler = async (req, res) => {
    try {
        const userId = req.params.userId;
        
        if (!userId || isNaN(userId)) {
            return res.status(400).json({
                status: "fail",
                message: "Valid user ID is required"
            });
        }

        const payslips = await getPayslipsByUser(userId);
        
        res.status(200).json({
            status: "success",
            data: payslips
        });
    } catch (error) {
        console.error("Error in getPayslipsHandler:", error);
        res.status(500).json({
            status: "fail",
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
            status: "fail",
            message: error.message || "Failed to fetch payslip details"
        });
    }
};

module.exports = { 
    getPayslipsHandler,
    getPayslipDetailsHandler
};