const mySql = require("../../config/mySql");
const db = require("../../config/firestore"); // Correct Firestore import
const { v4: uuidv4 } = require('uuid');  // Import the uuid package

const postUser = async (firestoreUserId, name, email, role, age, gender, location, profession, academic_level, experience) => {
    try {
        console.log("[DEBUG] - Starting postUser function");

        // Insert user into MySQL database user table
        const [userResult] = await mySql.query(insertUserSQL, [name, email, role]);
        console.log("\n[DEBUG] - User Insert Result:", userResult);

        if (!userResult.insertId) {
            throw new Error("User insert failed, no ID returned.");
        }

        const userId = userResult.insertId;
        console.log("\n[DEBUG] - Inserted User ID:", userId);

        // Generate a unique code_interimaire
        const codeInterimaire = uuidv4();
        console.log("[DEBUG] - Generated code_interimaire:", codeInterimaire);

        // Insert into interim_collaborators table
        const [interimResult] = await mySql.query(insertInterimCollaboratorSQL, [
            userId,           // user_id
            codeInterimaire,   // unique code_interimaire
            academic_level,   // academic_level
            location,         // location
            gender,           // gender
            profession,       // profession
            experience,       // experience_years
            age               // age (integer)
        ]);

        console.log("\n[DEBUG] - Interim Collaborator Insert Result:", interimResult);

        if (!interimResult.affectedRows) {
            throw new Error("Interim collaborator insert failed, no rows affected.");
        }

        // Store ONLY code_interimaire in Firestore under the correct user document
        console.log("[DEBUG] - Storing code_interimaire in Firestore");

        if (!firestoreUserId) {
            throw new Error("Firestore user document ID is missing.");
        }

        await db.collection('users').doc(firestoreUserId).set({
            code_interimaire: codeInterimaire
        }, { merge: true });

        console.log("\n[DEBUG] - Successfully added code_interimaire to Firestore for user:", firestoreUserId);

    } catch (error) {
        console.error("\n[ERROR] - Exception in postUser():", error.message);
        console.error("Stack Trace:", error.stack);

        if (error.sql) {
            console.error("Failed SQL Query:", error.sql);
        }

        throw new Error("Database insertion failed");
    }
};

// Function to fetch job offers based on role & location
const getJobOffers = async (role, location) => {
    try {
        let query;
        let values = [];

        if (role && location) {
            query = getFilteredJobOffersSQL;
            values = [location, role]; // Use wildcards for LIKE queries
        } else {
            query = getAllJobOffersSQL; // Fetch all jobs if no filters are provided
        }

        const [jobOffers] = await mySql.query(query, values);
        return jobOffers;
    } catch (error) {
        console.error("Error fetching job offers:", error);
        throw error;
    }
};


// SQL Queries
const insertUserSQL = `
    INSERT INTO users (name, email, role, created_at) 
    VALUES (?, ?, ?, NOW());
`;

const insertInterimCollaboratorSQL = `
    INSERT INTO interim_collaborators 
    (user_id, code_interimaire, academic_level, location, gender, profession, experience_years, age) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?);
`;

const getAllJobOffersSQL = `
  SELECT jo.location, jo.required_experience, jo.salary, jo.duration, jo.job, cc.company_name 
  FROM interim_db.job_offers jo
  JOIN interim_db.client_companies cc ON jo.client_company_id = cc.id;
`;

const getFilteredJobOffersSQL = `
  SELECT jo.location, jo.required_experience, jo.salary, jo.duration, jo.job, cc.company_name 
  FROM interim_db.job_offers jo
  JOIN interim_db.client_companies cc ON jo.client_company_id = cc.id
  WHERE jo.location LIKE ? AND jo.job LIKE ?;
`;
module.exports = { postUser,getJobOffers};
