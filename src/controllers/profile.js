// controllers/profile.js
const pool = require("../../config/mySql");

const getUserProfile = async (req, res) => {
    try {
        const userId = req.params.id;

        // Fetch current user profile details
        const [userDetails] = await pool.query("SELECT * FROM users WHERE id = ?", [userId]);

        if (userDetails.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        // If user is an interim collaborator, fetch additional details
        if (userDetails[0].role === "interim_collaborator") {
            const [collaboratorDetails] = await pool.query(
                "SELECT * FROM interim_collaborators WHERE user_id = ?", 
                [userId]
            );
            
            if (collaboratorDetails.length > 0) {
                return res.status(200).json({
                    ...userDetails[0],
                    ...collaboratorDetails[0]
                });
            }
        }

        return res.status(200).json(userDetails[0]);
    } catch (error) {
        console.error("Error in getUserProfile:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const {
            firstName,
            lastName,
            email,
            age,
            gender,
            location,
            profession,
            skills,
            academic_level,
            experience
        } = req.body;

        // Basic validation
        if (!firstName || !lastName || !email) {
            return res.status(400).json({ message: "First name, last name, and email are required." });
        }

        // Start transaction
        await pool.query("START TRANSACTION");

        try {
            // Update users table
            const updateUserQuery = `
                UPDATE users 
                SET 
                    firstName = ?, 
                    lastName = ?, 
                    email = ?, 
                    age = ?, 
                    gender = ?, 
                    location = ?, 
                    profession = ?, 
                    skills = ?
                WHERE id = ?;
            `;
            
            await pool.query(updateUserQuery, [
                firstName,
                lastName,
                email,
                age,
                gender,
                location,
                profession,
                skills,
                userId
            ]);

            // Check if user is interim collaborator and update additional table
            const [user] = await pool.query("SELECT role FROM users WHERE id = ?", [userId]);
            const role = user[0]?.role;

            if (role === "interim_collaborator") {
                const updateCollaboratorQuery = `
                    INSERT INTO interim_collaborators 
                    (user_id, age, gender, location, profession, academic_level, experience_years) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE
                        age = VALUES(age),
                        gender = VALUES(gender),
                        location = VALUES(location),
                        profession = VALUES(profession),
                        academic_level = VALUES(academic_level),
                        experience_years = VALUES(experience_years);
                `;
                
                await pool.query(updateCollaboratorQuery, [
                    userId,
                    age,
                    gender,
                    location,
                    profession,
                    academic_level,
                    experience
                ]);
            }

            // Commit transaction
            await pool.query("COMMIT");
            
            // Fetch updated profile to return
            const [updatedUser] = await pool.query(`
                SELECT u.*, ic.academic_level, ic.experience_years as experience
                FROM users u
                LEFT JOIN interim_collaborators ic ON u.id = ic.user_id
                WHERE u.id = ?
            `, [userId]);

            return res.status(200).json({
                message: "User profile updated successfully",
                user: updatedUser[0]
            });
            
        } catch (error) {
            // Rollback on error
            await pool.query("ROLLBACK");
            throw error;
        }
    } catch (error) {
        console.error("Error in updateUserProfile:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

module.exports = { getUserProfile, updateUserProfile };