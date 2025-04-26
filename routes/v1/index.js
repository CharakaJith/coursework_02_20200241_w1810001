const express = require('express');
const routesV1 = express.Router();
const userRouter = require('./user.routes');
const postRouter = require('./post.routes');
const countryRouter = require('./country.routes');

routesV1.use('/user', userRouter);
routesV1.use('/post', postRouter);
routesV1.use('/country', countryRouter);

module.exports = routesV1;
