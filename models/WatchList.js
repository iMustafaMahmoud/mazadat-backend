const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const watchListSchema = new Schema(
  {
    userId: { type: String, required: true, ref: "User" },
    products:
     [
      { type: mongoose.Types.ObjectId, required: true, ref: "Product" },
    ],
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("WatchList", watchListSchema);
