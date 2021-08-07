const express = require("express");

const { check } = require("express-validator");

const watchListController = require("../controllers/watchlist-controller");

const router = express.Router();

router.get("/:uid", watchListController.getByUserId);

router.post("/add", watchListController.addToWatchList);

module.exports = router;
