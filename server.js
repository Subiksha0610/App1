require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

// Import Routes
const userRoutes = require("./routes/userRoutes");
const userDeleteRoutes = require("./routes/userDelete");
const userPost = require("./routes/userPost");
const userUpdate = require("./routes/userUpdate");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// ✅ Connect to MongoDB

mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true // ✅ Keep only this option if needed
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

// ✅ Define User Model (Move to a separate file if needed)
const User = mongoose.model("User", new mongoose.Schema({
    name: String,
    email: String,
    mobile: String
}));

// ✅ JSON File Path
const dataFilePath = path.join(__dirname, "data_transformed.json");

// ✅ Read JSON Data
const readJsonFile = () => {
    if (fs.existsSync(dataFilePath)) {
        const data = fs.readFileSync(dataFilePath);
        return JSON.parse(data);
    }
    return [];
};

// ✅ Write JSON Data
const writeJsonFile = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// ✅ Fetch All Users from JSON
app.get('/api/data', (req, res) => {
    const data = readJsonFile();
    res.json(data);
});

// ✅ Add New Data to JSON
app.post('/api/data', (req, res) => {
    const data = readJsonFile();
    const newData = req.body;
    data.push(newData);
    writeJsonFile(data);
    res.status(201).json({ message: "Data added successfully", data: newData });
});

// ✅ Update Data in JSON
app.put('/api/data/:id', (req, res) => {
    let data = readJsonFile();
    const { id } = req.params;
    const updatedData = req.body;
    data = data.map(item => item.id === id ? { ...item, ...updatedData } : item);
    writeJsonFile(data);
    res.json({ message: "Data updated successfully" });
});

// ✅ Delete Data from JSON
app.delete('/api/data/:id', (req, res) => {
    let data = readJsonFile();
    const { id } = req.params;
    data = data.filter(item => item.id !== id);
    writeJsonFile(data);
    res.json({ message: "Data deleted successfully" });
});

// ✅ Mount Routes
app.use("/api", userRoutes);
app.use("/api", userDeleteRoutes);
app.use("/api", userPost);
app.use("/api", userUpdate);

// ✅ Catch-All Route for Undefined Routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route Not Found' });
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || "https://appnew-8gbv.onrender.com";
app.listen(PORT, () => {
    console.log(`🚀 Server running on ${BASE_URL}`);
});