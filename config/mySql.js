const mysql = require("mysql2/promise");

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PSSWD,
  database: process.env.MYSQL_DB,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Connection to the database successful!");
    connection.release();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

module.exports = pool;
