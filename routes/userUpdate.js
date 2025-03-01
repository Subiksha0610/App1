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

// 📌 PUT API: Update user by phone number
router.put('/user', (req, res) => {
    const { phoneNumber, name, email, profilePhoto, referralCode } = req.body;

    // ✅ Validate required fields
    if (!phoneNumber) {
        return res.status(400).json({ message: "Phone number is required for updating user data" });
    }

    // ✅ Read existing users
    const users = readUserData();

    // ✅ Find user index
    const userIndex = users.findIndex(user => user.phoneNumber === phoneNumber);
    if (userIndex === -1) {
        return res.status(404).json({ message: "User not found" });
    }

    // ✅ Update user data
    if (name) users[userIndex].name = name;
    if (email) users[userIndex].email = email;
    if (profilePhoto) users[userIndex].profilePhoto = profilePhoto;
    if (referralCode) users[userIndex].referralCode = referralCode;
    users[userIndex].updatedAt = new Date().toISOString(); // Track update time

    // ✅ Save updated data to file
    writeUserData(users);

    res.status(200).json({ message: "User updated successfully", user: users[userIndex] });
});

module.exports = router;
