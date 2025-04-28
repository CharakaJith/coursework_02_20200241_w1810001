const express = require('express');
const routesV1 = express.Router();
const userRouter = require('./user.routes');
const postRouter = require('./post.routes');
const countryRouter = require('./country.routes');
const commentRouter = require('./comment.routes');
const reactRouter = require('./react.routes');

routesV1.use('/user', userRouter);
routesV1.use('/post', postRouter);
routesV1.use('/country', countryRouter);
routesV1.use('/comment', commentRouter);
routesV1.use('/react', reactRouter);

module.exports = routesV1;
