const mongoose = require("mongoose");

const schema = mongoose.Schema({
    title: { type: String },
    type: { type: String },
    period: { type: String },
    snippet: { type: String },
    description: { type: String }
});

module.exports = mongoose.model("Resume", schema);