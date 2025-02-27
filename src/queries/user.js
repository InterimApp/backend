const mySql = require("../../config/mySql");
const db = require("../../config/firestore"); // Import Firestore instance




const postUser = async (name, email, role, age, gender, location, profession, academic_level, experience) => {
    try {
        // Insert user into MySQL database
        const [userResult] = await mySql.query(insertUserSQL, [name, email, role]);

        // Get the inserted user ID
        const userId = userResult.insertId;

        // If the role is 'interim_collaborator', insert additional details
        if (role === "interim_collaborator") {
            await mySql.query(insertInterimCollaboratorSQL, [
                userId,
                age,
                gender,
                location,
                profession,
                academic_level,
                experience
            ]);
        }

        // Fetch and return the inserted user details
        const [user] = await mySql.query(getUserByIdSQL, [userId]);

        return user[0]; 
    } catch (error) {
        console.error("Error inserting user:", error);
        throw new Error("Database insertion failed");
    }
};

// SQL Queries
const insertUserSQL = `
    INSERT INTO users (name, email, role, created_at) 
    VALUES (?, ?, ?, NOW());
`;

const insertInterimCollaboratorSQL = `
    INSERT INTO interim_collaborators 
    (user_id, code_interimaire, age, gender, location, profession, academic_level, experience_years) 
    VALUES (?, 0, ?, ?, ?, ?, ?, ?);
`;

const getUserByIdSQL = `
    SELECT id, name, email, role, created_at FROM users WHERE id = ?;
`;

module.exports = { postUser };
