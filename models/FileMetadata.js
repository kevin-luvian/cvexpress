const mongoose = require("mongoose");

const schema = mongoose.Schema({
    group: { type: String },
    originalName: { type: String },
    contentType: { type: String },
    size: { type: Number },
});

module.exports = mongoose.model("FileMetadata", schema);