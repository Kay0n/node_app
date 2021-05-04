const Joi = require('joi') 

// defines all schemas for input validation and sanitisation
const crashSchema = Joi.object({
    year: Joi.number().integer().min(0).max(9999).required(),
    casualties: Joi.number().integer().min(0).max(999).required(),
    fatalities: Joi.number().integer().min(0).max(999).required(),
    location: Joi.required(),
    position: Joi.required(),
    crashtype: Joi.required(),
    dui_bool: Joi.required(),
    drugs_bool: Joi.required(),
    day_bool: Joi.required()
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

