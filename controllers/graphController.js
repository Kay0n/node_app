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
function valueToArray(db_obj){

	var array = [];
	array.push("All")
	
	// loops through object and add nested value to array
	for(let i in db_obj){ 
		array.push(Object.values(db_obj[i])[1]);
	}

	return array
}

let lgaArray = []
module.exports = {
	async display(req,res){
		const sendToView = {};

		//collects data for dropdowns
		var crashtype = await query("SELECT * FROM crashtype ORDER BY crashtype_id")
		var position = await query("SELECT * FROM position ORDER BY position_id")
		var location = await query("SELECT * FROM location ORDER BY location_id")
		sendToView.crashtype_arr = valueToArray(crashtype)
		sendToView.position_arr = valueToArray(position)
		sendToView.location_arr = valueToArray(location)
		sendToView.location_arr2 = JSON.stringify(valueToArray(location))
		
		
		let sqlPos = "";
		let sqlCT = "";
		console.log(req.body)
		if (req.body.position != 0 && req.body.position != undefined){
			sqlPos = " AND crashes.position_id = " + req.body.position
		}
		if (req.body.crashtype != 0 && req.body.crashtype != undefined){
			sqlCT = " AND crashes.crashtype_id = " + req.body.crashtype
			console.log(sqlCT)
		} 

		if (req.body.selectCasualties == "on"){
			sqlCasualties = "SELECT SUM(casualties) FROM crashes WHERE crashes.year = "
			let cas1 = Object.values((await query(sqlCasualties + "2016" + sqlCT + sqlPos))[0])[0]
			let cas2 = Object.values((await query(sqlCasualties + "2017" + sqlCT + sqlPos))[0])[0]
			let cas3 = Object.values((await query(sqlCasualties + "2018" + sqlCT + sqlPos))[0])[0]
			sendToView.casArray = JSON.stringify([cas1,cas2,cas3])
		} else {sendToView.casArray = "null"}
		
		if (req.body.selectFatalities == "on"){
			sqlFatalities = "SELECT SUM(fatalities) FROM crashes WHERE crashes.year = "
			
			let fat1 = Object.values((await query(sqlFatalities + "2016" + sqlCT + sqlPos))[0])[0]
			let fat2 = Object.values((await query(sqlFatalities + "2017" + sqlCT + sqlPos))[0])[0]
			let fat3 = Object.values((await query(sqlFatalities + "2018" + sqlCT + sqlPos))[0])[0]
			sendToView.fatArray = JSON.stringify([fat1,fat2,fat3])
		} else {sendToView.fatArray = "null"}
		
		if (req.body.selectCrashes == "on"){
			sqlCrashes = "SELECT COUNT(crash_id) FROM crashes WHERE crashes.year = "
			let cra1 = Object.values((await query(sqlCrashes + "2016" + sqlCT + sqlPos))[0])[0]
			let cra2 = Object.values((await query(sqlCrashes + "2017" + sqlCT + sqlPos))[0])[0]
			let cra3 = Object.values((await query(sqlCrashes + "2018" + sqlCT + sqlPos))[0])[0]
			sendToView.crashArray = JSON.stringify([cra1,cra2,cra3])
		} else {sendToView.crashArray = "null"}
		
		if (!req.body.graphType){
			sendToView.graphType = "bar"
		} else {
			sendToView.graphType = req.body.graphType
		}

		if (req.body.LGA != 0 && req.body.LGA != undefined){
			let lgaCas = Object.values((await query("SELECT SUM(casualties) FROM crashes INNER JOIN location ON crashes.location_id = location.location_id WHERE location_name = '" + req.body.LGA + "'"))[0])[0]
			let lgaFat = Object.values((await query("SELECT SUM(fatalities) FROM crashes INNER JOIN location ON crashes.location_id = location.location_id WHERE location_name = '" + req.body.LGA + "'"))[0])[0]
			let lgaCra = Object.values((await query("SELECT COUNT(crash_id) FROM crashes INNER JOIN location ON crashes.location_id = location.location_id WHERE location_name = '" + req.body.LGA + "'"))[0])[0]
			let lgaIndex =  Object.values((await query("SELECT location_id FROM location WHERE location_name = '" + req.body.LGA + "'"))[0])[0]
			lgaArray.push([lgaIndex, lgaCas,lgaFat,lgaCra])
			sendToView.lgaArray = JSON.stringify(lgaArray)
		} else {sendToView.lgaArray = "[]"}
		
		if (req.body.reset == "Reset"){
			lgaArray = []
			sendToView.lgaArray = "[]"
		}
		if (req.body.mode == "secondary"){sendToView.mode = "secondary"}
		// render page with dropdown lists
		res.render("graph", sendToView);
	}
}

