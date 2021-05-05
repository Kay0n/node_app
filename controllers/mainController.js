
const mysql = require("../database.js");
const { crashSchema } = require("../validation/validator.js")
var csv = require("csvtojson")


// proccessing of sql request return object
async function query(sql_string){
    const data = await mysql.query(sql_string)
    return data[0]
}

// converts checkbox value to bool
function checkConvert(val){
    if(val == "on"){
        return true
    } else {
        return false
    }
}

// returns key given value
function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
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
        throw  new TypeError("TypeError: Database return value is less than 1");
    }
    return array
}


// main route controllers
module.exports = {

    async list(req,res){
        console.log("fetching data");
        // SQL querys
        try {
            var data = await query("SELECT * FROM crashes ORDER BY crash_id")
            var position = await query("SELECT * FROM position ORDER BY position_id")
            var location = await query("SELECT * FROM location ORDER BY location_id")
            var crashtype = await query("SELECT * FROM crashtype ORDER BY crashtype_id")
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
                    position: pos_arr[data[i].position_id],
                    location: loc_arr[data[i].location_id],
                    crashtype: crashtype_arr[data[i].crashtype_id],
                    casualties: data[i].casualties,
                    fatalities: data[i].fatalities,
                    year: data[i].year,
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

    async getInput(req,res){
        var crashtype = await query("SELECT * FROM crashtype ORDER BY crashtype_id")
        var position = await query("SELECT * FROM position ORDER BY position_id")
        var location = await query("SELECT * FROM location ORDER BY location_id")
        crashtype_arr = nameArray(crashtype, false)
        position_arr = nameArray(position, false)
        location_arr = nameArray(location, false)
        if(req.query.invalid){console.log(req.query.invalid)}
        res.render("input", {
            invalid: req.query.invalid,
            crashtype_arr:crashtype_arr,
            position_arr:position_arr,
            location_arr:location_arr
        });
    },

    async postInput(req,res){

        try{
            const validationResult = await crashSchema.validate(req.body)
            console.log(validationResult)
        } catch (error){
            res.redirect("/input?invalid=" + error.params.path)
            res.end()
        }
        


        const valArray = [
            req.body.position,
            req.body.location, 
            req.body.crashtype,
            req.body.year, 
            req.body.casualties, 
            req.body.fatalities,
            checkConvert(req.body.dui_bool),
            checkConvert(req.body.drugs_bool),
            checkConvert(req.body.day_bool)
            ];
        await mysql.query("INSERT INTO crashes VALUES (NULL,"+ valArray.join() +")");
        res.redirect("/list");
    },

    getUpload(req,res){
        res.render("upload")
    },

    async postUpload(req,res){
        //console.log(req.file);
        const csvString = req.file["buffer"].toString()
        
        const csvObj = await csv().fromString(csvString)
        //console.log(csvObj)
        res.send(csvObj);
        const crashtype = await query("SELECT * FROM crashtype ORDER BY crashtype_id")
        const position = await query("SELECT * FROM position ORDER BY position_id")
        const location = await query("SELECT * FROM location ORDER BY location_id")
      
        const location_obj = {};
        const position_obj = {};
        const crashtype_obj = {};
        
        location.forEach((obj)=>{
            location_obj[obj.location_name] = obj.location_id
        })
        position.forEach((obj)=>{
            position_obj[obj.position_name] = obj.position_id
        })
        crashtype.forEach((obj)=>{
            crashtype_obj[obj.crashtype_name] = obj.crashtype_id
        })
        
        
        csvObj.forEach(async(obj)=>{
            const valArray = [
                //getKeyByValue(position_obj,obj.position_id),
                position_obj[obj.position_id],
                location_obj[obj.location_id],
                crashtype_obj[obj.crashtype_id],
                obj.year,
                obj.casualties,
                obj.fatalities,
                obj.dui_bool,
                obj.drugs_bool,
                obj.day_bool                
            ]

            
            console.log(valArray)
            try{
                await mysql.query("INSERT INTO crashes VALUES (NULL,"+ valArray.join() +")");
            } catch (e){
                console.log(e)
            }
            

        })
        
        console.log("completed")
        

        /*
        try{
            const validationResult = await crashSchema.validate(req.body)
            console.log(validationResult)
        } catch (error){
            res.redirect("/input?invalid=" + error.params.path)
            res.end()
        }
        */



        
        
        console.log("datacheck")
    },

    async deleteRow(req,res){
        await mysql.query("DELETE FROM crashes WHERE crash_id='"+ req.body.delete_row+"'");
        res.redirect("/list")
    }

};




