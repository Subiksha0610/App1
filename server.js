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

app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
});

// ✅ Fetch User by Phone Number
app.get('/api/user/:mobile', async (req, res) => {
    try {
        const user = await User.findOne({ mobile: req.params.mobile });
        if (!user) {
            return res.status(404).json({ error: "User Not Found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
});

// ✅ Delete User by Phone Number
app.delete('/api/user/:mobile', async (req, res) => {
    try {
        const user = await User.findOneAndDelete({ mobile: req.params.mobile });
        if (!user) {
            return res.status(404).json({ error: "User Not Found" });
        }
        res.json({ message: "User Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
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