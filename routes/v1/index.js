const express = require('express');
const routesV1 = express.Router();
const userRouter = require('./user.routes');

routesV1.use('/user', userRouter);

module.exports = routesV1;
