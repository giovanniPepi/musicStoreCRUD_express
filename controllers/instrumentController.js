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

exports.instrument_list = (req, res, next) => {};

exports.instrument_detail = (req, res, next) => {};

exports.instrument_create_get = (req, res, next) => {};

exports.instrument_create_post = (req, res, next) => {};

exports.instrument_delete_get = (req, res, next) => {};

exports.instrument_delete_post = (req, res, next) => {};

exports.instrument_update_get = (req, res, next) => {};

exports.instrument_update_post = (req, res, next) => {};

exports.instrument_list = (req, res, next) => {};
