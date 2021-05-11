
// INIT
const mysql = require('mysql2/promise');


//local mysql db connection credentials
const connection = mysql.createPool({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'crash_data'
});


// export module
module.exports = connection;
