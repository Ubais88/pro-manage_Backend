const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();


app.use(express.json());


const database = require("./config/database");
const userRoutes = require("./routes/User");
const cardRoutes = require("./routes/Card");


const PORT = process.env.PORT || 4000;
database.dbconnect();

// routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/card", cardRoutes);



app.listen(PORT, () => {
  console.log("App listening on port", PORT);
});
app.get("/", (req, res) => {
  res.send(`<h1>Pro Manage Is Working Fine</h1>`);
});
