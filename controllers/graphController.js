const mysql = require("../database.js");
var thart = require('chart.js');




module.exports = {
    async display(req,res){
        //let pageData = {}
        //pageData.title = "Test"
        //pageData.chartRenderer = test;
        res.render("graph")
    },
    test(){
        console.log("aaaaaa")
    }
}



