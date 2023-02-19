const Type = require("../models/Type");
const async = require("async");
const Instrument = require("../models/Instrument");

exports.type_detail = (req, res, next) => {
  async.parallel(
    {
      type(callback) {
        // use the id encoded by the url
        Type.findById(req.params.id).populate("name").exec(callback);
      },
      // find all the instruments that have the same type
      instruments_with_this_type(callback) {
        Instrument.find({ type: req.params.id })
          .populate("name")
          .exec(callback);
      },
    },
    (err, results) => {
      if (err) return next(err);
      if (results.type == null) {
        err.status = 404;
        return next(err);
      }
      res.render("type_detail", {
        title: results.type.name,
        description: results.type.description,
        instrumentList: results.instruments_with_this_type,
        titleLowerCase: results.type.name.toLowerCase(),
      });
    }
  );
};

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
