const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const getUserById = async (req, res, next) => {
  const userId = req.params.uid;

  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find this user.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError(
      "Could not find a user for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ user: user.toObject({ getters: true }) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req.body);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  console.log(req.body);

  const { username, password, date_of_birth } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ username: username });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User already exists, please login instead",
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create user, please try again. hereee",
      500
    );
    return next(error);
  }

  const createdUser = new User({
    username,
    password: hashedPassword,
    date_of_birth,
    products: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signing Up failed fo2", 500);
    return next(error);
  }

  let token;
  console.log(typeof createdUser.id);
  try {
    token = jwt.sign(
      { userId: createdUser.id, username: createdUser.username },
      "supersecret_supersecret_supersecret",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Signing Up failed here", 500);
    return next(error);
  }

  res.status(201).send({
    userId: createdUser.id,
    username: createdUser.username,
    token: token,
  });
};

const login = async (req, res, next) => {
  const { username, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ username: username });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "Invalid credentials, could not log you in",
      403
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, please check your credentials",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid credentials, could not log you in",
      401
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, username: existingUser.username },
      "supersecret_supersecret_supersecret",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Logging Up failed", 500);
    return next(error);
  }

  res.send({
    userId: existingUser.id,
    username: existingUser.username,
    token: token,
  });
};

exports.signup = signup;
exports.login = login;
exports.getUserById = getUserById;
