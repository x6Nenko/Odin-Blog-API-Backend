const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
require('dotenv').config()


exports.comments_get = asyncHandler(async (req, res, next) => {
  const postId = req.params.postid;
  const allComments = await Comment.find({ post: postId }).populate({ path: 'author', select: '-_id username' }).exec();

  res.json({ title: "GET all post comments", posts: allComments })
});

exports.comments_post = [
  body("text", "Comment must be between 1 - 400 characters")
    .trim()
    .isLength({ min: 1, max: 400 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    jwt.verify(req.token, process.env.JWT_SECRET, async (err, authData) => {
      if (authData) {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a post object with escaped and trimmed data.
        const comment = new Comment({
          text: req.body.text,
          post: req.params.postid,
          author: authData.userExists._id,
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
      } else {
        return res.sendStatus(403);
      }
    });
  }),
];

exports.comment_detail = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentid).populate({ path: 'author', select: '-_id username' }).exec();

  res.json({ title: "GET one comment", comment: comment })
});

exports.comment_edit = [
  body("text", "Comment must be between 1 - 400 characters")
    .trim()
    .isLength({ min: 1, max: 400 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    jwt.verify(req.token, process.env.JWT_SECRET, async (err, authData) => {
      // by logic the one who wrote a comment should be able to edit it, 
      // however only the author/admin (with access to write posts) will have those rights
      // save a bit of time
      if (authData && authData.userExists.is_author === true) {
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
          return res.json({
            msg: "Comment updated"
          });
        }
      } else {
        return res.sendStatus(403);
      }
    });
  }),
];

exports.comment_delete = asyncHandler(async (req, res, next) => {
  jwt.verify(req.token, process.env.JWT_SECRET, async (err, authData) => {
    if (authData && authData.userExists.is_author === true) {
      const comment = await Comment.findById(req.params.commentid).exec();
      if (comment) {
        await Comment.findByIdAndDelete(req.params.commentid).exec();
        return res.json({ msg: "Comment deleted" })
      } else {
        return res.json({ msg: "There is no such comment" })
      }
    } else {
      return res.sendStatus(403);
    }
  });
});