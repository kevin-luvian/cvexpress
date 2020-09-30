const mongoose = require("mongoose");

const schema = mongoose.Schema({
    type: { type: String },
    icon: { type: String },
    title: { type: String },
    description: { type: String }
});

module.exports = mongoose.model("QuickInfo", schema);