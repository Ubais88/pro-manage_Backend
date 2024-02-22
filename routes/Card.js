// Import the required modules
const express = require("express");
const router = express.Router();

// Import the required controllers and middleware functions
const { createCard, deleteCard, getAllCards, getCard, getCardCounts, updateCard } = require("../controllers/Card");
const { authMiddleware } = require("../middlewares/authMiddleware");

// Route for user createQuiz
router.post("/create", authMiddleware, createCard);
router.delete("/delete", authMiddleware, deleteCard);
router.get("/getallcards", authMiddleware, getAllCards);
router.get("/getcard", authMiddleware, getCard);
router.get("/analysis", authMiddleware, getCardCounts);
router.put("/update/:cardId", authMiddleware, updateCard);


// Export the router for use in the main application
module.exports = router;
