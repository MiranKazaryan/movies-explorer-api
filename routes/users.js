const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { updateProfile, getUserInfo } = require('../controllers/users');

userRouter.get('/me', getUserInfo);
userRouter.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().email().required(),
    }),
  }),
  updateProfile,
);

module.exports = userRouter;
