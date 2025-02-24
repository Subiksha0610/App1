const express = require('express');
const fs = require('fs');

const router = express.Router();
const dataFilePath = "data_transformed.json";

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
// For URL: http://localhost:5000/api/user/mobile?phoneNumber=6789005322
router.get('/user/mobile', (req, res) => {
    const phone = req.query.phoneNumber; // Note the capital N
    console.log("Searching for phone:", phone); // Debug log
  
    const users = readUserData();
    console.log("Loaded users:", users); // Debug log
  
    const user = users.find(u => u.phoneNumber == phone);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  });
  module.exports = router;

  