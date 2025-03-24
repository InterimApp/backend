const pool = require("../../config/mySql");

// Fetch active contracts (where the current date is between start_date and end_date)
const getActiveContracts = async (req, res) => {
  try {
    const [contracts] = await pool.query(`
      SELECT 
        c.id, 
        c.job_offer_id, 
        c.interim_collaborator_id, 
        c.contract_path, 
        c.signed, 
        c.start_date,
        c.end_date,
        j.location AS job_location,
        j.salary AS job_salary,
        j.duration AS job_duration,
        u.firstName AS collaborator_firstName,
        u.lastName AS collaborator_lastName,
        u.email AS collaborator_email
      FROM contracts c
      JOIN job_offers j ON c.job_offer_id = j.id
      JOIN users u ON c.interim_collaborator_id = u.id
      WHERE CURDATE() BETWEEN c.start_date AND c.end_date
    `);
    return res.status(200).json(contracts);
  } catch (error) {
    console.error("Error in getActiveContracts:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Fetch contract history (where the current date is after the end_date)
const getContractHistory = async (req, res) => {
  try {
    const [contracts] = await pool.query(`
      SELECT 
        c.id, 
        c.job_offer_id, 
        c.interim_collaborator_id, 
        c.contract_path, 
        c.signed, 
        c.start_date,
        c.end_date,
        j.location AS job_location,
        j.salary AS job_salary,
        j.duration AS job_duration,
        u.firstName AS collaborator_firstName,
        u.lastName AS collaborator_lastName,
        u.email AS collaborator_email
      FROM contracts c
      JOIN job_offers j ON c.job_offer_id = j.id
      JOIN users u ON c.interim_collaborator_id = u.id
      WHERE CURDATE() > c.end_date
    `);
    return res.status(200).json(contracts);
  } catch (error) {
    console.error("Error in getContractHistory:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Fetch contract details by ID
const getContractDetails = async (req, res) => {
  try {
    const contractId = req.params.id;
    const [contract] = await pool.query(`
      SELECT 
        c.id, 
        c.job_offer_id, 
        c.interim_collaborator_id, 
        c.contract_path, 
        c.signed, 
        c.start_date,
        c.end_date,
        j.location AS job_location,
        j.salary AS job_salary,
        j.duration AS job_duration,
        u.firstName AS collaborator_firstName,
        u.lastName AS collaborator_lastName,
        u.email AS collaborator_email
      FROM contracts c
      JOIN job_offers j ON c.job_offer_id = j.id
      JOIN users u ON c.interim_collaborator_id = u.id
      WHERE c.id = ?
    `, [contractId]);

    if (contract.length === 0) {
      return res.status(404).json({ message: "Contract not found" });
    }

    return res.status(200).json(contract[0]);
  } catch (error) {
    console.error("Error in getContractDetails:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Sign a contract
const signContract = async (req, res) => {
  try {
    const contractId = req.params.id;

    // Update the contract status to signed
    await pool.query("UPDATE contracts SET signed = TRUE WHERE id = ?", [contractId]);

    return res.status(200).json({ message: "Contract signed successfully" });
  } catch (error) {
    console.error("Error in signContract:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Download contract file
const downloadContract = async (req, res) => {
  try {
    const contractId = req.params.id;
    const [contract] = await pool.query("SELECT contract_path FROM contracts WHERE id = ?", [contractId]);

    if (contract.length === 0 || !contract[0].contract_path) {
      return res.status(404).json({ message: "Contract file not found" });
    }

    const filePath = contract[0].contract_path;
    res.download(filePath); // Serve the file for download
  } catch (error) {
    console.error("Error in downloadContract:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = {
  getActiveContracts,
  getContractHistory,
  getContractDetails,
  signContract,
  downloadContract,
};