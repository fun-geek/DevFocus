const express = require("express");
const router = express.Router();

const db = require("../db");


// LOG INTERRUPTION
router.post("/", (req, res) => {

    const { session_id, reason } = req.body;

    if (!session_id || !reason) {
        return res.status(400).json({
            success: false,
            message: "session_id and reason are required"
        });
    }

    const sql = `
        INSERT INTO interruptions
        (session_id, reason)
        VALUES (?, ?)
    `;

    db.query(sql, [session_id, reason], (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Failed to log interruption"
            });
        }

        res.status(201).json({
            success: true,
            message: "Interruption logged",
            interruptionId: result.insertId
        });
    });
});


// GET INTERRUPTIONS FOR A SESSION
router.get("/session/:sessionId", (req, res) => {

    const sessionId = req.params.sessionId;

    const sql = `
        SELECT *
        FROM interruptions
        WHERE session_id = ?
        ORDER BY interrupted_at DESC
    `;

    db.query(sql, [sessionId], (err, results) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch interruptions"
            });
        }

        res.json({
            success: true,
            interruptions: results
        });
    });
});


// GET MOST COMMON DISTRACTIONS
router.get("/analytics/reasons", (req, res) => {

    const sql = `
        SELECT
            reason,
            COUNT(*) AS total_interruptions
        FROM interruptions
        GROUP BY reason
        ORDER BY total_interruptions DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch analytics"
            });
        }

        res.json({
            success: true,
            data: results
        });
    });
});


module.exports = router;