const express = require("express");
require("dotenv").config();
const path = require("path");
const payslipRouter = require("./src/routes/payslips");
const userRouter = require("./src/routes/profile");
const contractRouter = require("./src/routes/contract");
const reportRouter = require("./src/routes/report");
const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const cors = require("cors");

// Database connection test
const db = require("./config/mySql");
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

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadDir = path.join(__dirname, 'uploads/cvs');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('📁 Created uploads directory');
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form data parsing

// Serve static files from uploads directory
app.use('/uploads', express.static(uploadDir));

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
  
  // Handle multer errors specifically
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
  
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
  console.log(`📁 File uploads directory: ${uploadDir}`);
});