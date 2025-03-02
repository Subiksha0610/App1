
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Import Routes
const userRoutes = require("./routes/userRoutes");
const userDeleteRoutes = require("./routes/userDelete");
const userPost = require("./routes/userPost");
const userUpdate = require("./routes/userUpdate");
const connectDB = require("./config/configdb");
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
connectDB();

// ✅ Mount Routes
app.use("/api", userRoutes);
app.use("/api", userDeleteRoutes);
app.use("/api", userPost);
app.use("/api", userUpdate);

// ✅ Catch-All Route for Undefined Routes
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error" });
});


// ✅ Start Server
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || "https://appnew-8gbv.onrender.com";
app.listen(PORT, () => {
    console.log(`🚀 Server running on ${BASE_URL}`);
});