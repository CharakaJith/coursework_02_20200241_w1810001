const express = require('express');
const authenticate = require('../../middleware/auth/authenticate');
const commentController = require('../../controllers/v1/comment.controller');

const commentRouter = express.Router();
commentRouter.use(authenticate);

commentRouter.post('/', commentController.comment);

module.exports = commentRouter;
