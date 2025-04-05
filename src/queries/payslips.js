const mySql = require("../../config/mySql");

const getPayslipsByUser = async (userId) => {
  const [payslips] = await mySql.query(
    `SELECT 
      p.id,
      DATE_FORMAT(p.date, '%Y-%m-%d') as date,
      p.payslip_path,
      p.uploaded_at,
      m.work_hours,
      m.overtime_hours,
      jo.salary,
      'Paid' as status
    FROM payslips p
    JOIN interim_collaborators ic ON p.interim_collaborator_id = ic.id
    JOIN missions m ON ic.id = m.interim_collaborator_id
    JOIN job_offers jo ON m.job_offer_id = jo.id
    WHERE ic.user_id = ?
    ORDER BY p.date DESC`,
    [userId]
  );
  return payslips;
};

const getPayslipDetails = async (payslipId) => {
  const [[payslip]] = await mySql.query(
    `SELECT 
      p.id,
      DATE_FORMAT(p.date, '%d %M %Y') as formatted_date,
      p.payslip_path,
      p.uploaded_at,
      CONCAT(u.firstName, ' ', u.lastName) as employee_name,
      cc.company_name as company,
      jo.job_title,
      jo.salary,
      m.work_hours,
      m.overtime_hours,
      'Paid' as status
    FROM payslips p
    JOIN interim_collaborators ic ON p.interim_collaborator_id = ic.id
    JOIN users u ON ic.user_id = u.id
    JOIN missions m ON ic.id = m.interim_collaborator_id
    JOIN job_offers jo ON m.job_offer_id = jo.id
    JOIN client_companies cc ON m.client_company_id = cc.id
    WHERE p.id = ?`,
    [payslipId]
  );
  return payslip;
};

module.exports = {
  getPayslipsByUser,
  getPayslipDetails
};