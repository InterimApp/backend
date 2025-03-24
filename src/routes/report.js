const express = require("express");
const router = express.Router();
const { postReportHandler, getUserReportsHandler } = require("../controllers/report");
/**
 * @swagger
 * /reports:
 *   post:
 *     tags: [Reports]
 *     summary: Submit a report
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               submitted_by:
 *                 type: integer
 *               submitted_to:
 *                 type: integer
 *               subject:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Report'
 */
router.post("/", postReportHandler); // Same route definition style
/**
 * @swagger
 * /reports/user/{userId}:
 *   get:
 *     tags: [Reports]
 *     summary: Get reports by user ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of user's reports
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Report'
 */
router.get("/user/:userId", getUserReportsHandler);


module.exports = router;