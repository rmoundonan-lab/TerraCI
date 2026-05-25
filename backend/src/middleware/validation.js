const Joi = require('joi');

const schemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    role: Joi.string().valid('buyer', 'seller').default('buyer')
  }),
  
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),
  
  createLand: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().positive().required(),
    surface: Joi.number().positive().required(),
    type: Joi.string().valid('residential', 'commercial', 'agricultural', 'mixed').required(),
    city: Joi.string().required(),
    district: Joi.string(),
    address: Joi.string().required(),
    latitude: Joi.number(),
    longitude: Joi.number()
  }),
  
  createOffer: Joi.object({
    landId: Joi.number().required(),
    offeredPrice: Joi.number().positive().required(),
    message: Joi.string()
  })
};

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      return res.status(400).json({ 
        success: false,
        message: 'Validation error',
        errors 
      });
    }

    req.validatedData = value;
    next();
  };
};

module.exports = { schemas, validateRequest };
