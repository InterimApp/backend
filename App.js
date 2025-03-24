const express = require("express");
require("dotenv").config();
const payslipRouter = require("./src/routes/payslips");
const userRouter = require("./src/routes/profile");
const contractRouter = require("./src/routes/contract");
const reportRouter = require("./src/routes/report");
const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const cors = require("cors");

// Database connection test
const db = require("./config/mysql");
(async () => {
  try {
    const conn = await db.getConnection();
    console.log("✅ Database connection established");
    conn.release();
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  }
})();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger documentation
app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// Routes
app.use("/api/user", userRouter);
app.use("/api/contracts", contractRouter);
app.use("/api/reports", reportRouter);
app.use("/api/payslips", payslipRouter);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    status: 'error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Start server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📄 API docs available at http://localhost:${port}/api/docs`);
});

