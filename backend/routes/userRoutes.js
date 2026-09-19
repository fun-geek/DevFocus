const express = require("express");
const router = express.Router();

const db = require("../db");

// CREATE USER
router.post("/", (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({
            success: false,
            message: "Name and email are required"
        });
    }

    const sql = `
        INSERT INTO users (name, email)
        VALUES (?, ?)
    `;

    db.query(sql, [name, email], (err, result) => {

        if (err) {
            console.log(err);

            if (err.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                    success: false,
                    message: "Email already exists"
                });
            }

            return res.status(500).json({
                success: false,
                message: "Failed to create user"
            });
        }

        res.status(201).json({
            success: true,
            message: "User created successfully",
            userId: result.insertId
        });
    });
});


// GET ALL USERS
router.get("/", (req, res) => {

    const sql = "SELECT * FROM users ORDER BY id DESC";

    db.query(sql, (err, results) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch users"
            });
        }

        res.json({
            success: true,
            users: results
        });
    });
});


module.exports = router;