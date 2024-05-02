const User = require("../models/User");
const Post = require("../models/Post");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");


exports.posts_get = asyncHandler(async (req, res, next) => {
  const allPosts = await Post.find().populate("author").exec();

  res.json({ title: "GET all posts", posts: allPosts })
});

exports.posts_post = [
  body("title", "Title must be between 1 - 40 characters")
    .trim()
    .isLength({ min: 1, max: 40 })
    .escape(),
  body("text", "Text must be between 1 - 1500 characters")
    .trim()
    .isLength({ min: 1, max: 1500 })
    .escape(),
  body("author", "Author must be selected")
    .trim()
    .escape(),
  body('published', "Published field must be selected.")
    .trim()
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a post object with escaped and trimmed data.
    const post = new Post({ 
      title: req.body.title,
      text: req.body.text,
      // set author manually until auth is done
      author: "66329cd61caffdd2461a7129",
      published: req.body.published,
    });

    if (!errors.isEmpty()) {
      // There are errors.
      res.json({
        msg: "Something is wrong",
        post: post,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      await post.save();
      res.json({
        msg: "Post created"
      });
    }
  }),
];

exports.post_detail = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.postid).populate("author").exec();

  res.json({ title: "GET one post", post: post })
});

exports.post_edit = [
  body("title", "Title must be between 1 - 40 characters")
    .trim()
    .isLength({ min: 1, max: 40 })
    .escape(),
  body("text", "Text must be between 1 - 1500 characters")
    .trim()
    .isLength({ min: 1, max: 1500 })
    .escape(),
  body('published', "Published field must be selected.")
    .trim()
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a post object with escaped and trimmed data.
    const post = {
      title: req.body.title,
      text: req.body.text,
      published: req.body.published,
    };

    if (!errors.isEmpty()) {
      // There are errors.
      res.json({
        msg: "Something is wrong",
        post: post,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      await Post.findByIdAndUpdate(req.params.postid, post);
      res.json({
        msg: "Post updated"
      });
    }
  }),
];

exports.post_delete = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.postid).exec();
  if (post) {
    await Post.findByIdAndDelete(req.params.postid).exec();
    res.json({ msg: "Post deleted" })
  } else {
    res.json({ msg: "There is no such post" })
  }
});