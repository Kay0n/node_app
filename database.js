
//init
var mysql = require('mysql');
var multer = require('multer')

//local mysql db connection creds
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'test'
});

// initial connect
connection.connect(err => {

  // error handling
  if (err) throw err;
  console.log("Successfully connected to the database.");
});


// SET STORAGE
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads');
	},
	filename: function (req, file, cb) {
		cb(null, file.fieldname + '-' + Date.now());
	}
})
var upload = multer({ storage: storage })


// export module for app.js
module.exports = upload;
module.exports = connection;