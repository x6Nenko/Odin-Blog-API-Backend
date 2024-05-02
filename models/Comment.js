const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  text: { type: String, required: true, minLength: 1, maxLength: 400 },
  post: { type: Schema.Types.ObjectId, ref: "Post", },
  author: { type: Schema.Types.ObjectId, ref: "User", },
}, { timestamps: true });

CommentSchema.virtual("url").get(function () {
  return `/comment/${this._id}`;
});

CommentSchema.virtual("createdAt_formatted").get(function () {
  return DateTime.fromJSDate(this.createdAt).toLocaleString(DateTime.DATETIME_MED);
});

// Export model
module.exports = mongoose.model("Comment", CommentSchema);