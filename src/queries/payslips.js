const mySql = require("../../config/mySql");
const getPayslipsByUser = async (userId) => {
    const [payslips] = await mySql.query(
        `SELECT 
            p.id,
            p.date,
            p.payslip_path,
            p.uploaded_at,
            cc.company_name,
            m.end_date AS contract_end_date,
            jo.job_title,
            jo.salary,
            m.work_hours,
            m.overtime_hours
         FROM payslips p
         JOIN interim_collaborators ic ON p.interim_collaborator_id = ic.id
         JOIN users u ON ic.user_id = u.id
         LEFT JOIN missions m ON ic.id = m.interim_collaborator_id
         LEFT JOIN job_offers jo ON m.job_offer_id = jo.id
         LEFT JOIN client_companies cc ON m.client_company_id = cc.id
         WHERE u.id = ?
         ORDER BY p.date DESC`,
        [userId]
    );
    
    return payslips.map(p => ({
        ...p,
        date: new Date(p.date).toISOString().split('T')[0], // Format date
        status: "Payé" // Default status for frontend
    }));
};
const getPayslipDetails = async (payslipId) => {
    try {
        const [[payslip]] = await mySql.query(
            `SELECT 
                p.*,
                CONCAT(u.firstName, ' ', u.lastName) AS employee_name,
                IFNULL(cc.company_name, 'Unknown Company') AS company_name,
                IFNULL(jo.job_title, 'N/A') AS job_title,
                IFNULL(jo.salary, 0) AS salary,
                IFNULL(m.work_hours, 0) AS work_hours,
                IFNULL(m.overtime_hours, 0) AS overtime_hours
             FROM payslips p
             JOIN interim_collaborators ic ON p.interim_collaborator_id = ic.id
             JOIN users u ON ic.user_id = u.id
             LEFT JOIN missions m ON ic.id = m.interim_collaborator_id
             LEFT JOIN job_offers jo ON m.job_offer_id = jo.id
             LEFT JOIN client_companies cc ON m.client_company_id = cc.id
             WHERE p.id = ?`,
            [payslipId]
        );
        return payslip;
    } catch (error) {
        console.error("Error in getPayslipDetails:", error);
        throw error;
    }
};
module.exports = {
    getPayslipsByUser,
    getPayslipDetails
};