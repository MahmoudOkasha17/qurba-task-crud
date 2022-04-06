import { celebrate, Joi } from 'celebrate';

export const validateFindNearRestaurants = celebrate({
  body: {
    type: Joi.string().valid('Point', 'Polygon').default('Point').required(),
    coordinates: Joi.array().items(Joi.number()).required(),
  },
  query: {
    page: Joi.number(),
    limit: Joi.number(),
  },
});
