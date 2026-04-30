const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true, // 👈 add trim
  },
  posterPath: {
    type: String,
    required: true,
    trim: true,
  },
});

const WatchListSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    watchlist: [MovieSchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model("WatchList", WatchListSchema);
