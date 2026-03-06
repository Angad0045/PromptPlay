const mongoose = require("mongoose");

const DB_URL = process.env.DB_URL;

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("Database is connected....");
  })
  .catch((err) => {
    console.log("Something went wrong: ", err);
  });
