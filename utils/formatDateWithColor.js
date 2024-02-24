const moment = require("moment");

exports.formatDateWithColor = (date) => {
  const formattedDate = moment(date).format("MMM Do");
  // console.log("formatDate : ", formattedDate);
  const today = moment();
  const targetDate = moment(date);

  // Calculate the difference in days between today and the target date
  const daysDifference = targetDate.diff(today, "days");
  // console.log("daysDifference : ", daysDifference);

  // Determine the color based on the difference in days
  let color = "";
  if (daysDifference <= -1) {
    // console.log("Expired");
    color = "#CF3636"; // Expired
  } else {
    // console.log("Upcoming (including today)");
    color = "#DBDBDB"; // Upcoming (including today)
  }

  // Return the formatted date and color indicator
  return { formattedDate, color };
};
