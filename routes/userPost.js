const express = require('express');
const fs = require('fs');

const router = express.Router();
const dataFilePath = "data_transformed.json"; // JSON file to store user data

// Middleware to parse JSON body
router.use(express.json());

// Helper function to read user data from JSON file
const readUserData = () => {
    try {
        const fileData = fs.readFileSync(dataFilePath, "utf-8");
        return JSON.parse(fileData);
    } catch (error) {
        console.error("Error reading data file:", error);
        return [];
    }
};

// Helper function to write user data to JSON file
const writeUserData = (data) => {
    try {
        fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error writing data file:", error);
    }
};

// 📌 POST API: Add new user
router.post('/user', (req, res) => {
    const { name, email, phoneNumber, profilePhoto, referralCode } = req.body;

    // ✅ Validate required fields
    if (!name || !email || !phoneNumber) {
        return res.status(400).json({ message: "Name, email, and phoneNumber are required" });
    }

    // ✅ Read existing users
    const users = readUserData();

    // ✅ Check if phone number already exists
    if (users.some(user => user.phoneNumber === phoneNumber)) {
        return res.status(409).json({ message: "User with this phone number already exists" });
    }

    // ✅ Create new user object
    const newUser = {
        id: users.length + 1,
        name,
        email,
        phoneNumber,
        profilePhoto: profilePhoto || "",
        referralCode: referralCode || "",
        createdAt: new Date().toISOString()
    };

    // ✅ Add user to array and save to file
    users.push(newUser);
    writeUserData(users);

    res.status(201).json({ message: "User added successfully", user: newUser });
});

module.exports = router;
