import { celebrate, Joi } from 'celebrate';

export const validateGetUsersByCuisine = celebrate({
  query: {
    page: Joi.number().optional(),
    limit: Joi.number().optional(),
    cuisine: Joi.string().required(),
  },
});
