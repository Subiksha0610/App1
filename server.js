require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
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