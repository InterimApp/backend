const { postUser } = require("../queries/user"); // Import function to insert users
const { getJobOffers } = require("../queries/user"); // Import function to insert users

const postUserHandler = async (req, res) => {
    try {
        // Extract user details from request body
        const {firestoreUserId, name, email, role, age, gender, location, profession, academic_level, experience } = req.body;

        if (!name || !email || !role) {
            return res.status(400).json({ message: "Name, email, and role are required." });
        }

        // Call the function to insert user into MySQL
        const user = await postUser(firestoreUserId,name, email, role, age, gender, location, profession, academic_level, experience);

        return res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        console.error("Error in postUserHandler:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


const getJobOffersByRoleLocation = async (req, res) => {
    try {
        // Extract fetching keys from query parameters
        const { role, location } = req.query;

       // if (!role && !location) {
         //   return res.status(400).json({ message: "Either 'role' or 'location' must be provided" });
        //}

        // Call the function to get the job offers from DB
        const jobOffers = await getJobOffers(role, location);

        if (!jobOffers || jobOffers.length === 0) {
            return res.status(404).json({ message: "No job offers found matching the criteria" });
        }

        // Return the job offers with a success message
        return res.status(200).json({
            message: "Job offers fetched successfully",
            jobOffers
        });
    } catch (error) {
        console.error("Error in getJobOffersByRoleLocation:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


module.exports = { postUserHandler, getJobOffersByRoleLocation};


