const moment = require("moment");

exports.formatDateWithColor = (date) => {
  const formattedDate = moment(date).format("MMM Do");
  const today = moment();
  const targetDate = moment(date);

  // Calculate the difference in days between today and the target date
  const daysDifference = targetDate.diff(today, "days");

  // Determine the color based on the difference in days
  let color = "";
  if (daysDifference <= -1) {
    color = "#CF3636"; // Expired
  } else {
    color = "#DBDBDB"; // Upcoming (including today)
  }

  // Return the formatted date and color indicator
  return { formattedDate, color };
};
