const express = require("express");
const {
    removeUserHandler,
    getDashboardAdminHandler,
    getJobPostingRequestAdminHandler,
    removeJobPostingRequestAdminHandler,
    updateRequestToJobPostingHandler,
    getJobOffersAndApplicantsHandler,
    filterApplicantsHandler,
    getComplianceReportsHandler,  
    getContractsHandler,
    getAllUsersHandler,
    getUsersByTagHandler,
    uploadContractPerUserHandler,
    getPayslipsHandler
} = require("../controllers/admin");

const router = express.Router();

// Route for fetching users by name



/**
 * @swagger
 * /api/admin/allUsers:
 *   get:
 *     tags:
 *       - Admin API
 *     summary: Fetch all users (excluding admin)
 *     description: Retrieves all users from the database, excluding those with the 'admin' role. It will return basic information for users based on their roles (e.g., candidates, interim collaborators, client companies).
 *     responses:
 *       200:
 *         description: Successfully retrieved users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 2
 *                   name:
 *                     type: string
 *                     example: "Alice Smith"
 *                   role:
 *                     type: string
 *                     example: "candidate"
 *                   additional_data:
 *                     type: object
 *                     properties:
 *                       code_interimaire:
 *                         type: string
 *                         example: "IC001"
 *                       company_name:
 *                         type: string
 *                         example: "Tech Corp"
 *       400:
 *         description: Bad request (e.g., database query error)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error fetching users"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error fetching users"
 */
router.get('/allUsers', getAllUsersHandler);

/**
 * @swagger
 * /api/admin/userFetch:
 *   get:
 *     tags:
 *       - Admin API
 *     summary: Fetch users by a specific tag (e.g., role)
 *     description: Retrieves users based on a specific tag or filter (e.g., users with a particular role like 'candidate', 'interim_collaborator', etc.).
 *     parameters:
 *       - name: tag
 *         in: query
 *         description: The tag or filter to apply (e.g., role of the user)
 *         required: true
 *         schema:
 *           type: string
 *           example: "candidate"
 *     responses:
 *       200:
 *         description: Successfully retrieved users by tag
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 6
 *                   name:
 *                     type: string
 *                     example: "Nada Arfaoui"
 *                   role:
 *                     type: string
 *                     example: "candidate"
 *                   additional_data:
 *                     type: object
 *                     properties:
 *                       code_interimaire:
 *                         type: string
 *                         example: "IC002"
 *       400:
 *         description: Bad request (e.g., invalid tag)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid tag provided"
 *       404:
 *         description: No users found for the provided tag
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No users found for this tag"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error fetching users by tag"
 */
router.get('/userFetch', getUsersByTagHandler);

/**
 * @swagger
 * /api/admin/users/{name}:
 *   delete:
 *     tags:
 *       - Admin API
 *     summary: Delete a user by name
 *     description: Deletes a user from the `users` table along with related records in the `client_companies` and `interim_collaborators` tables.
 *     parameters:
 *       - name: name
 *         in: path
 *         description: The name of the user to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User deleted successfully"
 *       400:
 *         description: Bad request (e.g., user not found)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error deleting user"
 */
router.delete("/users/:name", removeUserHandler); 





/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     tags:
 *       - Admin API
 *     summary: Get the Admin Dashboard data
 *     description: Returns the total number of registered companies, total interim workers, and total active missions.
 *     responses:
 *       200:
 *         description: Successfully retrieved the dashboard data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_interim_collaborators:
 *                   type: integer
 *                   example: 10
 *                 total_client_companies:
 *                   type: integer
 *                   example: 5
 *                 total_active_missions:
 *                   type: integer
 *                   example: 3
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error retrieving dashboard data"
 */
router.get("/dashboard", getDashboardAdminHandler); 


/**
 * @swagger
 * /api/admin/job-postings/requests:
 *   get:
 *     tags:
 *       - Admin API
 *     summary: Fetch job posting requests
 *     description: Returns a list of job posting requests with company information and job details.
 *     responses:
 *       200:
 *         description: Successfully fetched the list of job posting requests.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   company_name:
 *                     type: string
 *                     example: "Tech Innovations"
 *                   job_title:
 *                     type: string
 *                     example: "Software Developer"
 *                   job_description:
 *                     type: string
 *                     example: "Develop and maintain software solutions."
 *                   required_experience:
 *                     type: string
 *                     example: "3"
 *                   status:
 *                     type: string
 *                     example: "pending"
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-02-28T23:00:00.000Z"
 *       404:
 *         description: No job posting requests found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No job posting requests found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 *                 error:
 *                   type: string
 *                   example: "Error fetching job posting requests: ..."
 */
router.get("/job-postings/requests", getJobPostingRequestAdminHandler);


/**
 * @swagger
 * /api/admin/job-postings/requests/{id}:
 *   delete:
 *     tags:
 *       - Admin API
 *     summary: Delete a recruitment request by ID
 *     description: Deletes a recruitment request from the `recruitment_requests` table based on the provided ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the recruitment request to delete
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Recruitment request successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Recruitment request deleted successfully"
 *       404:
 *         description: Recruitment request not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Recruitment request not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */

router.delete("/job-postings/requests/:id", removeJobPostingRequestAdminHandler);


/**
 * @swagger
 * /api/admin/job-postings/requests/{id}:
 *   put:
 *     tags:
 *       - Admin API
 *     summary: Update a job posting request
 *     description: Updates a job posting request by changing its status or modifying details.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the job posting request to update
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "approved"
 *               job_title:
 *                 type: string
 *                 example: "Software Engineer"
 *               job_description:
 *                 type: string
 *                 example: "Responsible for developing and maintaining software applications."
 *               required_experience:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Job posting request successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Job posting request updated successfully"
 *       400:
 *         description: Bad request (e.g., missing fields or invalid data)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid request data"
 *       404:
 *         description: Job posting request not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Job posting request not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.put("/job-postings/requests/:id", updateRequestToJobPostingHandler);



/**
 * @swagger
 * /api/admin/job-offers/applicants:
 *   get:
 *     tags:
 *       - Admin API
 *     summary: Get job offers and their applicants
 *     description: Retrieves job offers along with the applicants who applied.
 *     responses:
 *       200:
 *         description: A list of job offers and their applicants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   job_offer_id:
 *                     type: integer
 *                     example: 1
 *                   job_title:
 *                     type: string
 *                     example: "Software Engineer"
 *                   company_name:
 *                     type: string
 *                     example: "TechCorp"
 *                   name:
 *                     type: string
 *                     example: "John Doe"
 *                   job_created_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-03-26T10:00:00.000Z"
 *                   applicant_id:
 *                     type: integer
 *                     example: 5
 *                   cv_path:
 *                     type: string
 *                     example: "/cv/johndoe.pdf"
 *                   academic_level:
 *                     type: string
 *                     example: "Master's Degree"
 *                   profession:
 *                     type: string
 *                     example: "Software Developer"
 *                   experience_years:
 *                     type: integer
 *                     example: 3
 *                   age:
 *                     type: integer
 *                     example: 28
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get("/job-offers/applicants", getJobOffersAndApplicantsHandler);


/**
 * @swagger
 * /applicants/filter:
 *   get:
 *     tags:
 *       - Admin API
 *     summary: Update applicant status based on action
 *     description: Updates the status of an applicant to either accepted or rejected based on the action sent from the front-end.
 *     parameters:
 *       - in: query
 *         name: action
 *         required: true
 *         schema:
 *           type: string
 *           enum:
 *             - accepted
 *             - rejected
 *           description: "The action to perform on the applicant (accepted or rejected)."
 *       - in: query
 *         name: collaborator_id
 *         required: true
 *         schema:
 *           type: integer
 *           description: "The ID of the collaborator whose status is being updated."
 *     responses:
 *       200:
 *         description: Applicant status updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Applicant status updated to accepted"
 *       400:
 *         description: Bad request due to missing or invalid parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid action or missing parameters"
 *       404:
 *         description: Applicant not found, no status updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Applicant not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get("/applicants/filter", filterApplicantsHandler);


/**
 * @swagger
 * /api/admin/compliance-reports:
 *   get:
 *     tags:
 *       - Admin API
 *     summary: Get all compliance reports
 *     description: Fetches all compliance reports stored in Firestore.
 *     responses:
 *       200:
 *         description: A list of compliance reports.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "abc123"
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-03-26T10:00:00.000Z"
 *                   description:
 *                     type: string
 *                     example: "This is a compliance report regarding policy violations."
 *                   report_url:
 *                     type: string
 *                     example: "https://example.com/report.pdf"
 *                   subject:
 *                     type: string
 *                     example: "Policy Violation"
 *                   submitted_by:
 *                     type: string
 *                     example: "john.doe@example.com"
 *                   submitted_to:
 *                     type: string
 *                     example: "compliance.manager@example.com"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get("/compliance-reports", getComplianceReportsHandler);


/**
 * @swagger
 * /api/admin/contracts:
 *   get:
 *     tags:
 *       - Admin API
 *     summary: Retrieve contracts for accepted job applications
 *     description: Fetches interim collaborator details, company details, and contract information for job applications that have been accepted.
 *     responses:
 *       200:
 *         description: Successfully fetched contract details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Contracts fetched successfully"
 *                 contracts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       interim_collaborator_name:
 *                         type: string
 *                         example: "John Doe"
 *                       company_name:
 *                         type: string
 *                         example: "Tech Solutions"
 *                       signed:
 *                         type: boolean
 *                         example: true
 *                       contract_url:
 *                         type: string
 *                         example: "https://example.com/contract.pdf"
 *                       uploaded_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-03-27T00:00:00.000Z"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 *                 error:
 *                   type: string
 *                   example: "Error fetching contract data"
 */
router.get("/contracts", getContractsHandler); 

/*

router.post("/contracts/upload", uploadContractPerUserHandler); // Upload contract

// Payslips
router.post("/payslips/upload", getPayslipsHandler);
*/


module.exports = router;
