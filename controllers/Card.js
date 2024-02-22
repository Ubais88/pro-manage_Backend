const Card = require("../models/Card");
const moment = require("moment");

// Controller function to create a new card
exports.createCard = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "UserId is required are required",
      });
    }

    // Extracting data from the request body
    const { title, priority, checkList, dueDate, creatorId } = req.body;

    if (!title || !priority || !checkList.length) {
      return res.status(500).json({
        success: false,
        message: "All Fields are required",
      });
    }

    // Creating a new card instance
    const newCard = new Card({
      title,
      priority,
      checkList,
      dueDate,
      creatorId: userId,
    });

    // Saving the new card to the database
    const savedCard = await newCard.save();
    res.status(201).json({
      success: true,
      savedCard,
      message: "Card saved successfully",
    });
  } catch (error) {
    console.error("Error creating card:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Error creating card",
    });
  }
};

exports.deleteCard = async (req, res) => {
  try {
    // Extracting data from the request body
    const { cardId } = req.params;
    // find Card
    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "card not found",
      });
    }

    // Delete the Card
    await Card.findByIdAndDelete(cardId);

    return res.status(200).json({
      success: true,
      message: "Card deleted successfully",
    });
  } catch (error) {
    //console.log(error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "something went wrong during deleting Card",
    });
  }
};

exports.getAllCards = async (req, res) => {
  try {
    const userId = req.user.id;
    const { sortingTime } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "UserId is required",
      });
    }

    let startDate;
    switch (sortingTime) {
      case "today":
        startDate = moment().startOf("day");
        break;
      case "week":
        startDate = moment().subtract(7, "days").startOf("day");
        break;
      case "month":
        startDate = moment().subtract(30, "days").startOf("day");
        break;
      default:
        startDate = null;
    }

    if (!startDate) {
      return res.status(400).json({
        success: false,
        message: "Invalid sorting time provided",
      });
    }

    const cards = await Card.find({
      creatorId: userId,
      createdAt: { $gte: startDate.toDate() },
    });

    // Divide cards into categories
    const categorizedCards = {
      Backlog: [],
      ToDo: [],
      InProgress: [],
      Done: [],
    };

    if (cards.length === 0) {
      return res.status(200).json({
        success: true,
        cards: categorizedCards,
        message: "No cards available",
      });
    }

    cards.forEach((card) => {
      categorizedCards[card.sectionType].push(card);
    });

    res.status(200).json({
      success: true,
      cards: categorizedCards,
      message: "Cards fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Something went wrong during fetching cards",
    });
  }
};
