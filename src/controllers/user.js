const { postUser } = require("../queries/user"); // Import function to insert users
const express = require("express");
const router = express.Router();

const postUserHandler = async (req, res) => {
    try {
        // Extract user details from request body
        const { name, email, role, age, gender, location, profession, academic_level, experience } = req.body;

        if (!name || !email || !role) {
            return res.status(400).json({ message: "Name, email, and role are required." });
        }

        // Call the function to insert user into MySQL
        const user = await postUser(name, email, role, age, gender, location, profession, academic_level, experience);

        return res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        console.error("Error in postUserHandler:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

module.exports = { postUserHandler };
