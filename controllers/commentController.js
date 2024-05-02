const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");


exports.comments_get = asyncHandler(async (req, res, next) => {
  const postId = req.params.postid;
  const allComments = await Comment.find({ post: postId }).populate("author").exec();

  res.json({ title: "GET all post comments", posts: allComments })
});

exports.comments_post = [
  body("text", "Comment must be between 1 - 400 characters")
    .trim()
    .isLength({ min: 1, max: 400 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a post object with escaped and trimmed data.
    const comment = new Comment({
      text: req.body.text,
      post: req.params.postid,
      // set author manually until auth is done
      author: "66329cd61caffdd2461a7129",
    });

    if (!errors.isEmpty()) {
      // There are errors.
      res.json({
        msg: "Something is wrong",
        comment: comment,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      await comment.save();
      res.json({
        msg: "Comment created"
      });
    }
  }),
];

exports.comment_detail = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentid).populate("author").exec();

  res.json({ title: "GET one comment", comment: comment })
});

exports.comment_edit = [
  body("text", "Comment must be between 1 - 400 characters")
    .trim()
    .isLength({ min: 1, max: 400 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a comment object with escaped and trimmed data.
    const comment = {
      text: req.body.text,
    };

    if (!errors.isEmpty()) {
      // There are errors.
      res.json({
        msg: "Something is wrong",
        comment: comment,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      await Comment.findByIdAndUpdate(req.params.commentid, comment);
      res.json({
        msg: "Comment updated"
      });
    }
  }),
];

exports.comment_delete = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentid).exec();
  if (comment) {
    await Comment.findByIdAndDelete(req.params.commentid).exec();
    res.json({ msg: "Comment deleted" })
  } else {
    res.json({ msg: "There is no such comment" })
  }
});