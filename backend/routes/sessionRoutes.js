const express = require("express");
const router = express.Router();

const db = require("../db");


// START SESSION
router.post("/start", (req, res) => {

    const { user_id } = req.body;

    if (!user_id) {
        return res.status(400).json({
            success: false,
            message: "user_id is required"
        });
    }

    const sql = `
        INSERT INTO sessions
        (user_id, start_time, status)
        VALUES (?, NOW(), 'active')
    `;

    db.query(sql, [user_id], (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Failed to start session"
            });
        }

        res.status(201).json({
            success: true,
            message: "Focus session started",
            sessionId: result.insertId
        });
    });
});


// END SESSION
router.put("/:id/end", (req, res) => {

    const sessionId = req.params.id;

    const sql = `
        UPDATE sessions
        SET
            end_time = NOW(),
            duration_seconds = TIMESTAMPDIFF(
                SECOND,
                start_time,
                NOW()
            ),
            status = 'completed'
        WHERE id = ?
        AND status = 'active'
    `;

    db.query(sql, [sessionId], (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Failed to end session"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Active session not found"
            });
        }

        res.json({
            success: true,
            message: "Focus session completed"
        });
    });
});


// GET USER'S SESSIONS
router.get("/user/:userId", (req, res) => {

    const userId = req.params.userId;

    const sql = `
        SELECT *
        FROM sessions
        WHERE user_id = ?
        ORDER BY start_time DESC
    `;

    db.query(sql, [userId], (err, results) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch sessions"
            });
        }

        res.json({
            success: true,
            sessions: results
        });
    });
});


module.exports = router;