const express = require("express");
require("dotenv").config();
const userRouter = require("./src/routes/user");
const adminRouter = require("./src/routes/admin");


const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const cors = require("cors");

// Create an Express application
const app = express();
//app.use(morgan("dev"));
app.use(express.json());
//app.use(cors());
app.use(cors({ origin: "http://localhost:3000" }));


app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);




const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});