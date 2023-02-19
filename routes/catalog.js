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
  "/instruments/:id/delete",
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

router.get("/instrument/:id", instrumentController.instrument_detail);

// List all
router.get("/instruments", instrumentController.instrument_list);

// Brands
router.get("/brand/create", brandController.brand_create_get);
router.post("/brand/create", brandController.brand_create_post);
router.get("/brand/:id/delete", brandController.brand_delete_get);
router.post("/brand/:id/delete", brandController.brand_delete_post);
router.get("/brand/:id/update", brandController.brand_update_get);
router.post("/brand/:id/update", brandController.brand_update_post);
router.get("/brand/:id", brandController.brand_detail);
// List all
router.get("/brands", brandController.brand_list);

// types
router.get("/type/create", typeController.type_create_get);
router.post("/type/create", typeController.type_create_post);
router.get("/type/:id/delete", typeController.type_delete_get);
router.post("/type/:id/delete", typeController.type_delete_post);
router.get("/type/:id/update", typeController.type_update_get);
router.post("/type/:id/update", typeController.type_update_post);
router.get("/type/:id", typeController.type_detail);
// List all
router.get("/types", typeController.type_list);

module.exports = router;
