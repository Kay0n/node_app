
//init
const mysql = require('mysql2/promise');


//local mysql db connection creds
const connection = mysql.createPool({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'crash_data'
});



// initial connect
/*
connection.connect(function(err,connection){

  // error handling and feedback
  if (err) throw err;
  console.log("Successfully connected to the database.");
});
*/

module.exports = connection;
