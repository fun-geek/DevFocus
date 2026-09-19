const mysql = require("mysql2");

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "mypassword",
    database: "devfocus",
    connectionLimit: 10
});

pool.getConnection((err, connection) => {
    if (err) {
        console.log("❌ MySQL connection failed");
        console.log(err.message);
        return;
    }

    console.log("✅ MySQL connected successfully");

    connection.release();
});

module.exports = pool;