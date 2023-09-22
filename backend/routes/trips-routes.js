const express = require("express");

const { check } = require("express-validator");

const tripisController = require("../controller/trips-controller");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();
router.get("/user/:creatorid", tripisController.gettripbyuserid);

const fileUpload = require("../middleware/file-upload");

router.get("/:tripid/:day/:memoid", tripisController.getmemobymemoid);

router.get("/:tripid/:day", tripisController.getmemobyday);

router.get("/:tripid", tripisController.gettripbytripid);

router.get("/", tripisController.gettrip);

router.post(
  "/search",
  [check("keyword").not().isEmpty()],
  tripisController.searchtrip
);

router.use(checkAuth);

router.post(
  "/:tripid/:day",
  fileUpload.single("img"),
  [check("location").not().isEmpty(), check("description").not().isEmpty()],
  tripisController.createMemo
);

router.post(
  "/",
  fileUpload.single("image"),
  [check("title").not().isEmpty()],
  tripisController.createTrip
);

router.post("/:tripid", tripisController.createDay);

router.patch(
  "/:tripid",
  fileUpload.single("image"),
  [check("title").not().isEmpty()],
  tripisController.updateTripbyid
);

router.patch(
  "/:tripid/:day/:memoid",
  fileUpload.single("img"),
  [check("description").not().isEmpty(), check("location").not().isEmpty()],
  tripisController.updateMemo
);

router.delete("/:tripid", tripisController.deleteTripbyid);

router.delete("/:tripid/:day", tripisController.deleteDay);

router.delete("/:tripid/:day/:memoid", tripisController.deleteMemo);

module.exports = router;
