const express = require("express");
const cors = require("cors");

const db = require("./db");

const userRoutes = require("./routes/userRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const interruptionRoutes = require("./routes/interruptionRoutes");

const app = express();


// MIDDLEWARE
app.use(cors());
app.use(express.json());


// ROUTES
app.use("/api/users", userRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/interruptions", interruptionRoutes);


// HOME
app.get("/", (req, res) => {
    res.send("DevFocus Backend is Running 🚀");
});


// TEST DATABASE
app.get("/api/test-db", (req, res) => {

    db.query("SELECT 1 AS result", (err, results) => {

        if (err) {
            return res.status(500).json({
                success: false,
                error: err.message
            });
        }

        res.json({
            success: true,
            message: "Database connected successfully",
            data: results
        });
    });

});


// START SERVER
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});