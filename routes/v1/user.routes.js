const express = require('express');
const authenticate = require('../../middleware/auth/authenticate');
const userController = require('../../controllers/v1/user.controller');
const communityController = require('../../controllers/v1/community.controller');

const userRouter = express.Router();

userRouter.post('/', userController.signup);
userRouter.post('/login', userController.login);

userRouter.use(authenticate);

userRouter.get('/', userController.getAll);
userRouter.get('/:id', userController.getById);
userRouter.put('/', userController.update);
userRouter.put('/password', userController.updatePassword);
userRouter.delete('/', userController.deactivate);

userRouter.post('/follow', communityController.follow);
userRouter.post('/unfollow', communityController.unfollow);

module.exports = userRouter;
