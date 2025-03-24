const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || "localhost",
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PSSWD || "azerty123",
    database: process.env.MYSQL_DB || "interim_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log("✅ MySQL connection established");
        connection.release();
    } catch (error) {
        console.error("❌ MySQL connection failed:", error.message);
        process.exit(1);
    }
})();

module.exports = pool;