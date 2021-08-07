const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const productRoutes = require("./routes/product-routes");
const userRoutes = require("./routes/user-routes");
const watchListRoutes = require("./routes/watchlist-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/api/products", productRoutes);

app.use("/api/users", userRoutes);

app.use("/api/watchlist", watchListRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    }); // delete it from it's path
  }
  //speical
  if (res.headerSent) {
    //is sent
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred" });
});

mongoose
  .connect(
    `mongodb+srv://admin:741852963@cluster0.ytith.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => app.listen(5000))
  .catch((err) => {
    console.log("can't start");
  });
