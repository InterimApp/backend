const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "Interim Backend Api",
        version: "1.0.0",
        description: "API for interim management system",
    },
    servers: [
        {
            url: "http://localhost:8080/api",
            description: "Development server",
        },
    ],
    components: {
        schemas: {
            Report: {
                type: "object",
                properties: {
                    id: { type: "integer" },
                    submitted_by: { type: "integer" },
                    submitted_to: { type: "integer" },
                    subject: { type: "string" },
                    description: { type: "string" },
                    status: { 
                        type: "string",
                        enum: ["Soumis", "En cours de révision", "Révisé"]
                    },
                    created_at: { type: "string", format: "date-time" }
                }
            },
            Payslip: {
                type: "object",
                properties: {
                    id: { type: "integer", example: 1 },
                    date: { type: "string", format: "date", example: "2025-03-08" },
                    payslip_path: { 
                        type: "string", 
                        example: "https://storage.example.com/payslips/1.pdf" 
                    },
                    company_name: { type: "string", example: "XYZ Corporation" },
                    job_title: { type: "string", example: "Warehouse Assistant" },
                    uploaded_at: { 
                        type: "string", 
                        format: "date-time", 
                        example: "2025-03-10T14:30:00.000Z" 
                    }
                }
            },
            PayslipDetails: {
                allOf: [
                    { $ref: "#/components/schemas/Payslip" },
                    {
                        type: "object",
                        properties: {
                            employee_name: { 
                                type: "string", 
                                example: "syrine eladeb" 
                            },
                            salary: { 
                                type: "number", 
                                format: "float", 
                                example: 2500.00 
                            },
                            work_hours: { 
                                type: "integer", 
                                example: 160 
                            },
                            overtime_hours: { 
                                type: "integer", 
                                example: 10 
                            }
                        }
                    }
                ]
            }
        }
    }
};

const options = {
    swaggerDefinition,
    apis: ["./src/routes/*.js"], // This will automatically include all route files
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;