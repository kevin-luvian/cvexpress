const mongoose = require("mongoose");

const schema = mongoose.Schema({
    username: { type: String, unique: true },
    password: { type: String, maxlength: 100 },
});

module.exports = mongoose.model("User", schema);