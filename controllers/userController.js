const User = require("../models/User");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');


exports.users_get = asyncHandler(async (req, res, next) => {
  const allUsers = await User.find({}, "username").exec();

  res.json({ title: "GET all users", users: allUsers })
});

exports.users_post = [
  body("username", "Username must contain at least 3 characters")
    .trim()
    .isLength({ min: 3, max: 40 })
    .escape(),
  body("password", "Password must be more than 3 symbols.")
    .trim()
    .isLength({ min: 3, max: 100 }),
  body('passwordConfirmation', "Passwords do not match.")
    .trim()
    .custom((value, { req }) => {
      return value === req.body.password;
    }),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a user object with escaped and trimmed data.
    const user = new User({ 
      username: req.body.username,
      password: req.body.password,
      is_author: false,
    });

    if (!errors.isEmpty()) {
      // There are errors.
      res.json({
        msg: "Something is wrong",
        user: user,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      const userExists = await User.findOne({ username: req.body.username }).exec();
      if (userExists) {
        res.json({
          msg: "User exists",
        });
      } else {
        try {
          const hashedPassword = await bcrypt.hash(user.password, 10);
          user.password = hashedPassword;
      
          await user.save();
          res.json({
            msg: "User created"
          });
        } catch (err) {
          // Handle any errors
          return next(err);
        }
      }
    }
  }),
];

exports.user_detail = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.userid).exec();

  res.json({ title: "GET one user", user: user })
});

exports.user_edit = [
  body("username", "Username must contain at least 3 characters")
    .trim()
    .isLength({ min: 3, max: 40 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    const user = {
      username: req.body.username,
    };

    if (!errors.isEmpty()) {
      // There are errors.
      res.json({
        msg: "Something is wrong",
        user: user,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      const userExists = await User.findOne({ username: req.body.username }).exec();
      if (userExists) {
        res.json({
          msg: "User exists",
        });
      } else {
        await User.findByIdAndUpdate(req.params.userid, user);
        res.json({
          msg: "User updated"
        });
      }
    }
  }),
];

exports.user_delete = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.userid).exec();
  if (user) {
    await User.findByIdAndDelete(req.params.userid).exec();
    res.json({ msg: "User deleted" })
  } else {
    res.json({ msg: "There is no such user" })
  }
});