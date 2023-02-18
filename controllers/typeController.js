const Type = require("../models/Type");
const async = require("async");

exports.type_detail = (req, res, next) => {};

exports.type_create_get = (req, res, next) => {};

exports.type_create_post = (req, res, next) => {};

exports.type_delete_get = (req, res, next) => {};

exports.type_delete_post = (req, res, next) => {};

exports.type_update_get = (req, res, next) => {};

exports.type_update_post = (req, res, next) => {};

exports.type_list = (req, res, next) => {
  // The request includes all the info we want to acess
  // and is passed down to the pug view render
  Type.find({}, "name description")
    .sort({ title: 1 })
    .populate("name")
    .exec(function (err, list_types) {
      if (err) {
        return next(err);
      }
      res.render("type_list", {
        title: "Instrument Types",
        type_list: list_types,
      });
    });
};
