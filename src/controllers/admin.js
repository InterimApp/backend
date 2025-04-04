const { getUsers,  } = require("../queries/admin");
const { deleteUser } = require("../queries/admin");
const { getDashboardData } = require('../queries/admin');
const { getRecruitmentRequests } = require('../queries/admin');
const { deleteRecruitmentRequest } = require('../queries/admin');
const { updateRecruitmentRequestStatus, insertJobOffer} = require('../queries/admin');
const { getJobOffersAndApplicantsService } = require('../services/admin');
const { updateApplicantStatus } = require('../queries/admin');
const { getComplianceReportsService } = require("../services/admin");
const { getAcceptedContracts } = require("../queries/admin");


const getUserHandler = async (req, res) => {
    try {
        const { name } = req.query;

        const users = await getUsers(name);

        if (!users || users.length === 0) {
            return res.status(404).json({ message: "No users found matching the criteria" });
        }

        return res.status(200).json({
            message: "Users fetched successfully",
            users
        });
    } catch (error) {
        console.error("Error in getUserHandler:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Handler to remove user by name
const removeUserHandler = async (req, res) => {
    try {
        const { name } = req.params;

        // Ensure name is provided
        if (!name) {
            return res.status(400).json({ message: "User name must be provided" });
        }

        // Call deleteUser function
        const result = await deleteUser(name);

        // If the result indicates no rows were deleted, return an error
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found or already removed" });
        }

        return res.status(200).json({
            message: "User deleted successfully",
        });
    } catch (error) {
        console.error("Error in removeUserHandler:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};



const getDashboardAdminHandler = async (req, res) => {
    try {
        const data = await getDashboardData();

        // Return the data as a response
        res.status(200).json(data);
    } catch (error) {
        console.error("Error in getDashboardAdminHandler:", error);
        res.status(500).json({ error: "An error occurred while fetching dashboard data." });
    }
};





const getJobPostingRequestAdminHandler = async (req, res) => {
    try {
        const data = await getRecruitmentRequests(); // This function will return the recruitment requests data

        if (data.length === 0) {
            return res.status(404).json({ message: "No recruitment requests found" });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error("Error in getJobPostingRequestAdminHandler:", error);
        res.status(500).json({ error: "An error occurred while fetching recruitment requests." });
    }
};


const removeJobPostingRequestAdminHandler = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await deleteRecruitmentRequest(id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Recruitment request not found" });
        }

        return res.status(200).json({ message: "Recruitment request deleted successfully" });
    } catch (error) {
        console.error("Error deleting recruitment request:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};


const updateRequestToJobPostingHandler = async (req, res) => {
    const { id } = req.params;

    try {
        // Step 1: Update the recruitment request status from 'Pending' to 'Accepted'
        const updateResult = await updateRecruitmentRequestStatus(id);

        if (updateResult.affectedRows === 0) {
            return res.status(404).json({ message: "Recruitment request not found or already accepted" });
        }

        // Step 2: Insert the new job offer into the job_offers table
        await insertJobOffer(id);

        return res.status(200).json({ message: "Recruitment request accepted and job offer created" });
    } catch (error) {
        console.error("Error updating recruitment request and creating job offer:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};


const getJobOffersAndApplicantsHandler = async (req, res) => {
    console.log("Received request to fetch job offers and applicants...");
    
    try {
        console.log("Calling service function...");
        const formattedResponse = await getJobOffersAndApplicantsService();
        console.log("Received response from service function:", formattedResponse);
        res.json(formattedResponse);
    } catch (error) {
        console.error("Error fetching job offers and applicants:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};




const filterApplicantsHandler = async (req, res) => {
    const { action, collaborator_id } = req.query;  // Assuming 'action' and 'collaborator_id' are passed as query params

    if (!action || !collaborator_id) {
        return res.status(400).json({ error: "Missing required parameters" });
    }

    if (action !== 'accepted' && action !== 'rejected') {
        return res.status(400).json({ error: "Invalid action" });
    }

    try {
        console.log(`Updating status for collaborator ${collaborator_id} to ${action}`);
        const status = action === 'accepted' ? 'accepted' : 'rejected';
        
        // Call the service to update the status in the database
        const result = await updateApplicantStatus(status, collaborator_id);

        if (result.affectedRows > 0) {
            return res.status(200).json({ message: `Applicant status updated to ${status}` });
        } else {
            return res.status(404).json({ error: "Applicant not found" });
        }
    } catch (error) {
        console.error("Error updating applicant status:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};


async function getComplianceReportsHandler(req, res) {
    try {
        console.log("Fetching compliance reports...");
        const reports = await getComplianceReportsService();
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}



const getContractsHandler = async (req, res) => {
    try {
        const contracts = await getAcceptedContracts();
        return res.status(200).json({ message: "Contracts fetched successfully", contracts });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


module.exports = { getUserHandler,removeUserHandler,getDashboardAdminHandler, getJobPostingRequestAdminHandler,removeJobPostingRequestAdminHandler,updateRequestToJobPostingHandler,getJobOffersAndApplicantsHandler,filterApplicantsHandler,getComplianceReportsHandler,getContractsHandler };
