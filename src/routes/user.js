const express = require("express");
const { postUserHandler } = require("../controllers/user");
const { getJobOffersByRoleLocation } = require("../controllers/user");

const router = express.Router();

// Route for condidate creation
/**
 * @swagger
 * /api/users/createUsers:
 *   post:
 *     tags:
 *       - Users API
 *     summary: Create a new user (candidate or client company)
 *     description: This endpoint allows the creation of a new user. The user can be a candidate or a client company. 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 description: Role of the user. Can be either 'candidate' or 'client_company'.
 *                 example: "candidate"
 *               email:
 *                 type: string
 *                 description: Email of the user (required for candidates).
 *                 example: "example@email.com"
 *               password:
 *                 type: string
 *                 description: Password for the user.
 *                 example: "password123"
 *               codeInterimaire:
 *                 type: string
 *                 description: A unique code for interim workers (if role is 'candidate').
 *                 example: "eb126016-c3cd-4509-b1ce-e55a57fcdbac"
 *               companyName:
 *                 type: string
 *                 description: The name of the company (required for 'client_company' role).
 *                 example: "Deloitte"
 *               matriculeFiscale:
 *                 type: string
 *                 description: The fiscal registration number of the company (required for 'client_company' role).
 *                 example: "DE1578L"
 *     responses:
 *       201:
 *         description: User successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User created successfully"
 *       400:
 *         description: Bad request. Missing or invalid parameters.
 *       500:
 *         description: Server error.
 */

router.post("/createUsers", postUserHandler);


//fetch job offers by job and location for interim worker or condidate
/**
 * @swagger
 * /api/user/fetchJobs:
 *   get:
 *     tags:
 *       - Users API
 *     summary: Fetch job offers based on role and location
 *     description: This endpoint retrieves job offers based on the provided role and location. If no filters are provided, it returns all job offers.
 *     parameters:
 *       - in: query
 *         name: role
 *         description: The job role (e.g., Software Developer).
 *         required: false
 *         schema:
 *           type: string
 *           example: "Software Developer"
 *       - in: query
 *         name: location
 *         description: The job location (e.g., Tunis).
 *         required: false
 *         schema:
 *           type: string
 *           example: "Tunis"
 *     responses:
 *       200:
 *         description: Job offers fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Job offers fetched successfully"
 *                 jobOffers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       location:
 *                         type: string
 *                         example: "Tunis"
 *                       required_experience:
 *                         type: integer
 *                         example: 3
 *                       salary:
 *                         type: string
 *                         example: "1500.00"
 *                       duration:
 *                         type: integer
 *                         example: 12
 *                       job:
 *                         type: string
 *                         example: "Software Developer"
 *                       company_name:
 *                         type: string
 *                         example: "Tech Innovations"
 *       400:
 *         description: Bad request. Either role or location must be provided.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Either 'role' or 'location' must be provided"
 *       404:
 *         description: No job offers found matching the criteria.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No job offers found matching the criteria"
 *       500:
 *         description: Server error. Unable to fetch job offers.
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
 *                   example: "Database connection error"
 */

router.get("/fetchJobs", getJobOffersByRoleLocation);




module.exports = router;
