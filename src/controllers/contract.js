const contractQueries = require('../queries/contract');
const { bucket } = require('../../config/firestore');

const getContractsByUser = async (req, res) => {
  try {
    // Use req.user.id from mock middleware
    const contracts = await contractQueries.getContractsByUser(req.user.id);
    
    res.status(200).json({
      success: true,
      data: contracts
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch contracts"
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
    const success = await contractQueries.signContract(
      req.params.id, 
      req.user.id
    );
    
    if (!success) {
      return res.status(400).json({
        success: false,
        message: "Contract could not be signed (may already be signed or doesn't exist)"
      });
    }

    // Get updated contract
    const updatedContract = await contractQueries.getContractDetails(
      req.params.id, 
      req.user.id
    );
    
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
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
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