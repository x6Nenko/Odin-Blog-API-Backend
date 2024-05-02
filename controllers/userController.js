const User = require("../models/User");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
require('dotenv').config()


exports.users_get = asyncHandler(async (req, res, next) => {
  jwt.verify(req.token, process.env.JWT_SECRET, async (err, authData) => {
    if (authData && authData.userExists.is_author === true) {
      const allUsers = await User.find({}, "username").exec();
      res.json({ title: "GET all users", users: allUsers, user: req.user });
    } else {
      return res.sendStatus(403);
    }
  });
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

/* Login. */
exports.user_login = [
  body("username", "Username must contain at least 3 characters")
    .trim()
    .isLength({ min: 3, max: 40 })
    .escape(),
  body("password", "Password must be more than 3 symbols.")
    .trim()
    .isLength({ min: 3, max: 100 }),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors.
      res.json({
        msg: "Something is wrong",
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      const userExists = await User.findOne({ username: req.body.username }).exec();

      if (userExists) {
        bcrypt.compare(req.body.password, userExists.password, function(err, result) {
          if (result) {
            jwt.sign({userExists}, process.env.JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
              return res.json({ msg: 'Correct password', token: token })
            });
          } else {
            return res.json({ msg: 'Wrong password', err: err })
          }
        });
      } else {
        return res.status(401).json({ msg: "Auth Failed" })
      }
    }
  }),
];

exports.user_detail = asyncHandler(async (req, res, next) => {
  jwt.verify(req.token, process.env.JWT_SECRET, async (err, authData) => {
    if (authData && authData.userExists.is_author === true) {
      const user = await User.findById(req.params.userid).exec();
      res.json({ title: "GET one user", user: user })
    } else {
      return res.sendStatus(403);
    }
  });
});

exports.user_edit = [
  body("username", "Username must contain at least 3 characters")
    .trim()
    .isLength({ min: 3, max: 40 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    jwt.verify(req.token, process.env.JWT_SECRET, async (err, authData) => {
      if (authData && authData.userExists.is_author === true) {
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
      } else {
        return res.sendStatus(403);
      }
    });
  }),
];

exports.user_delete = asyncHandler(async (req, res, next) => {
  jwt.verify(req.token, process.env.JWT_SECRET, async (err, authData) => {
    if (authData && authData.userExists.is_author === true) {
      const user = await User.findById(req.params.userid).exec();
      if (user) {
        await User.findByIdAndDelete(req.params.userid).exec();
        res.json({ msg: "User deleted" })
      } else {
        res.json({ msg: "There is no such user" })
      }
    } else {
      return res.sendStatus(403);
    }
  });
});