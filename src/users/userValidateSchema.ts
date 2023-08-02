import * as joi from 'joi';

export const createUserSchema = joi.object({
  email: joi.string().email().required(),
  name: joi.string(),
  password: joi
    .string()
    .min(8)
    .regex(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$/)
    .required(),
});
