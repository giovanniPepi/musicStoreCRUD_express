const Brand = require("../models/Brand");
const Instrument = require("../models/Instrument");
const Type = require("../models/Type");
const async = require("async");
const { body, validationResult } = require("express-validator");

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

exports.brand_create_get = (req, res, next) => {
  // Gets all brands from db
  async.parallel(
    {
      brands(callback) {
        Brand.find(callback);
      },
    },
    (err, results) => {
      if (err) return next(err);
      res.render("brand_form", {
        title: "Create a new Brand",
        brands: results.brands,
      });
    }
  );
};

exports.brand_create_post = [
  // Validation
  body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    // New brand Obj
    const brand = new Brand({
      name: req.body.name,
      description: req.body.description,
    });

    // Error route, get info again from db and show errors to user
    if (!errors.isEmpty()) {
      async.parallel(
        {
          brands(callback) {
            Brand.find(callback);
          },
        },
        (err, results) => {
          if (err) return next(err);
          res.render("brand_form", {
            title: "Create a new Brand",
            brands: results.brands,
            brand,
            errors: errors.array(),
          });
        }
      );
      return;
    }

    // We check if the name already exists in the DB before saving it
    const existsInDb = async.parallel(
      {
        brands(callback) {
          Brand.find(callback);
        },
        brand(callback) {
          Brand.find({ name: req.body.name }).populate("name").exec(callback);
        },
      },
      (err, results) => {
        if (err) return next(err);
        // Query array has returned something from the db, therefore there is
        // already a brand with this name
        if (results.brand.length > 0) {
          res.render("brand_form", {
            title: "Create a new Brand",
            brands: results.brands,
            name: results.brand.name,
            description: results.brand.description,
            errors: [{ msg: "There is already a brand with this name" }],
          });
        } else {
          // Data from form is valid, save brand to DB
          brand.save((err) => {
            if (err) return next(err);
            // Succesful, redirect to new instrument
            res.redirect(brand.url);
          });
        }
      }
    );
  },
];

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
