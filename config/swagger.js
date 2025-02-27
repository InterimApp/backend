const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Interim Backend Api",
    version: "1.0.0",
    description: "This is the backend api description",
  },
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.js"], // Path to the API routes in your Node.js application
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
