const express = require("express");
const { getPayslipsHandler, getPayslipDetailsHandler } = require("../controllers/payslips");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payslips
 *   description: Payslip management
 */

/**
 * @swagger
 * /payslips/user/{userId}:
 *   get:
 *     summary: Get payslips for a user
 *     tags: [Payslips]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of payslips
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
 *                     $ref: '#/components/schemas/Payslip'
 */
router.get("/user/:userId", getPayslipsHandler);

/**
 * @swagger
 * /payslips/{id}:
 *   get:
 *     summary: Get payslip details
 *     tags: [Payslips]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Payslip details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/PayslipDetails'
 */
router.get("/:id", getPayslipDetailsHandler);

module.exports = router;