const HttpError = require("../models/http-error");

const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const fs = require("fs");

const Product = require("../models/Product");
const User = require("../models/User");

const getProductsById = async (req, res, next) => {
  const productId = req.params.pid;

  let product;
  try {
    product = await Product.findById(productId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find this product.",
      500
    );
    return next(error);
  }

  if (!prodcut) {
    const error = new HttpError(
      "Could not find a product for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ product: product.toObject({ getters: true }) });
};

const getProductsByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let userWithProducts;
  try {
    userWithProducts = await User.findById(userId).populate("products");
  } catch (err) {
    const error = new HttpError(
      "Fetching places failed, please try again later",
      500
    );
    return next(error);
  }

  if (!userWithProducts || userWithProducts.products.length === 0) {
    return next(
      new HttpError("Could not find a product for the provided user id.", 404)
    );
  }

  res.send({
    products: userWithProducts.products.map((product) =>
      product.toObject({ getters: true })
    ),
  });
};

const createProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
  }

  const { name, price } = req.body;
  const createdProduct = new Product({
    name,
    price,
    quantity: "4",
    image: "efsdfsdfsdf",
    ownerId: "dsfdsfsdfdf",
    categoryId: "",
  });

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError(
      "Creating product failed, please try again",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError(
      "We could not find user for the provided id",
      404
    );
    return next(error);
  }

  console.log(user);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdProduct.save({ session: sess }); //make the unique id here
    user.products.push(createdProduct);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating place failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).send(createdProduct);
};

const deleteProduct = async (req, res, next) => {
  const productId = req.params.pid;

  let product;
  try {
    product = await Product.findById(productId).populate("ownerId");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete product.",
      500
    );
    return next(error);
  }

  if (!product) {
    const error = new HttpError("Could not find product for this id. ", 404);
    return next(error);
  }

  if (product.productId.id.toString() !== req.userData.userId) {
    const error = new HttpError("You are allowed to delete this product.", 401);
    return next(error);
  }

  const imagePath = product.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await product.remove({ session: sess });
    product.ownerId.products.pull(product);
    await product.ownerId.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete product.",
      500
    );
    return next(error);
  }

  fs.unlink(imagePath, (err) => {
    console.log(err);
  });

  res.status(200).json({ message: "Deleted place." });
};

exports.getProductsById = getProductsById;
exports.getProductsByUserId = getProductsByUserId;
exports.createProduct = createProduct;
exports.deleteProduct = deleteProduct;
