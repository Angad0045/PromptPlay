require("dotenv").config();
const express = require("express");
const app = express();
require("./Config/database");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 8080;

const authRouter = require("./Routes/authRouter");
const paymentRouter = require("./Routes/paymentRouter");
const watchListRouter = require("./Routes/watchListRouter");
const movieRouter = require("./Routes/movieRouter");

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
  next();
});

app.use(
  cors({ origin: "https://promptplay-beta.vercel.app", credentials: true }),
);
app.use(cookieParser());
app.use(express.json());
app.use("/auth", authRouter);
app.use("/payment", paymentRouter);
app.use("/watchList", watchListRouter);
app.use("/movies", movieRouter);

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
  });
}

module.exports = app;
