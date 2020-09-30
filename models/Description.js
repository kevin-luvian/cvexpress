const mongoose = require("mongoose");

const schema = mongoose.Schema({
    quickDescription: { type: String },
    professions: { type: [String] },
    fileID: { type: String }
});

module.exports = mongoose.model("Description", schema);