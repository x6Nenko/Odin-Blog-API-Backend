const User = require("../models/User");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");


exports.comments_get = asyncHandler(async (req, res, next) => {
  res.json({ title: "Comments GET - not implemented" })
});

exports.comments_post = asyncHandler(async (req, res, next) => {
  res.json({ title: "Comments POST - not implemented" })
});

exports.comment_detail = asyncHandler(async (req, res, next) => {
  res.json({ title: "Comment detail - not implemented" })
});

exports.comment_edit = asyncHandler(async (req, res, next) => {
  res.json({ title: "Comment update - not implemented" })
});

exports.comment_delete = asyncHandler(async (req, res, next) => {
  res.json({ title: "Comment delete - not implemented" })
});