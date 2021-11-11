const mongoose = require("mongoose");
const Book = require("./book");

const subSchema = new mongoose.Schema({
  subjectName: {
    type: String,
    required: true,
  },
});

subSchema.pre("remove", function (next) {
  Book.find({ subject: this.id }, (err, books) => {
    if (err) {
      next(err);
    } else if (books.length > 0) {
      next(new Error("ERROR: You cannot remove this subject. (Tip: Remove books under this subject)"));
    } else {
      next();
    }
  });
});

module.exports = mongoose.model("Subject", subSchema);
