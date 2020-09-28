const express = require('express');
const router = express.Router();
const tokenAuth = require("../middleware/tokenauth");
const User = require('../models/User');

/* GET users. */
router.get('/', tokenAuth, function (req, res, next) {
  User.find(function (err, users) {
    if (err) return next({
      error: process.env.NODE_ENV == "development" ? err : "an error occured"
    });
    res.json(users);
  });
});

/* GET user by ID */
router.get('/:id', function (req, res, next) {
  User.findById(req.params.id, function (err, user) {
    if (err | user == null)
      return next({ error: "user doesnt exist" });
    res.json(user);
  });
});

module.exports = router;
