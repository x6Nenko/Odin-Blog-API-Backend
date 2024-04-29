const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true, minLength: 3, maxLength: 40 },
  password: { type: String, required: true, minLength: 3, maxLength: 1000 },
  author: { type:Boolean },
});

UserSchema.virtual("url").get(function () {
  return `/user/${this._id}`;
});

// Export model
module.exports = mongoose.model("User", UserSchema);