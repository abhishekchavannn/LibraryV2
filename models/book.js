const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  edition: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Subject",
  },
  copyCount: {
    type: Number,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Author",
  },
});



module.exports = mongoose.model("Book", bookSchema);
