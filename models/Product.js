const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    ownerId: { type: String, required: true, ref: "User" },
    image: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    categoryId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Category",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("Product", productSchema);
