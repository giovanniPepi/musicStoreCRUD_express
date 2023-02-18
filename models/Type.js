const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// TypeSchema refers to types of instruments in store
const TypeSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

// Virtual to get all instruments from this type
TypeSchema.virtual("url").get(function () {
  return `/catalog/${this._id}`;
});

module.exports = mongoose.model("Type", TypeSchema);
