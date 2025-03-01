const express = require("express");
const fs = require("fs");

const router = express.Router();
const dataFilePath = "data_transformed.json";

// Helper function to read user data
const readUserData = () => {
  try {
    const fileData = fs.readFileSync(dataFilePath, "utf-8");
    return JSON.parse(fileData);
  } catch (error) {
    console.error("Error reading data file:", error);
    return [];
  }
};

// Helper function to write user data
const writeUserData = (data) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing to data file:", error);
  }
};

// DELETE user by phone number
router.delete("/user/mobile", (req, res) => {
  const phone = req.query.phoneNumber;
  console.log("Deleting user with phone:", phone);

  let users = readUserData();
  const initialLength = users.length;

  users = users.filter((user) => user.phoneNumber !== phone);

  if (users.length === initialLength) {
    return res.status(404).json({ message: "User not found" });
  }

  writeUserData(users);
  res.json({ message: "User deleted successfully" });
});

module.exports = router;
