const express = require("express");
const app = express();

require("dotenv").config();

// Import MySQL connection
const db = require("./config/db");
const bookRoutes = require("./routes/bookRoutes");

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/books", bookRoutes);

// Serve frontend files
app.use(express.static("public"));

// Test API
app.get("/api/test", (req, res) => {
    res.json({
        message: "Library Management System Backend is Working!"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});