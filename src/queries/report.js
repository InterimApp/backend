const mySql = require("../../config/mySql");

const postReport = async (submitted_by, submitted_to, subject, description) => {
  try {
    const [result] = await mySql.query(
      `INSERT INTO compliance_reports 
       (submitted_by, submitted_to, subject, description, created_at) 
       VALUES (?, ?, ?, ?, NOW())`,
      [submitted_by, submitted_to, subject, description]
    );

    const [report] = await mySql.query(
      `SELECT 
         id,
         subject,
         description,
         DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as date
       FROM compliance_reports WHERE id = ?`,
      [result.insertId]
    );

    return report[0];
  } catch (error) {
    console.error("Error inserting report:", error);
    throw new Error("Database insertion failed");
  }
};

const getUserReports = async (userId) => {
  try {
    const [reports] = await mySql.query(
      `SELECT 
         id,
         subject,
         description,
         DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as date
       FROM compliance_reports 
       WHERE submitted_by = ?
       ORDER BY created_at DESC`,
      [userId]
    );
    return reports;
  } catch (error) {
    console.error("Error fetching reports:", error);
    throw error;
  }
};

module.exports = { postReport, getUserReports };