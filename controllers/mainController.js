
const database = require("../database.js");
var express = require('express')
var mysql = require("../database.js");

// proccessing of sql request
async function query(sql_string){
    var data = await mysql.query(sql_string)
    return data[0]
}


// grabs names from query and returns array of names in id index positon
function nameArray(db_obj, zeroIndex = true){

    var array = []
    // adds null as 0 index to align with database values
    if(zeroIndex){array.push(null)}
    
    for(i in db_obj){ //TODO: check for..in statment for correct output order
        array.push(Object.values(db_obj[i])[1])
    }
    //throw error if empty
    if( array.length < 1){
        throw "TypeError: Database return value is less than 1"
    }
    return array
}


// main route controllers
module.exports = {
    async list(req,res){
        console.log("fetching data");
        // SQL querys
        try {
            var data = await query("SELECT * FROM crashes")
            var position = await query("SELECT * FROM position")
            var location = await query("SELECT * FROM location")
            var crashtype = await query("SELECT * FROM crashtype")
            console.log("query returned")
        } catch (e){
            console.log(e)
        }

        // get names into array from tables
        pos_arr = nameArray(position)
        loc_arr = nameArray(location)   
        crashtype_arr = nameArray(crashtype)
        
        
        var table = [];
        // check if data exists
        if (data.length > 0) {
            // loop through array and set variables
            
            for (var i=0;i<data.length;i++) {
                // push to array and send to view
                table.push({
                    crash_id: data[i].crash_id,
                    //position_id: pos_arr[data[i].position_id],
                    //location_id: loc_arr[data[i].location_id],
                    crashtype_id: crashtype_arr[data[i].crashtype_id],
                    casualties: data[i].casualties,
                    fatalities: data[i].fatalities,
                    dui_bool: !!data[i].dui_bool,
                    drugs_bool: !!data[i].drugs_bool,
                    day_bool: !!data[i].day_bool
                });
            }
            console.log("data fetched, sending view...");
            // render view index.pug
            res.render("index", { table: table });

        } else { // if no data, send response
            res.send("no values found");  
            console.log("no values found");
        }
        
        
    },
    async input(req,res){
        var crashtype = await query("SELECT * FROM crashtype")
        crashtype_arr = nameArray(crashtype, false)
        res.render("input", {
            crashtype_arr:crashtype_arr,
        });


    },
    upload(req,res){

    }
};




