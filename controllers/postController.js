const User = require("../models/User");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");


exports.posts_get = asyncHandler(async (req, res, next) => {
  res.json({ title: "Posts GET - not implemented" })
});

exports.posts_post = asyncHandler(async (req, res, next) => {
  res.json({ title: "Posts POST - not implemented" })
});

exports.post_detail = asyncHandler(async (req, res, next) => {
  res.json({ title: "Post detail - not implemented" })
});

exports.post_edit = asyncHandler(async (req, res, next) => {
  res.json({ title: "Post update - not implemented" })
});

exports.post_delete = asyncHandler(async (req, res, next) => {
  res.json({ title: "Post delete - not implemented" })
});