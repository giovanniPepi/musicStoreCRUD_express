const express = require("express");
const router = express.Router();

// Import controller modules
const instrumentController = require("../controllers/instrumentController");
const brandController = require("../controllers/brandController");
const typeController = require("../controllers/typeController");

// Instrument routes
// set GET, POST routes for each action

// home page, redirected to catalog
router.get("/", instrumentController.index);
router.get("/instrument/create", instrumentController.instrument_create_get);
router.post("/instrument/create", instrumentController.instrument_create_post);
router.get(
  "/instrument/:id/delete",
  instrumentController.instrument_delete_get
);
router.post(
  "/instrument/:id/delete",
  instrumentController.instrument_delete_post
);
router.get(
  "/instrument/:id/update",
  instrumentController.instrument_update_get
);
router.post(
  "/instrument/:id/update",
  instrumentController.instrument_update_post
);
// List all
router.get("/instruments", instrumentController.instrument_list);

// Brands
router.get("/instrument/create", brandController.instrument_create_get);
router.post("/instrument/create", brandController.instrument_create_post);
router.get("/instrument/:id/delete", brandController.instrument_delete_get);
router.post("/instrument/:id/delete", brandController.instrument_delete_post);
router.get("/instrument/:id/update", brandController.instrument_update_get);
router.post("/instrument/:id/update", brandController.instrument_update_post);
// List all
router.get("/instruments", brandController.instrument_list);

// types
router.get("/instrument/create", typeController.instrument_create_get);
router.post("/instrument/create", typeController.instrument_create_post);
router.get("/instrument/:id/delete", typeController.instrument_delete_get);
router.post("/instrument/:id/delete", typeController.instrument_delete_post);
router.get("/instrument/:id/update", typeController.instrument_update_get);
router.post("/instrument/:id/update", typeController.instrument_update_post);
// List all
router.get("/instruments", typeController.instrument_list);

module.exports = router;
