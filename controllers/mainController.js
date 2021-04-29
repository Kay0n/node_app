
const database = require("../database.js");
var express = require('express')
var mysql = require("../database.js");

// reveals 
async function queryg(sql_string){
    var data = await mysql.query(sql_string)
    return data[0]
}

module.exports = {
    async list(req,res){
        var people = [];
        console.log("fetching data");


        // Error handling
        try {
            var data = await queryg("SELECT * FROM crashes")
            console.log("query returned")
        } catch (e){
            console.error(e)
        }

              
        console.log("result:" + data.length)
        res.redirect("/")
        /*
        // check if data exists
        if (data.length > 0) {
            // loop through array and set variables
            for (var i = 0; i < data.length; i++) {
                // push to array and send to view
                people.push({
                    first_name: data[i].first_name,
                    last_name: data[i].last_name,
                    gender: data[i].gender,
                });
            }
            console.log("data fetched, sending view...");
            res.render("index", { people: people });
        } else { // if no data, send response
                res.send("no values found");  
                console.log("no values found");
        }
        */
    },
    input(req,res){


    },
    upload(req,res){

    }
};




