const Brand = require("../models/Brand");
const async = require("async");

exports.brand_detail = (req, res, next) => {};

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
