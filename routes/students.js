// Init
var express = require("express");
var router = express.Router();
var bridge = require("../database.js");
var sql = bridge.sql

// Home route
router.get("/", (req, res) => {
  res.send("Landing page. Nothing to see here...");
});

// List students and present form
router.get("/list", function (req, res) {
  var people = [];
  console.log("fetching data");
  // async sql query to fetch "students" table
  sql.query("SELECT * FROM students", (err, data) => {
    // Error handling
    if (err) {
      console.log("error: ", err);
      throw err;
    }
    // check if data exists
    if (data.length > 0) {
      // loop through array and set variables
      for (var i = 0; i < data.length; i++) {
        temp = {
          first_name: data[i].first_name,
          last_name: data[i].last_name,
          gender: data[i].gender,
        };

        // push to array and send to view
        people.push(temp);
      }
      console.log("data fetched, sending view...");
      res.render("index", { people: people });

      // if no data, send response
    } else {
      res.send("no values found");  
      console.log("no values found");
    }
  });
});



// Form data proccessing route
router.post("/form", function (req, res) {
  console.log("proccessing form data");

  // insert POST data into "students" table, redirect to root
  var valArray = [req.body.first_name, req.body.last_name, req.body.gender];
  sql.query(
    "INSERT INTO students (first_name, last_name, gender) VALUES (?,?,?)",
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

// export module to app.js
module.exports = router;
