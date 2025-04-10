const mySql = require("../../config/mySql");

const getContractsByUser = async (userId) => {
  try {
    console.log(`Executing contract query for user ${userId}`);
    const [contracts] = await mySql.query(
      `SELECT 
        c.id,
        c.contract_path,
        c.signed,
        c.signature_url,
        DATE_FORMAT(COALESCE(m.start_date, c.start_date), '%Y-%m-%d') as start_date,
        DATE_FORMAT(COALESCE(m.end_date, c.end_date), '%Y-%m-%d') as end_date,
        jo.job_title,
        jo.salary,
        jo.location,
        cc.company_name,
        COALESCE(m.status, 'nonactive') as status,
        CONCAT(u.firstName, ' ', u.lastName) as collaborator_name
      FROM contracts c
      JOIN interim_collaborators ic ON c.interim_collaborator_id = ic.id
      LEFT JOIN missions m ON c.id = m.contract_id
      JOIN job_offers jo ON c.job_offer_id = jo.id
      JOIN client_companies cc ON jo.client_company_id = cc.id
      JOIN users u ON ic.user_id = u.id
      WHERE ic.user_id = ?
      ORDER BY 
        CASE WHEN COALESCE(m.status, 'nonactive') = 'active' THEN 0 ELSE 1 END,
        COALESCE(m.start_date, c.start_date) DESC`,
      [userId]
    );
    
    console.log(`Query returned ${contracts.length} contracts`);
    return contracts;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

const getContractDetails = async (contractId) => {
  const [[contract]] = await mySql.query(
    `SELECT 
      c.*,
      DATE_FORMAT(COALESCE(m.start_date, c.start_date), '%Y-%m-%d') as start_date,
      DATE_FORMAT(COALESCE(m.end_date, c.end_date), '%Y-%m-%d') as end_date,
      jo.job_title,
      jo.salary,
      jo.location,
      jo.duration,
      cc.company_name,
      cc.matricule_fiscale,
      CONCAT(u.firstName, ' ', u.lastName) as collaborator_name
    FROM contracts c
    LEFT JOIN missions m ON c.id = m.contract_id
    JOIN job_offers jo ON c.job_offer_id = jo.id
    JOIN client_companies cc ON jo.client_company_id = cc.id
    JOIN interim_collaborators ic ON c.interim_collaborator_id = ic.id
    JOIN users u ON ic.user_id = u.id
    WHERE c.id = ?`,
    [contractId]
  );
  return contract;
};

const signContract = async (contractId, userId, signatureUrl) => {
  const [result] = await mySql.query(
    `UPDATE contracts 
     SET signed = TRUE, 
         signature_url = ?,
         signed_at = NOW()
     WHERE id = ? AND interim_collaborator_id = ?`,
    [signatureUrl, contractId, userId]
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