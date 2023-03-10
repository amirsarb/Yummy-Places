const Joi = require('joi');
const { number } = require('joi');

module.exports.yummyplaceSchemaJoi = Joi.object({
    yummyplace: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required()
});

module.exports.reviewSchemaJoi = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        text: Joi.string().required()
    }).required()
})
