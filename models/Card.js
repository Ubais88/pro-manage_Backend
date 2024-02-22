const mongoose = require("mongoose");

const checklistSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  isChecked: {
    type: Boolean,
    default: false,
  },
});

const cardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ["HIGH PRIORITY", "MODERATE PRIORITY", "LOW PRIORITY"],
      required: true, 
    },
    checkList: {
      type: [checklistSchema],
      required: true,
    },
    dueDate: {
      type: Date,
    },
    sectionType: {
      type: String,
      enum: ["Backlog", "ToDo", "Inprogress", "Done"],
      default: "ToDo",
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Card", cardSchema);
