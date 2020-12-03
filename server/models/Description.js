const mongoose = require("mongoose");

const schema = mongoose.Schema({
    quickDescription: { type: String },
    professions: [{ type: String }],
    imageID: { type: mongoose.Schema.Types.ObjectId, ref: "FileMetadata" },
    cvID: { type: mongoose.Schema.Types.ObjectId, ref: "FileMetadata" }
});

module.exports = mongoose.model("Description", schema);