const express = require('express');
const userController = require('../../controllers/v1/user.controller');

const userRouter = express.Router();

userRouter.post('/', userController.signup);
userRouter.post('/login', userController.login);

module.exports = userRouter;
