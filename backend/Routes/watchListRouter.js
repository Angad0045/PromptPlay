const express = require("express");
const { userAuth } = require("../Middlewares/userAuth");
const watchListModel = require("../Models/watchListModel");
const watchListRouter = express.Router();

watchListRouter.post("/", userAuth, async (req, res) => {
  try {
    const { id, name, posterPath } = req.body;
    const userId = req.user._id;

    if (!id || !name || !posterPath) {
      return res
        .status(400)
        .json({ error: "id, name and posterPath are required" });
    }

    let movieList = await watchListModel.findOne({ userId });

    if (!movieList) {
      movieList = new watchListModel({
        userId,
        watchlist: [{ id, name, posterPath }],
      });
    } else {
      const alreadyExists = movieList.watchlist.some(
        (item) => item.id.toString() === id.toString(),
      );
      if (alreadyExists) {
        return res
          .status(409)
          .json({ error: "Movie already exists in watchlist" });
      }
      movieList.watchlist.push({ id, name, posterPath });
    }

    await movieList.save();

    res.status(201).json({
      message: "Movie added to watchlist",
      watchlist: movieList.watchlist,
    });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

watchListRouter.delete("/:id", userAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!id) {
      return res.status(400).json({ error: "Movie ID is required" });
    }

    const updatedList = await watchListModel.findOneAndUpdate(
      { userId },
      { $pull: { watchlist: { id } } },
      { new: true },
    );

    if (!updatedList) {
      return res.status(404).json({ error: "Watchlist not found" });
    }

    res.status(200).json({
      message: "Movie removed from watchlist",
      watchlist: updatedList.watchlist,
    });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

watchListRouter.get("/", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;

    const usersWatchlist = await watchListModel.findOne({ userId });

    if (!usersWatchlist || !usersWatchlist.watchlist.length) {
      return res
        .status(200)
        .json({ message: "Watchlist is empty", watchlist: [] });
    }

    res.status(200).json({
      message: "Watchlist fetched successfully",
      watchlist: usersWatchlist.watchlist,
    });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = watchListRouter;
