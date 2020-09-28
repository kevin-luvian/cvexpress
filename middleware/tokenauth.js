const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) throw "no token detected";
    res.locals.token = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
    next();
  } catch (err) {
    console.log("[ error ]", err);
    return res.status(401).json({ error: process.env.NODE_ENV == "development" ? err : "unauthorized" });
  }
};
