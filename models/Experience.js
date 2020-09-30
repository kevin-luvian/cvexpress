const mongoose = require("mongoose");

const schema = mongoose.Schema({
    title: { type: String },
    category: { type: String },
    percentage: { type: Number }
});

module.exports = mongoose.model("Experience", schema);