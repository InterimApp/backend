const pool = require("../../config/mySql");

const getUserProfile = async (req, res) => {
    try {
        const userId = req.params.id;

        // Fetch current user profile details
        const [userDetails] = await pool.query("SELECT * FROM users WHERE id = ?", [userId]);

        if (userDetails.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(userDetails[0]);
    } catch (error) {
        console.error("Error in getUserProfile:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
const updateUserProfile = async (req, res) => {
    try {
        console.log(req.body); // Log the request body to check if it contains the fields
        const userId = req.params.id;
        const {
            name,
            email,
            phone,
            role,
            firstName,
            lastName,
            age,
            gender,
            location,
            profession,
            skills,
            academic_level, // Add this field
            experience // Add this field
        } = req.body;

        // Validate required fields
        if (!name || !email || !role) {
            return res.status(400).json({ message: "Name, email, and role are required." });
        }

        // Update user details in the database
        const updateQuery = `
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
        await pool.query(updateQuery, [
            name,
            email,
            phone,
            role,
            firstName,
            lastName,
            age,
            gender,
            location,
            profession,
            skills,
            userId
        ]);

        // If the user is an interim collaborator, update additional details
        if (role === "interim_collaborator") {
            const updateCollaboratorQuery = `
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
            await pool.query(updateCollaboratorQuery, [
                age,
                gender,
                location,
                profession,
                academic_level, // Use this field
                experience, // Use this field
                userId
            ]);
        }

        return res.status(200).json({ message: "User profile updated successfully" });
    } catch (error) {
        console.error("Error in updateUserProfile:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
module.exports = { getUserProfile, updateUserProfile };