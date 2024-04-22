const express = require("express");
const app = express();
const winston = require("winston");

app.use(express.json());

function logMessage(level, message) {
  logger.log({
    level: level,
    message: message,
  });
}

function logOperationRequest(level, operation, num1, num2) {
  logger.log({
    level: level,
    message: `New ${operation} operation requested: ${num1} ${operation} ${num2}`,
  });
}

// Validation function
function validateInput(req, res, next) {
  const { inputnum1, inputnum2 } = req.body;

  // Check if num1 and num2 are not null or empty
  if (
    inputnum1 === undefined ||
    inputnum2 === undefined ||
    inputnum1 === "" ||
    inputnum2 === ""
  ) {
    logMessage("error", `null error found, Both numbers are required`);
    return res.status(400).json({ error: "Both numbers are required." });
  }

  // Check if num1 and num2 are numbers
  if (isNaN(inputnum1) || isNaN(inputnum2)) {
    logMessage("error", `Invalid input. Please provide valid numbers`);
    return res
      .status(400)
      .json({ error: "Invalid input. Please provide valid numbers" });
  }
  // If input is valid, proceed to the next middleware/route handler
  next();
}

// Function for addition
function fnaddition(req, res) {
  const { inputnum1, inputnum2 } = req.body;
  // Log the addition operation request
  logOperationRequest("info", "+", inputnum1, inputnum2);
  // Call the validateInput function
  validateInput(req, res, () => {
    // Validation passed, proceed with addition operation
    const result = parseFloat(inputnum1) + parseFloat(inputnum2);
    res.json({ result });
  });
}

// Function for substraction
function fnsubtraction(req, res) {
  const { inputnum1, inputnum2 } = req.body;
  // Log the addition operation request
  logOperationRequest("info", "-", inputnum1, inputnum2);
  // Call the validateInput function
  validateInput(req, res, () => {
    // Validation passed, proceed with addition operation
    const result = parseFloat(inputnum1) - parseFloat(inputnum2);
    res.json({ result });
  });
}

// Function for divide
function fndivision(req, res) {
  const { inputnum1, inputnum2 } = req.body;
  // Log the addition operation request
  logOperationRequest("info", "/", inputnum1, inputnum2);
  // Call the validateInput function
  validateInput(req, res, () => {
    // Validation passed, proceed with addition operation
    const result = parseFloat(inputnum1) / parseFloat(inputnum2);
    res.json({ result });
  });
}

// Function for multipication
function fnmultiplication(req, res) {
  const { inputnum1, inputnum2 } = req.body;
  // Log the addition operation request
  logOperationRequest("info", "x", inputnum1, inputnum2);
  // Call the validateInput function
  validateInput(req, res, () => {
    // Validation passed, proceed with addition operation
    const result = parseFloat(inputnum1) * parseFloat(inputnum2);
    res.json({ result });
  });
}



// API endpoints with middleware for input validation
app.post("/api/add", fnaddition);
app.post("/api/substract", fnsubtraction);
app.post("/api/multipy", fnmultiplication);
app.post("/api/divide", fndivision);

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(), // Add timestamp
    winston.format.json()
  ),
  defaultMeta: { service: "calculator-microservice" },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(), // Add timestamp
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      format: winston.format.combine(
        winston.format.timestamp(), // Add timestamp
        winston.format.json()
      ),
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
      format: winston.format.combine(
        winston.format.timestamp(), // Add timestamp
        winston.format.json()
      ),
    }),
  ],
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
