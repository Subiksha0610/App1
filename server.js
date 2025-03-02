require("dotenv").config();
const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const userDeleteRoutes = require("./routes/userDelete");
const userPost = require("./routes/userPost");
const userUpdate = require("./routes/userUpdate");

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// ✅ Mount routes
app.use("/api", userRoutes);
app.use("/api", userDeleteRoutes);
app.use("/api", userPost);
app.use("/api", userUpdate);

// ✅ Sample API Route
app.get("/api/users", (req, res) => {
    res.json({ message: "Users API is working!", base_url: BASE_URL });
});

// ✅ Catch-All Route for Undefined Routes
app.use((req, res) => {
    res.status(404).json({ error: "Route Not Found" });
});

// ✅ Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running at ${BASE_URL}`);
});
