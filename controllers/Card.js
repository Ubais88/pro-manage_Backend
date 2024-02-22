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
    const { title, priority, checkList, dueDate } = req.body;

    if (!title || !priority || !checkList || !checkList.length) {
      return res.status(400).json({
        success: false,
        message:
          "Title, priority, and at least one checklist item are required",
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
        startDate = moment().subtract(7, "days").startOf("day");
    }

    console.log("startDate.toDate() ", startDate.toDate());
    console.log("startDate ", startDate);

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

exports.getCard = async (req, res) => {
  try {
    const { cardId } = req.params;

    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(400).json({
        success: false,
        message: "card is missing or cardId is wrong",
      });
    }

    res.status(200).json({
      success: true,
      card,
      message: "card fetched successfully",
    });
  } catch (error) {
    //console.log(error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "something went wrong during fetching card",
    });
  }
};

exports.getCardCounts = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "UserId is required",
      });
    }

    const currentDate = moment().startOf("day");

    const counts = {
      backlog: 0,
      inprogress: 0,
      todo: 0,
      done: 0,
      lowpriority: 0,
      moderatepriority: 0,
      highpriority: 0,
      dueDatePassed: 0,
    };

    const cards = await Card.find({ creatorId: userId }).select(
      "priority sectionType dueDate"
    );

    cards.forEach((card) => {
      const sectionType = card.sectionType.toLowerCase();
      counts[sectionType]++;
      const priority = card.priority.toLowerCase().replace(" ", "");
      counts[priority]++;

      if (sectionType !== "done" && card.dueDate) {
        const dueDate = moment(card.dueDate);
        if (dueDate.isBefore(currentDate, "day")) {
          counts.dueDatePassed++;
        }
      }
    });

    res.status(200).json({
      success: true,
      counts,
      message: "Card counts fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Something went wrong while fetching card counts",
    });
  }
};

exports.updateCard = async (req, res) => {
  try {
    const userId = req.user.id;
    // Get user ID from request object
    const { cardId } = req.params;

    const card = await Card.findOne({ _id: cardId, creatorId: userId });

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Card not found",
      });
    }

    // Extracting data from the request body
    const { title, priority, checkList, dueDate } = req.body;

    if (!title || !priority || !checkList || !checkList.length) {
      return res.status(400).json({
        success: false,
        message:
          "Title, priority, and at least one checklist item are required",
      });
    }

    // Update the card
    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { title, priority, checkList, dueDate },
      { new: true }
    );

    res.status(200).json({
      success: true,
      updatedCard,
      message: "Card updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Something went wrong while updating card",
    });
  }
};

exports.moveCard = async (req, res) => {
  try {
  } catch (error) {}
};
