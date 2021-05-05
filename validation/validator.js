const yup = require('yup')

// defines all schemas for input validation and sanitisation
const crashSchema = yup.object({
    year: yup.number().integer().min(0).max(9999).required(),
    casualties: yup.number().integer().min(0).max(999).required(),
    fatalities: yup.number().integer().min(0).max(999).required(),
    
    location: yup.number().required(),
    position: yup.number().required(),
    crashtype: yup.number().required(),
    dui_bool: yup.bool().required(),
    drugs_bool: yup.bool().required(),
    day_bool: yup.bool().required()
    
}); 

/*
async function validator(req,res,next){ 
    console.log(req.body)
    const valid = await schema.validateAsync(req.body);
    if (valid) { 
        console.log(valid)
        console.log("success")
        next(); 
    } else { 
        console.log(valid)
        console.log("fail")
    }
};
*/

module.exports = { crashSchema };

