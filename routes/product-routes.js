const express = require("express");

const { check } = require("express-validator");

const productsControllers = require("../controllers/products-controller");
const fileUpload = require("../middlewares/file-upload");
const checkAuth = require("../middlewares/check-auth");

const router = express.Router();

router.get("/:pid", productsControllers.getProductsById);

router.get("/user/:uid", productsControllers.getProductsByUserId);

router.post("/", productsControllers.createProduct);

router.delete("/:pid", productsControllers.deleteProduct);

module.exports = router;
