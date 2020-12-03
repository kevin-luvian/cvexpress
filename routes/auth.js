const express = require("express");
const router = express.Router();
const tokenAuth = require("../middleware/tokenauth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require('../models/User');

/* GET tokenAuth middleware check. */
router.get("/check", tokenAuth, async (req, res) => {
  res.status(200).json({ message: "authenticated" });
});

/* POST user credentials. */
router.post("/", async (req, res) => {
  User.findOne({ username: req.body.username }, (err, user) => {
    if (err | user == null) return res.status(404).json({ error: "user doesnt exist" })

    // compare password
    if (!bcrypt.compareSync(req.body.password, user.password)) return res.status(404).json({ error: "authentication failed" })

    // create jwt exp in 2 hour
    const time_expires = Math.floor(Date.now() / 1000) + 60 * 60 * 2;
    const token = jwt.sign(
      {
        username: user.username,
        exp: time_expires
      },
      process.env.JWT_TOKEN_SECRET
    );
    res.json({ username: user.username, token: token, expires: time_expires });
  });
});

module.exports = router;
