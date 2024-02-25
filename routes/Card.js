// Import the required modules
const express = require("express");
const router = express.Router();

// Import the required controllers and middleware functions
const {
  createCard,
  deleteCard,
  getAllCards,
  getCard,
  getCardCounts,
  updateCard,
  moveCard,
  toggleChecklistItem,
} = require("../controllers/Card");
const { authMiddleware } = require("../middlewares/authMiddleware");

// Route for user createQuiz
router.post("/create", authMiddleware, createCard);
router.delete("/delete/:cardId", authMiddleware, deleteCard);
router.post("/getallcards", authMiddleware, getAllCards);
router.get("/getcard/:cardId", getCard);
router.get("/analysis", authMiddleware, getCardCounts);
router.put("/update/:cardId", authMiddleware, updateCard);
router.put("/movecard/:cardId", authMiddleware, moveCard);
router.put(
  "/toggle/:cardId/checklist/:itemId",
  authMiddleware,
  toggleChecklistItem
);

// Export the router for use in the main application
module.exports = router;
