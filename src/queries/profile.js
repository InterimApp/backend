const mySql = require("../../config/mySql");

// Fetch user by ID
const getUserById = async (id) => {
    try {
        const [user] = await mySql.query(getUserByIdSQL, [id]);
        return user[0]; // Return the first user in the array
    } catch (error) {
        console.error("Error fetching user:", error);
        throw new Error("Database query failed");
    }
};

// Update user information
const updateUser = async (id, name, email, role, age, gender, location, profession, academic_level, experience) => {
    try {
        // Update user in the MySQL database
        await mySql.query(updateUserSQL, [name, email, role, id]);

        // If the role is 'interim_collaborator', update additional details
        if (role === "interim_collaborator") {
            await mySql.query(updateInterimCollaboratorSQL, [
                age,
                gender,
                location,
                profession,
                academic_level,
                experience,
                id
            ]);
        }

        // Fetch and return the updated user details
        const [user] = await mySql.query(getUserByIdSQL, [id]);
        return user[0]; // Return the first user in the array
    } catch (error) {
        console.error("Error updating user:", error);
        throw new Error("Database update failed");
    }
};

// SQL Queries
const getUserByIdSQL = `
    SELECT id, name, email, role, created_at FROM users WHERE id = ?;
`;

const updateUserSQL = `
    UPDATE users 
    SET 
        name = ?, 
        email = ?, 
        phone = ?, 
        role = ?, 
        firstName = ?, 
        lastName = ?, 
        age = ?, 
        gender = ?, 
        location = ?, 
        profession = ?, 
        skills = ? 
    WHERE id = ?;
`;

const updateInterimCollaboratorSQL = `
    UPDATE interim_collaborators 
    SET 
        age = ?, 
        gender = ?, 
        location = ?, 
        profession = ?, 
        academic_level = ?, 
        experience_years = ? 
    WHERE user_id = ?;
`;

module.exports = { getUserById, updateUser };