const yup = require('yup')

// defines schema for data validation and sanitisation
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


module.exports = { crashSchema };

