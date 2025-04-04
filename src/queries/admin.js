const mySql = require("../../config/mySql");
const db = require("../../config/firestore"); // Correct Firestore import

const getUsers = async (name) => {
    try {
        let query;
        let queryParams = [];  // Default to an empty array

        if (!name) {
            // If no name is provided, fetch all users
            query = `
                SELECT 
                    u.id, 
                    u.name, 
                    u.role, 
                    ic.code_interimaire, 
                    ic.academic_level, 
                    ic.location, 
                    ic.profession, 
                    ic.experience_years, 
                    ic.age, 
                    ic.gender
                FROM interim_db.users u
                JOIN interim_db.interim_collaborators ic ON u.id = ic.user_id
            `;
            const [rows] = await mySql.query(query); // Use destructuring to access only the rows
            return rows; // Return only the rows (data)
        } else {
            // If name is provided, fetch user ID and role based on the name
            const user = await getUserByName(name);
            if (!user) {
                throw new Error("No user found with the provided name.");
            }

            // Depending on the user's role, execute the appropriate query
            if (user.role === 'client_company') {
                const clientCompanyData = await getClientCompanyData(user.id);
                return clientCompanyData; // Return only client company data
            } else if (user.role === 'candidate' || user.role === 'interim_collaborator') {
                const interimCollaboratorData = await getInterimCollaboratorData(user.id);
                return interimCollaboratorData; // Return only interim collaborator data
            } else {
                throw new Error("Unsupported role.");
            }
        }
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};


// Helper function to fetch user ID and role by name
const getUserByName = async (name) => {
    const query = `
        SELECT id, role 
        FROM interim_db.users 
        WHERE name LIKE ?
    `;
    const [result] = await mySql.query(query, [`%${name}%`]);
    return result[0]; // Assuming there is only one matching user, or you can handle multiple results as needed
};

// Helper function to fetch data for client companies
const getClientCompanyData = async (userId) => {
    const query = `
        SELECT 
            u.id, 
            cc.company_name, 
            cc.matricule_fiscale, 
            cc.industry
        FROM interim_db.users u
        JOIN interim_db.client_companies cc ON u.id = cc.user_id
        WHERE cc.user_id = ?
    `;
    const [clientCompanyData] = await mySql.query(query, [userId]);
    return clientCompanyData; // Only return the actual data
};


// Helper function to fetch data for interim collaborators
const getInterimCollaboratorData = async (userId) => {
    const query = `
        SELECT 
            u.id, 
            u.name, 
            u.role, 
            ic.code_interimaire, 
            ic.academic_level, 
            ic.location, 
            ic.profession, 
            ic.experience_years, 
            ic.age, 
            ic.gender
        FROM interim_db.users u
        JOIN interim_db.interim_collaborators ic ON u.id = ic.user_id
        WHERE u.id = ?
    `;
    const [interimCollaboratorData] = await mySql.query(query, [userId]);
    return interimCollaboratorData; // Only return the actual data
};



const deleteUser = async (name) => {
    try {
        // First, check if the user exists by name
        const checkUserQuery = `SELECT id FROM users WHERE name = ?`;
        const [userResult] = await mySql.query(checkUserQuery, [name]);

        if (userResult.length === 0) {
            throw new Error('User not found'); // Throw an error if the user doesn't exist
        }

        // Get the user's ID
        const userId = userResult[0].id;
        console.log("User ID found:", userId);

        // Delete related records first (from client_companies and interim_collaborators)
        console.log("Deleting related records from client_companies for user_id:", userId);
        await mySql.query(`DELETE FROM client_companies WHERE user_id = ?`, [userId]);
        
        console.log("Deleting related records from interim_collaborators for user_id:", userId);
        await mySql.query(`DELETE FROM interim_collaborators WHERE user_id = ?`, [userId]);

        // Finally, delete the user from the users table
        const deleteQuery = `DELETE FROM users WHERE name = ?`;
        const [deleteResult] = await mySql.query(deleteQuery, [name]);

        return deleteResult;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error; // Rethrow the error to be handled by the caller
    }
};


// dashboard admin

const getDashboardData = async () => {
    try {
        // First, get the total interim collaborators and client companies
        const [result1] = await mySql.query(getDashboardDataQuery);

        // Then, get the total number of active missions
        const [result2] = await mySql.query(getTotalActiveMissionsQuery);

        return {
            total_interim_collaborators: result1[0].total_interim_collaborators,
            total_client_companies: result1[0].total_client_companies,
            total_active_missions: result2[0].total_active_missions
        };
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        throw error;
    }
};


// In your queries file (e.g., queries/admin.js)
const getRecruitmentRequests = async () => {
    const query = `
       SELECT 
    rr.id,
    cc.company_name,
    rr.job_title,
    rr.job_description,
    rr.required_experience,
    rr.status,
    rr.created_at,
    rr.location,
    rr.salary,
    rr.duration
FROM 
    interim_db.recruitment_requests rr
JOIN 
    interim_db.client_companies cc ON rr.client_company_id = cc.id;

    `;

    try {
        // Use your connection pool or promise-based connection
        const [rows] = await mySql.query(query); // Assuming `connection` is a MySQL pool or connection
        return rows;
    } catch (error) {
        console.error("Error in getRecruitmentRequests:", error);
        throw new Error("Error retrieving recruitment requests from the database");
    }
};


const deleteRecruitmentRequest = async (id) => {
    const query = `
        DELETE FROM interim_db.recruitment_requests
        WHERE id = ?
    `;
    
    const [result] = await mySql.query(query, [id]);
    return result;
};

const updateRecruitmentRequestStatus = async (id) => {
    const query = `
        UPDATE interim_db.recruitment_requests
        SET status = 'Accepted'
        WHERE id = ? AND status = 'Pending'
    `;
    
    const [result] = await mySql.query(query, [id]);
    return result;
};

const insertJobOffer = async (id) => {
    const query = `
        INSERT INTO interim_db.job_offers (client_company_id, posted_by_admin, request_id, location, required_experience, salary, duration, created_at, job)
        SELECT 
            rr.client_company_id, 
            1 AS posted_by_admin, -- Admin ID is hardcoded as 1
            rr.id, 
            rr.location,         -- Using location from recruitment_requests
            rr.required_experience, 
            rr.salary,           -- Using salary from recruitment_requests
            rr.duration,         -- Using duration from recruitment_requests
            NOW() AS created_at, -- Current timestamp
            rr.job_title AS job
        FROM interim_db.recruitment_requests rr
        WHERE rr.id = ?
    `;
    
    await mySql.query(query, [id]);
};


const fetchJobOffersAndApplicants = async () => {
    
    try {
        const [results] = await mySql.query(jobOffersAndApplicantsQuery);
        return results;
    } catch (error) {
        throw error;
    }
};



const updateApplicantStatus = async (status, collaborator_id) => {
    const query = `
        UPDATE interim_db.job_applications 
        SET status = ? 
        WHERE interim_collaborator_id = ?;
    `;

    const [result] = await mySql.query(query, [status, collaborator_id]);
    return result;
};



const getAcceptedContracts = async () => {
    try {
        // Execute SQL Query
        const [users] = await mySql.query(getAcceptedApplicationsQuery);

        // Fetch contracts from Firestore
        const contractPromises = users.map(async (user) => {
            const contractsRef = db.collection("contracts");
            const snapshot = await contractsRef
                .where("client_company_id", "==", user.client_company_id)
                .where("interim_collaborator_id", "==", user.interim_collaborator_id)
                .get();

            let contractData = {
                contract_url: null,
                signed: null,
                uploaded_at: null,
            };

            snapshot.forEach((doc) => {
                const data = doc.data();
                contractData = {
                    contract_url: data.contract_url,
                    signed: data.signed,
                    uploaded_at: data.uploaded_at.toDate().toISOString(),
                };
            });

            return {
                interim_collaborator_name: user.interim_collaborator_name,
                company_name: user.company_name,
                signed: contractData.signed,
                contract_url: contractData.contract_url,
                uploaded_at: contractData.uploaded_at,
            };
        });

        return await Promise.all(contractPromises);
    } catch (error) {
        console.error("Error fetching contracts:", error);
        throw new Error("Failed to fetch contracts");
    }
};




// Query to get total interim collaborators and total client companies
const getDashboardDataQuery = `
    SELECT
        SUM(CASE WHEN u.role = 'Interim Collaborator' THEN 1 ELSE 0 END) AS total_interim_collaborators,
        SUM(CASE WHEN u.role = 'Client Company' THEN 1 ELSE 0 END) AS total_client_companies
    FROM
        interim_db.users u
    WHERE
        u.role IN ('Interim Collaborator', 'Client Company')
`;

// Query to get total active missions
const getTotalActiveMissionsQuery = `
    SELECT 
        COUNT(*) AS total_active_missions
    FROM 
        interim_db.missions m
    WHERE 
        m.status = 'Active'
`;

const jobOffersAndApplicantsQuery = `
  SELECT 
            jo.id AS job_offer_id,
            jo.job AS job_title,
            cc.company_name,
            u.name AS name,
            jo.created_at AS job_created_at,
            ic.id AS applicant_id,
            ic.cv_path,
            ic.academic_level,
            ic.profession,
            ic.experience_years,
            ic.age
        FROM 
            interim_db.job_offers jo
        JOIN 
            interim_db.client_companies cc ON jo.client_company_id = cc.id
        JOIN 
            interim_db.users u ON cc.user_id = u.id
        LEFT JOIN 
            interim_db.job_applications ja ON jo.id = ja.job_offer_id
        LEFT JOIN 
            interim_db.interim_collaborators ic ON ja.interim_collaborator_id = ic.id
        ORDER BY 
            jo.id, ja.applied_at;
`;

const getAcceptedApplicationsQuery = `
    SELECT 
        ic.id AS interim_collaborator_id,
        u.name AS interim_collaborator_name,
        cc.company_name,
        cc.id AS client_company_id
    FROM job_applications ja
    JOIN interim_collaborators ic ON ja.interim_collaborator_id = ic.id
    JOIN users u ON ic.user_id = u.id
    JOIN job_offers jo ON ja.job_offer_id = jo.id
    JOIN client_companies cc ON jo.client_company_id = cc.id
    WHERE ja.status = 'accepted';
`;



module.exports = { getUsers,deleteUser,getDashboardData, getRecruitmentRequests,
     deleteRecruitmentRequest,updateRecruitmentRequestStatus, insertJobOffer,fetchJobOffersAndApplicants,
     updateApplicantStatus,getAcceptedContracts};
