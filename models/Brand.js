const mongoose = require("mongoose");
const Schema = mongose.Schema;

const BrandSchema = new Schema({
  name: String,
  description: String,
  url: String,
});

// Virtual to get the url for all instruments of a brand
BrandSchema.virtual("url").get(function () {
  return `/catalog/${this._id}`;
});

module.exports = mongoose.model("Brand", BrandSchema);
