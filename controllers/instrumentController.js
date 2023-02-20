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
exports.instrument_detail = (req, res, next) => {
  async.parallel(
    {
      instrument(callback) {
        // use the id encoded by the url
        Instrument.findById(req.params.id)
          .populate("name")
          .populate("brand")
          .populate("type")
          .exec(callback);
      },
      brand(callback) {
        Brand.find({ name: req.params.id }).exec(callback);
      },
      type(callback) {
        Type.find({ name: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) return next(err);
      if (results.instrument == null) {
        err.status = 404;
        return next(err);
      }
      res.render("instrument_detail", {
        title: results.instrument.name,
        instrument: results.instrument,
        brand: results.brand,
        type: results.type,
      });
    }
  );
};

// Handles instrument creation via form GET
exports.instrument_create_get = (req, res, next) => {
  // Gets all brands and types to fill the form values
  async.parallel(
    {
      brands(callback) {
        Brand.find(callback);
      },
      types(callback) {
        Type.find(callback);
      },
    },
    (err, results) => {
      if (err) return next(err);
      res.render("instrument_form", {
        title: "Create instrument",
        brands: results.brands,
        types: results.types,
      });
    }
  );
};

// POST route
exports.instrument_create_post = [
  // Validation and sanitization
  body("name", "Name must not be empty").trim().isLength({ min: 1 }).escape(),
  body("price", "Price must not be empty").trim().isLength({ min: 1 }).escape(),
  body("numberInStock", "Number in stock must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Description must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  // Not escaped until we add an uploader
  // THIS IS UNSAFE until then! :)
  body("imageURL", "ImageURL must not be emtpy").trim().isLength({ min: 1 }),

  (req, res, next) => {
    // Extract validation errors from the request:
    const errors = validationResult(req);

    // Create new Instrument obj!
    const instrument = new Instrument({
      name: req.body.name,
      brand: req.body.brand,
      type: req.body.type,
      price: req.body.price,
      numberInStock: req.body.numberInStock,
      description: req.body.description,
      imageURL: req.body.imageURL,
    });

    console.log(instrument);

    if (!errors.isEmpty()) {
      // There are errors, render the form again with sanitized data
      // same function from the GET route:
      async.parallel(
        {
          brands(callback) {
            Brand.find(callback);
          },
          types(callback) {
            Type.find(callback);
          },
        },
        (err, results) => {
          if (err) return next(err);
          res.render("instrument_form", {
            title: "Create instrument",
            brands: results.brands,
            types: results.types,
            instrument, // pass the obj created
            errors: errors.array(),
          });
        }
      );
      return;
    }

    // Data from form is valid, save instrument to DB
    instrument.save((err) => {
      if (err) return next(err);
      // Succesful, redirect to new instrument
      res.redirect(instrument.url);
    });
  },
];

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
    .populate("brand")
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
