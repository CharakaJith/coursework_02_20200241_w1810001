const express = require('express');
const routesV1 = express.Router();
const userRouter = require('./user.routes');
const postRouter = require('./post.routes');

routesV1.use('/user', userRouter);
routesV1.use('/post', postRouter);

module.exports = routesV1;
