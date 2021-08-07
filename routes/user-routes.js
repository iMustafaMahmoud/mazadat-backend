const express = require("express");

const { check } = require("express-validator");

const userController = require("../controllers/user-controller");

const router = express.Router();

router.get("/:uid", userController.getUserById);

router.post(
  "/signup",
  [
    check("username").not().isEmpty(),
    check("password").isLength({ min: 6 }),
    check("date_of_birth").not().isEmpty(),
  ],
  userController.signup
);

router.post("/login", userController.login);

module.exports = router;
