const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();


app.use(express.json());

const database = require("./config/database");

const PORT = process.env.PORT || 4000;
database.dbconnect();

app.listen(PORT, () => {
  console.log("App listening on port", PORT);
});
app.get("/", (req, res) => {
  res.send(`<h1>Pro Manage Is Working Fine</h1>`);
});
