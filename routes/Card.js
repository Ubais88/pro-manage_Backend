// Import the required modules
const express = require("express");
const router = express.Router();


// Import the required controllers and middleware functions
const { createCard } = require("../controllers/Card");


// Route for user createQuiz 
router.post("/create" , createCard)


// Export the router for use in the main application
module.exports = router;