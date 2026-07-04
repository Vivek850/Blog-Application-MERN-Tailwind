const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connectToMongoDB } = require("./connection");
const bcrypt = require("bcrypt");



// Routes
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection
connectToMongoDB("mongodb://127.0.0.1:27017/blogApp");

// Middleware
app.use(cors({
    origin: "http://localhost:5173", // React app URL
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);   // Signup/Login
app.use("/api", postRoutes);        // Posts CRUD

// Default route
app.get("/", (req, res) => {
  res.send("Blog App Backend is running...");
});

// Server start
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
