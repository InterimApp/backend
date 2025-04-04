const express = require("express");
const {
    getUserHandler,
    removeUserHandler,
    getDashboardAdminHandler,
    getJobPostingRequestAdminHandler,
    removeJobPostingRequestAdminHandler,
    updateRequestToJobPostingHandler,
    getJobOffersAndApplicantsHandler,
    filterApplicantsHandler,
    getComplianceReportsHandler,  
    getContractsHandler,
    uploadContractPerUserHandler,
    getPayslipsHandler
} = require("../controllers/admin");

const router = express.Router();

// Route for fetching users by name
/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Retrieve a list of users or user data by name
 *     description: Fetches all users or data for a specific user based on the provided name.
 *     parameters:
 *       - in: query
 *         name: name
 *         required: false
 *         schema:
 *           type: string
 *         description: The name of the user to filter by. If not provided, fetches all users.
 *     responses:
 *       200:
 *         description: A list of users or user details based on the name provided.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The unique ID of the user.
 *                   name:
 *                     type: string
 *                     description: The name of the user.
 *                   role:
 *                     type: string
 *                     description: The role of the user.
 *                   code_interimaire:
 *                     type: string
 *                     description: The interim code for interim collaborators.
 *                   academic_level:
 *                     type: string
 *                     description: The academic level of the user.
 *                   location:
 *                     type: string
 *                     description: The location of the user.
 *                   profession:
 *                     type: string
 *                     description: The profession of the user.
 *                   experience_years:
 *                     type: integer
 *                     description: The number of years of experience.
 *                   age:
 *                     type: integer
 *                     description: The age of the user.
 *                   gender:
 *                     type: string
 *                     description: The gender of the user.
 *                   company_name:
 *                     type: string
 *                     description: The company name (for client companies).
 *                   matricule_fiscale:
 *                     type: string
 *                     description: The fiscal registration number (for client companies).
 *                   industry:
 *                     type: string
 *                     description: The industry of the company (for client companies).
 *       400:
 *         description: Bad request due to missing or invalid parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A description of the error.
 *       404:
 *         description: No user found with the provided name.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A description of the error.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A description of the error.
 */



router.get("/users", getUserHandler); 


/**
 * @swagger
 * /api/admin/users/{name}:
 *   delete:
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
 * /api/contracts:
 *   get:
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
