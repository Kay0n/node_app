// Init
var express = require("express");
var router = express.Router();
var controller = require("../controllers/mainController");




// Home route
router.get("/", (req, res) => {
  res.send("Landing page. Nothing to see here...");
});

router.get("/list", controller.list);

router.get("/input", controller.getInput);
router.post("/input",controller.postInput);

router.get("/upload",controller.getUpload);
router.post("/upload",controller.postUpload);

/*


// Form data proccessing route
router.post("/form", function (req, res) {
  console.log("proccessing form data");

  // insert POST data into "students" table, redirect to root
  var valArray = [req.body.first_name, req.body.last_name, req.body.gender];
  sql.query(
    "INSERT INTO students VALUES (NULL,?,?,?)",
    valArray,
    (err, data) => {
      if (err) {
        console.log("error: ", err);
        throw err;
      }
    }
  );
  console.log("data inserted");
  res.redirect("/students/list");
});
*/
// export module to app.js
module.exports = router;
