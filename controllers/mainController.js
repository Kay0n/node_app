
// INIT: librarys used
const mysql = require("../database.js");
const { crashSchema } = require("../validation/validator.js")
var csv = require("csvtojson");


// proccessing of sql request return object
async function query(sql_string){
    const data = await mysql.query(sql_string)
    return data[0]
}


// converts checkbox value to bool
function checkConvert(val){
    return (val == "on")
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


// main route controllers
module.exports = {

    async list(req,res){
        console.log("fetching data");
        // SQL query and error handling
        try {
            var data = await query("SELECT * FROM crashes INNER JOIN position ON crashes.position_id = position.position_id INNER JOIN location ON crashes.location_id = location.location_id INNER JOIN crashtype ON crashes.crashtype_id = crashtype.crashtype_id ORDER BY crash_id;")
            console.log("query returned")
        } catch (e){
            console.log(e)
        }
        
        var table = [];
        // check if data exists
        if (data.length > 0) {

            // loop through array and set variables
            for (var i=0;i<data.length;i++) {

                // push to array and send to view
                table.push({
                    crash_id: data[i].crash_id,
                    position: data[i].position_name,
                    location: data[i].location_name,
                    crashtype: data[i].crashtype_name,
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

        // if no data, send response
        } else { 
            console.log("no values found");
            res.render("index", { table: table }); 
            query("ALTER TABLE crashes AUTO_INCREMENT = 1;");
            return;  
        }
    },

    // input GET callback
    async getInput(req,res){

        // fetch data from db and convert to arrays
        var crashtype = await query("SELECT * FROM crashtype ORDER BY crashtype_id")
        var position = await query("SELECT * FROM position ORDER BY position_id")
        var location = await query("SELECT * FROM location ORDER BY location_id")
        let crashtype_arr = valueToArray(crashtype, false)
        let position_arr = valueToArray(position, false)
        let location_arr = valueToArray(location, false)

        // render page with dropdown lists and invalid input responses
        if(req.query.invalid){console.log(req.query.invalid)}
        res.render("input", {
            invalid: req.query.invalid,
            crashtype_arr:crashtype_arr,
            position_arr:position_arr,
            location_arr:location_arr
        });
    },

    // input POST callback
    async postInput(req,res){

        // convert checkboxes to bools
        req.body.dui_bool = checkConvert(req.body.dui_bool)
        req.body.drugs_bool = checkConvert(req.body.drugs_bool)
        req.body.day_bool = checkConvert(req.body.day_bool)

        // validate data and return client errors if false
        try{
            const validationResult = await crashSchema.validate(req.body)
            console.log(validationResult)
        } catch (error){
            console.log(error)
            res.redirect("/input?invalid=" + error.params.path);
            console.log(req.body)
            res.end();
            return;
        }
        

        // insert data if validation succeded
        const valArray = [
            req.body.position,
            req.body.location, 
            req.body.crashtype,
            req.body.year, 
            req.body.casualties, 
            req.body.fatalities,
            req.body.dui_bool,
            req.body.drugs_bool,
            req.body.day_bool
            ];
        await mysql.query("INSERT INTO crashes VALUES (NULL,"+ valArray.join() +")");
        res.redirect("/list");
    },

    // upload GET callback; renders file with possible errors
    getUpload(req,res){
        if(req.query.error){
            res.render("upload",{error:req.query.error})
        } else {
            res.render("upload")
        }
    },

    // upload POST callback
    async postUpload(req,res){
        

        
        let csvObj

         // error handling for invalid filetype, convert csv to string
        try{
            let csvString = req.file["buffer"].toString()
            csvObj = await csv().fromString(csvString)
        } catch (e){
            console.log("CSV upload failed")
            res.redirect("/upload?error=true")
            return;
        }

        //  fetch forigen key values

        const crashtype = await query("SELECT * FROM crashtype ORDER BY crashtype_id")
        const position = await query("SELECT * FROM position ORDER BY position_id")
        const location = await query("SELECT * FROM location ORDER BY location_id")
        const location_obj = {};
        const position_obj = {};
        const crashtype_obj = {};

        // assign value to key object
        location.forEach((obj)=>{
            location_obj[obj.location_name] = obj.location_id
        })
        position.forEach((obj)=>{
            position_obj[obj.position_name] = obj.position_id
        })
        crashtype.forEach((obj)=>{
            crashtype_obj[obj.crashtype_name] = obj.crashtype_id
        })

        // init vars and begin sql transaction
        let validationResult = true;
        await mysql.query("BEGIN")
    
        // loop through each row in csv
        for (const obj of csvObj) {
            const valObj = {
                position: position_obj[obj.position_id],
                location: location_obj[obj.location_id],
                crashtype: crashtype_obj[obj.crashtype_id],
                year: obj.year,
                casualties: obj.casualties,
                fatalities: obj.fatalities,
                dui_bool: obj.dui_bool,
                drugs_bool: obj.drugs_bool,
                day_bool: obj.day_bool
            };

            // validate row
            try{
                await crashSchema.validate(valObj)
            } catch(e){ // break loop if vallidation failed
                console.log("breaking")
                validationResult = false
                break;
            }

            // create array out of row object and insert into database
            var valArray = Object.keys(valObj).map(function (key) { return valObj[key]; });
            try{
                await mysql.query("INSERT INTO crashes VALUES (NULL," + valArray.join() + ")");
            } catch (e){
            }
        }

        // if all validation passed, finalize sql commit and send client to /list page
        if(validationResult){
            await mysql.query("COMMIT")
            console.log("CSV Upload completed")
            res.redirect("/list")
            return;
        } else { // if validation failed, rollback sql and send error to client
            mysql.query("ROLLBACK")
            console.log("CSV upload failed")
            res.redirect("/upload?error=true")
            return;
        }
    },

    // delete POST callback (can't use DELETE method because express doesnt support request bodies)
    async deleteRow(req,res){

        // delete row in db based of crash_id, and reload page
        await mysql.query("DELETE FROM crashes WHERE crash_id='"+ req.body.delete_row+"'");
        res.redirect("/list")
    }

};


