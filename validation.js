//VALIDATION
const Joi = require('joi');
const { valid } = require('joi');



const loginValidation = (body) => {
    const schema = Joi.object({
        email: Joi.string().min(3).required().email(),
        password: Joi.string().min(6).required()
    });
    return validate(body, schema);
}

const registerValidation = (body) => {
    const schema = Joi.object({
        name: Joi.string().min(2).required(),
        email: Joi.string().min(3).required().email(),
        password: Joi.string().min(6).required()
    });
    return validate(body, schema);
}


const validate = (data, schema) => {
    const { error } = schema.validate(data);
    if(error) return error.details[0].message;

    return null;
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
