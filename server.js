const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const userDeleteRoutes = require("./routes/userDelete"); 
const userPost = require("./routes/userPost");
const userUpdate = require("./routes/userUpdate"); 
dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// Mount routes: The endpoint for accessing a user by mobile number will be:
// GET http://localhost:5000/api/user/<mobile_number>
app.use("/api", userRoutes);
app.use("/api", userDeleteRoutes);
app.use("/api", userPost);
app.use("/api", userUpdate);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
