const express = require('express');
const router = express.Router();

const user_controller = require("../controllers/userController");
const post_controller = require("../controllers/postController");
const comment_controller = require("../controllers/commentController");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const jwt = require("jsonwebtoken");
router.get("/protected", verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if(err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: 'Protected route accessed...',
        authData
      });
    }
  });
});

function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer is undefined
  if(typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }
};


// USER ROUTES

// GET request to get all users
router.get("/users", user_controller.users_get);

// POST request create new user
router.post("/users", user_controller.users_post);

router.post("/login", user_controller.user_login)

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
