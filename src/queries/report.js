const mySql = require("../../config/mySql"); // Same DB import

const postReport = async (submitted_by, submitted_to, subject, description) => {
    try {
        // Same query execution pattern
        const [result] = await mySql.query(insertReportSQL, [
            submitted_by,
            submitted_to,
            subject,
            description
        ]);

        // Same fetch-after-insert approach
        const [report] = await mySql.query(getReportByIdSQL, [result.insertId]);

        return report[0]; // Same return structure
    } catch (error) {
        // Identical error handling
        console.error("Error inserting report:", error);
        throw new Error("Database insertion failed");
    }
};
const getUserReports = async (userId) => {
    try {
        const [reports] = await mySql.query(
            `SELECT 
                r.id,
                r.subject,
                r.status,
                cc.company_name,
                DATE_FORMAT(r.created_at, '%b %d, %Y') AS date
             FROM compliance_reports r
             JOIN client_companies cc ON r.submitted_to = cc.user_id
             WHERE r.submitted_by = ?`,
            [userId]
        );
        return reports;
    } catch (error) {
        console.error("Error fetching reports:", error);
        throw error;
    }
};


// SQL Queries (same style as users)
const insertReportSQL = `
    INSERT INTO compliance_reports 
    (submitted_by, submitted_to, subject, description, created_at) 
    VALUES (?, ?, ?, ?, NOW());
`;

const getReportByIdSQL = `
    SELECT * FROM compliance_reports WHERE id = ?;
`;

module.exports = { 
    postReport,
    getUserReports // Add this export
};
