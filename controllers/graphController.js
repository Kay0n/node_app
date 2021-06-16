const mysql = require("../database.js");
var chart = require('chart.js');
const objArray = ["test","vars", "again"]
var array = JSON.stringify(objArray)



// proccessing of sql request return object
async function query(sql_string){
	const data = await mysql.query(sql_string)
	return data[0]
}


// grabs names from query and returns array of names in id index positon
function valueToArray(db_obj, zeroIndex = true){

	var array = [];
	// adds null as 0 index to align with database values
	if(zeroIndex){array.push(null)}
	
	// loops through object and add nested value to array
	for(let i in db_obj){ 
		array.push(Object.values(db_obj[i])[1]);
	}

	//throw error if empty
	if( array.length < 1){
		throw  new TypeError("TypeError: Database return value is less than 1");
	}
	
	return array
}


module.exports = {
	async display(req,res){
		const sendToView = {};

		/* collects data for dropdowns
		var crashtype = await query("SELECT * FROM crashtype ORDER BY crashtype_id")
		var position = await query("SELECT * FROM position ORDER BY position_id")
		var location = await query("SELECT * FROM location ORDER BY location_id")
		let crashtype_arr = valueToArray(crashtype, false)
		let position_arr = valueToArray(position, false)
		let location_arr = valueToArray(location, false)

		sendToView.crashtype_arr = crashtype_arr;
		sendToView.position_arr = position_arr;
		sendToView.location_arr = location_arr;
		*/

		if (req.body.selectCasualties == "on"){
			
			let cas1 = Object.values((await query("SELECT SUM(casualties) FROM crashes WHERE crashes.year = '2016'"))[0])[0]
			let cas2 = Object.values((await query("SELECT SUM(casualties) FROM crashes WHERE crashes.year = '2017'"))[0])[0]
			let cas3 = Object.values((await query("SELECT SUM(casualties) FROM crashes WHERE crashes.year = '2018'"))[0])[0]
			sendToView.casArray = JSON.stringify([cas1,cas2,cas3])
		} else {sendToView.casArray = "null"}
		
		if (req.body.selectFatalities == "on"){
			let fat1 = Object.values((await query("SELECT SUM(fatalities) FROM crashes WHERE crashes.year = '2016'"))[0])[0]
			let fat2 = Object.values((await query("SELECT SUM(fatalities) FROM crashes WHERE crashes.year = '2017'"))[0])[0]
			let fat3 = Object.values((await query("SELECT SUM(fatalities) FROM crashes WHERE crashes.year = '2018'"))[0])[0]
			sendToView.fatArray = JSON.stringify([fat1,fat2,fat3])
		} else {sendToView.fatArray = "null"}
		
		if (req.body.selectCrashes == "on"){
			let cra1 = Object.values((await query("SELECT COUNT(crash_id) FROM crashes WHERE crashes.year = '2016'"))[0])[0]
			let cra2 = Object.values((await query("SELECT COUNT(crash_id) FROM crashes WHERE crashes.year = '2017'"))[0])[0]
			let cra3 = Object.values((await query("SELECT COUNT(crash_id) FROM crashes WHERE crashes.year = '2018'"))[0])[0]
			sendToView.crashArray = JSON.stringify([cra1,cra2,cra3])
		} else {sendToView.crashArray = "null"}
		
		
		
		
		// render page with dropdown lists
		console.log(sendToView)
		res.render("graph", sendToView);
	}
}

