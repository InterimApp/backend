const contractQueries = require('../queries/contract');
const { bucket } = require('../../config/firebase');

const getContractsByUser = async (req, res) => {
  try {
    const userId = req.query.userId || 1; // Temporary default
    
    // Add debug logging
    console.log(`Fetching contracts for user ${userId}`);
    const contracts = await contractQueries.getContractsByUser(userId);
    console.log(`Found ${contracts.length} contracts`);
    
    if (contracts.length === 0) {
      console.warn('No contracts found for user', userId);
    }

    res.status(200).json({
      success: true,
      data: contracts
    });
  } catch (error) {
    console.error("Contract fetch error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch contracts"
    });
  }
};

const getContractDetails = async (req, res) => {
  try {
    const contract = await contractQueries.getContractDetails(req.params.id);
    
    if (!contract) {
      return res.status(404).json({
        success: false,
        message: "Contract not found"
      });
    }

    res.status(200).json({
      success: true,
      data: contract
    });
  } catch (error) {
    console.error("Error in getContractDetails:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch contract details",
      error: error.message
    });
  }
};

const signContract = async (req, res) => {
  try {
    const { signatureUrl } = req.body;
    const userId = req.query.userId || 1; // Default to user 1 for testing
    
    if (!signatureUrl) {
      return res.status(400).json({
        success: false,
        message: "Signature URL is required"
      });
    }

    const success = await contractQueries.signContract(
      req.params.id, 
      userId,
      signatureUrl
    );
    
    if (!success) {
      return res.status(400).json({
        success: false,
        message: "Contract could not be signed"
      });
    }

    const updatedContract = await contractQueries.getContractDetails(req.params.id);
    
    res.status(200).json({
      success: true,
      message: "Contract signed successfully",
      data: updatedContract
    });
    
  } catch (error) {
    console.error("Error signing contract:", error);
    res.status(500).json({
      success: false,
      message: "Failed to sign contract",
      error: error.message
    });
  }
};

const downloadContract = async (req, res) => {
  try {
    const contractPath = await contractQueries.getContractDownloadPath(req.params.id);
    
    if (!contractPath) {
      return res.status(404).json({
        success: false,
        message: "Contract file not found"
      });
    }

    const file = bucket.file(contractPath);
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 15 * 60 * 1000 // 15 minutes
    });

    res.status(200).json({
      success: true,
      data: { downloadUrl: url }
    });
  } catch (error) {
    console.error("Error in downloadContract:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate download URL",
      error: error.message
    });
  }
};

module.exports = {
  getContractsByUser,
  getContractDetails,
  signContract,
  downloadContract
};