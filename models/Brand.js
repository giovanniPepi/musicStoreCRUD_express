const mongoose = require("mongoose");
const Schema = mongose.Schema;

const BrandSchema = new Schema({
  name: String,
  types: { type: Schema.Types.ObjectId, ref: "Type", required: true },
  instruments: {
    type: Schema.Types.ObjectId,
    ref: "Instrument",
    required: true,
  },
  url: String,
});

// Virtual to get the url for all instruments of a brand
BrandSchema.virtual("url").get(function () {
  return `/catalog/${this._id}`;
});

module.exports = mongoose.model("Brand", BrandSchema);
