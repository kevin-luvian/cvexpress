const mongoose = require("mongoose");

const schema = mongoose.Schema({
    fullname: { type: String },
    email: { type: String },
    address: { type: String }
});

module.exports = mongoose.model("MyInfo", schema);