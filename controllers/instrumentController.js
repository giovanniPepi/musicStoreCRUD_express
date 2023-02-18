const Instrument = require("../models/Instrument");
const Brand = require("../models/Brand");
const Type = require("../models/Type");
const async = require("async");
const { body, validationResult } = require("express-validator");

exports.index = (req, res, next) => {
  async.parallel(
    {
      instrument_count(callback) {
        // Empty obj = match all, return count of everything in the db
        Instrument.countDocuments({}, callback);
      },
      brand_count(callback) {
        Brand.countDocuments({}, callback);
      },
      type_count(callback) {
        Type.countDocuments({}, callback);
      },
    },
    (err, results) => {
      res.render("index", {
        title: "Music Store CRUD!",
        error: err,
        data: results,
      });
    }
  );
};

exports.instrument_detail = (req, res, next) => {};

exports.instrument_create_get = (req, res, next) => {};

exports.instrument_create_post = (req, res, next) => {};

exports.instrument_delete_get = (req, res, next) => {};

exports.instrument_delete_post = (req, res, next) => {};

exports.instrument_update_get = (req, res, next) => {};

exports.instrument_update_post = (req, res, next) => {};

exports.instrument_list = (req, res, next) => {
  // The request includes all the info we want to acess
  // and is passed down to the pug view render
  Instrument.find(
    {},
    "name description imageURL brand type numberInStock price"
  )
    .sort({ title: 1 })
    .populate("name")
    .exec(function (err, list_instruments) {
      if (err) {
        return next(err);
      }
      res.render("instrument_list", {
        title: "Instrument List",
        instrument_list: list_instruments,
      });
    });
};
