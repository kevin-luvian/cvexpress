const mongoose = require("mongoose");

const schema = mongoose.Schema({
    displays: [{ type: mongoose.Schema.Types.ObjectId, ref: "FileMetadata" }],
    title: { type: String },
    description: { type: String },
    order: { type: Number },
    show: { type: Boolean },
    main: { type: Boolean },
    sections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Directory" }]
});

module.exports = mongoose.model("Directory", schema);