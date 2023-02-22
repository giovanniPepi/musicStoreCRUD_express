const Type = require("../models/Type");
const async = require("async");
const Instrument = require("../models/Instrument");
const { body, validationResult } = require("express-validator");

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

exports.type_create_get = (req, res, next) => {
  // Gets all types from db
  async.parallel(
    {
      types(callback) {
        Type.find(callback);
      },
    },
    (err, results) => {
      if (err) return next(err);
      res.render("type_form", {
        title: "Create a new Instrument Type",
        types: results.types,
      });
    }
  );
};

exports.type_create_post = [
  // Validation
  body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    // New type Obj
    const type = new Type({
      name: req.body.name,
      description: req.body.description,
    });

    // Error route, get info again from db and show errors to user
    if (!errors.isEmpty()) {
      async.parallel(
        {
          types(callback) {
            Type.find(callback);
          },
        },
        (err, results) => {
          if (err) return next(err);
          res.render("type_form", {
            title: "Create a new Instrument Type",
            types: results.types,
            type,
            errors: errors.array(),
          });
        }
      );
      return;
    }

    // We check if the name already exists in the DB before saving it
    const existsInDb = async.parallel(
      {
        types(callback) {
          Type.find(callback);
        },
        type(callback) {
          Type.find({ name: req.body.name }).populate("name").exec(callback);
        },
      },
      (err, results) => {
        if (err) return next(err);
        // Query array has returned something from the db, therefore there is
        // already a type with this name
        if (results.type.length > 0) {
          res.render("type_form", {
            title: "Create a new Instrument Type",
            types: results.types,
            name: results.type.name,
            description: results.type.description,
            errors: [{ msg: "There is already a type with this name" }],
          });
        } else {
          // Data from form is valid, save type to DB
          type.save((err) => {
            if (err) return next(err);
            // Succesful, redirect to new instrument
            res.redirect(type.url);
          });
        }
      }
    );
  },
];

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
