const User = require("../models/User");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");


exports.users_get = asyncHandler(async (req, res, next) => {
  res.json({ title: "Users GET - not implemented" })
});

exports.users_post = asyncHandler(async (req, res, next) => {
  res.json({ title: "Users POST - not implemented" })
});

exports.user_detail = asyncHandler(async (req, res, next) => {
  res.json({ title: "User detail - not implemented" })
});

exports.user_edit = asyncHandler(async (req, res, next) => {
  res.json({ title: "User update - not implemented" })
});

exports.user_delete = asyncHandler(async (req, res, next) => {
  res.json({ title: "User delete - not implemented" })
});