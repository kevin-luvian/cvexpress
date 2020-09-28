const User = require("./models/User");
const bcrypt = require("bcrypt");

require("dotenv").config();

module.exports = () => {
  const username = process.env.USERNAME_APP;
  const password = process.env.PASSWORD_APP;
  User.findOne({ username: username }, (err, user) => {
    if (err) console.log("Error", process.env.NODE_ENV == "development" ? err : "an error occured");
    if (user == null) {
      console.log("Creating user...")
      User.create({
        username: username,
        password: bcrypt.hashSync(password, parseInt(process.env.SALT_ROUNDS))
      });
    }
  });
};
