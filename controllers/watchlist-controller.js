const HttpError = require("../models/http-error");

const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const WatchList = require("../models/WatchList");
const Product = require("../models/Product");

const getByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let watchList;
  try {
    watchList = await WatchList.findOne({ userId: userId }).populate(
      "products"
    );
    res.send({
      products: watchList.products.map((product) =>
        product.toObject({ getters: true })
      ),
    });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find this product.",
      500
    );
    return next(error);
  }

  res.json({ product: product.toObject({ getters: true }) });
};

const addToWatchList = async (req, res, next) => {
  const { userId, productId } = req.body;
  var objProductId = mongoose.Types.ObjectId(productId);

  let existingWatchList;
  try {
    existingWatchList = await WatchList.findOne({ userId: userId });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please tdry again later.",
      500
    );
    return next(error);
  }

  if (existingWatchList) {
    if (existingWatchList.products.find((product) => product == productId)) {
      console.log("here");
      var newProducts = existingWatchList.products.filter(
        (id) => id != productId
      );
      existingWatchList.products = newProducts;
      res.status(201).send("removed");
    } else {
      existingWatchList.products.push(objProductId);
    }
    try {
      await existingWatchList.save();
    } catch (err) {
      const error = new HttpError(
        "Something went wrong, could not update watchlist.",
        500
      );
      return next(error);
    }
    res.status(201).send("done");
  } else {
    let createdWatchList;
    try {
      createdWatchList = new WatchList({
        userId,
        products: [objProductId],
      });
    } catch (err) {
      const error = new HttpError(err, 500);
      return next(error);
    }

    console.log(createdWatchList);

    try {
      await createdWatchList.save();
    } catch (err) {
      const error = new HttpError("Signing Up failed fo2", 500);
      return next(error);
    }
    res.status(201).send({
      watchList: createdWatchList,
    });
  }
};

exports.getByUserId = getByUserId;
exports.addToWatchList = addToWatchList;
