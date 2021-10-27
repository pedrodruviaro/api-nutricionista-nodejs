const Joi = require("joi");

class AuthValidation {
    register(data) {
        const schema = Joi.object({
            name: Joi.string().required().min(6).max(100),
            email: Joi.string().required().min(6).max(150).email(),
            password: Joi.string().required().min(6).max(72),
        });

        return schema.validate(data);
    }

    login(data) {
        const schema = Joi.object({
            email: Joi.string().required().min(6).max(150).email(),
            password: Joi.string().required().min(6).max(72),
        });

        return schema.validate(data);
    }
}

module.exports = new AuthValidation();
