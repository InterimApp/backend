const mySql = require("../../config/mySql");

const getContractsByUser = async (userId) => {
  const [contracts] = await mySql.query(
    `SELECT 
      c.id,
      c.contract_path,
      c.signed,
      DATE_FORMAT(
        COALESCE(m.start_date, c.start_date), 
        '%Y-%m-%d'
      ) as start_date,
      DATE_FORMAT(
        COALESCE(m.end_date, c.end_date), 
        '%Y-%m-%d'
      ) as end_date,
      jo.job_title,
      jo.salary,
      jo.location,
      cc.company_name,
      CASE 
        WHEN c.signed = FALSE AND CURDATE() < COALESCE(m.start_date, c.start_date) THEN 'pending'
        WHEN c.signed = TRUE AND CURDATE() BETWEEN COALESCE(m.start_date, c.start_date) AND COALESCE(m.end_date, c.end_date) THEN 'active'
        WHEN CURDATE() > COALESCE(m.end_date, c.end_date) THEN 'expired'
        ELSE 'inactive'
      END as status
    FROM contracts c
    JOIN missions m ON c.id = m.contract_id
    JOIN job_offers jo ON c.job_offer_id = jo.id
    JOIN client_companies cc ON jo.client_company_id = cc.id
    JOIN interim_collaborators ic ON c.interim_collaborator_id = ic.id
    WHERE ic.user_id = ?
    ORDER BY COALESCE(m.start_date, c.start_date) DESC`,
    [userId]
  );
  return contracts;
};

const getContractDetails = async (contractId) => {
  const [[contract]] = await mySql.query(
    `SELECT 
      c.*,
      COALESCE(m.start_date, c.start_date) as start_date,
      COALESCE(m.end_date, c.end_date) as end_date,
      jo.job_title,
      jo.salary,
      jo.location,
      jo.duration,
      cc.company_name,
      cc.matricule_fiscale,
      CONCAT(u.firstName, ' ', u.lastName) as collaborator_name
    FROM contracts c
    JOIN missions m ON c.id = m.contract_id
    JOIN job_offers jo ON c.job_offer_id = jo.id
    JOIN client_companies cc ON jo.client_company_id = cc.id
    JOIN interim_collaborators ic ON c.interim_collaborator_id = ic.id
    JOIN users u ON ic.user_id = u.id
    WHERE c.id = ?`,
    [contractId]
  );
  return contract;
};

const signContract = async (contractId, userId) => {
    const [result] = await mySql.query(
      `UPDATE contracts 
       SET signed = TRUE 
       WHERE id = ? AND interim_collaborator_id = ?`,
      [contractId, userId]
    );
    return result.affectedRows > 0;
  };

const getContractDownloadPath = async (contractId) => {
  const [[contract]] = await mySql.query(
    `SELECT contract_path 
     FROM contracts 
     WHERE id = ?`,
    [contractId]
  );
  return contract?.contract_path;
};

module.exports = {
  getContractsByUser,
  getContractDetails,
  signContract,
  getContractDownloadPath
};