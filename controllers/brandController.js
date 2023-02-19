const Brand = require("../models/Brand");
const Instrument = require("../models/Instrument");
const Type = require("../models/Type");
const async = require("async");

exports.brand_detail = (req, res, next) => {
  async.parallel(
    {
      brand(callback) {
        // use the id encoded by the url
        Brand.findById(req.params.id).populate("name").exec(callback);
      },
      // get all instruments associated with this brand
      brand_instruments(callback) {
        Instrument.find({ brand: req.params.id }, "name description type").exec(
          callback
        );
      },
    },
    (err, results) => {
      if (err) return next(err);
      if (results.brand == null) {
        err.status = 404;
        return next(err);
      }
      res.render("brand_detail", {
        title: results.brand.name,
        brand: results.brand,
        instruments: results.brand_instruments,
      });
    }
  );
};

exports.brand_create_get = (req, res, next) => {};

exports.brand_create_post = (req, res, next) => {};

exports.brand_delete_get = (req, res, next) => {};

exports.brand_delete_post = (req, res, next) => {};

exports.brand_update_get = (req, res, next) => {};

exports.brand_update_post = (req, res, next) => {};

exports.brand_list = (req, res, next) => {
  // The request includes all the info we want to acess
  // and is passed down to the pug view render
  Brand.find({}, "name description")
    .sort({ title: 1 })
    .populate("name")
    .exec(function (err, list_brands) {
      if (err) {
        return next(err);
      }
      res.render("brand_list", {
        title: "Brands",
        brand_list: list_brands,
      });
    });
};
