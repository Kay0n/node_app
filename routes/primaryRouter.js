// INIT: libraries
const express = require("express");
const router = express.Router();
const controller = require("../controllers/mainController");
const multer = require("multer")
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });



// Home route
router.get("/", (req, res) => {
  res.redirect("/list");
});


// routes with middleware callbacks
router.get("/list", controller.list);

router.get("/input", controller.getInput);
router.post("/input",controller.postInput);

router.get("/upload",controller.getUpload);
router.post("/upload",upload.single('csv'),controller.postUpload);

router.post("/delete",controller.deleteRow);


//export module
module.exports = router;
