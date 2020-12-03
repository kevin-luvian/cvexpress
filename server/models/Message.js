const mongoose = require("mongoose");

const schema = mongoose.Schema({
    name: { type: String },
    email: { type: String },
    subject: { type: String },
    body: { type: String },
});

module.exports = mongoose.model("Message", schema);