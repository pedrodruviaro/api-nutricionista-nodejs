const Joi = require("joi");

class PatientValidation {
    newPatient(data) {
        const schema = Joi.object({
            name: Joi.string().min(6).max(100).required(),
            weight: Joi.number().max(500).required(),
            heigth: Joi.number().max(500).required(),
            age: Joi.number().min(0).max(150),
            email: Joi.string().email().max(150),
        });

        return schema.validate(data);
    }
}

module.exports = new PatientValidation();
