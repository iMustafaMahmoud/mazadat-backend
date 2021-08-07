const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true, minlength: 6 },
    date_of_birth: { type: String, required: true },
    products: [
      { type: mongoose.Types.ObjectId, required: true, ref: "Product" },
    ],
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

userSchema.plugin(uniqueValidator); //to insure user is created before or not

module.exports = mongoose.model("User", userSchema);
