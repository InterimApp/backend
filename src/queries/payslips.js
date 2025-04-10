const mySql = require("../../config/mySql");

const getPayslipsByUser = async (userId) => {
  const [payslips] = await mySql.query(
    `SELECT 
      p.id,
      DATE_FORMAT(p.date, '%Y-%m-%d') as date,
      p.payslip_path as fileUrl,
      'Paid' as status
    FROM payslips p
    JOIN interim_collaborators ic ON p.interim_collaborator_id = ic.id
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
      DATE_FORMAT(p.date, '%Y-%m-%d') as date,
      p.payslip_path as fileUrl,
      'Paid' as status
    FROM payslips p
    WHERE p.id = ?`,
    [payslipId]
  );
  return payslip;
};

module.exports = {
  getPayslipsByUser,
  getPayslipDetails
};