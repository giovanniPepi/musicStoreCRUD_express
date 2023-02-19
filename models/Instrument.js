const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InstrumentSchema = new Schema({
  name: { type: String, required: true },
  // We stabilish a relationship with the instrument Brand schema:
  brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
  type: { type: Schema.Types.ObjectId, ref: "Type", required: true },
  // We set a minimum and maxium (arbirtrary) price
  price: { type: Number, min: 1, max: 999999, required: true },
  // Number of instances of this item in stock
  numberInStock: { type: Number, min: 0, max: 999999, required: true },
  description: { type: String, required: true },
  imageURL: { type: String, required: true },
});

// Virtual used to get the url from the instruments _id in the database:
InstrumentSchema.virtual("url").get(function () {
  return `/catalog/instrument/${this._id}`;
});

// Export
module.exports = mongoose.model("Instrument", InstrumentSchema);
