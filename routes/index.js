const express = require('express');
const router = express.Router();

const user_controller = require("../controllers/userController");
const post_controller = require("../controllers/postController");
const comment_controller = require("../controllers/commentController");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


// USER ROUTES

// GET request to get all users
router.get("/users", user_controller.users_get);

// POST request create new user
router.post("/users", user_controller.users_post);

// GET request for one User.
router.get("/users/:userid", user_controller.user_detail);

// PUT request to edit one User.
router.put("/users/:userid", user_controller.user_edit);

// DELEETE request to delete one User.
router.delete("/users/:userid", user_controller.user_delete);


// POSTS ROUTES

// GET request to get all posts
router.get("/posts", post_controller.posts_get);

// POST request create new post
router.post("/posts", post_controller.posts_post);

// GET request for one Post.
router.get("/posts/:postid", post_controller.post_detail);

// PUT request to edit one Post.
router.put("/posts/:postid", post_controller.post_edit);

// DELEETE request to delete one Post.
router.delete("/posts/:postid", post_controller.post_delete);


// COMMENTS ROUTES

// GET request to get all comments for a Post
router.get("/posts/:postid/comments", comment_controller.comments_get);

// POST request to create new comment
router.post("/posts/:postid/comments", comment_controller.comments_post);

// GET request for one comment.
router.get("/posts/:postid/comments/:commentid", comment_controller.comment_detail);

// PUT request to edit one comment.
router.put("/posts/:postid/comments/:commentid", comment_controller.comment_edit);

// DELEETE request to delete one comment.
router.delete("/posts/:postid/comments/:commentid", comment_controller.comment_delete);


module.exports = router;
