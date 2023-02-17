const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InstrumentSchema = new Schema({
  name: String,
  // We stabilish a relationship with the instrument Brand schema:
  brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
  type,
  // We set a minimum and maxium (arbirtrary) price
  price: { type: Number, min: 1, max: 999999, required: true },
  description: String,
  // Number of instances of this item in stock
  numberInStock: { type: Number, min: 0, max: 999999, required: true },
  url: String,
  imageURL: String,
});

// Virtual used to get the url from the instruments _id in the database:
InstrumentSchema.virtual("url").get(function () {
  return `/catalog/instruments/${this._id}`;
});

// Export
module.exports = mongoose.model("Instrument", InstrumentSchema);
