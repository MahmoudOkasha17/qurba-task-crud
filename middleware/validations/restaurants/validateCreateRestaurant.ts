import { celebrate, Joi } from 'celebrate';

export const validateCreateRestaurant = celebrate({
  body: {
    name: Joi.string().required(),
    cuisine: Joi.string().required(),
    location: Joi.object().keys({
      type: Joi.string().valid('Point', 'Polygon').required(),
      coordinates: Joi.array().items(Joi.number()).required(),
    }),
  },
});
