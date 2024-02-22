const Card = require("../models/Card");

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
