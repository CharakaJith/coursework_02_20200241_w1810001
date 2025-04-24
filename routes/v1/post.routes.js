const express = require('express');
const authenticate = require('../../middleware/auth/authenticate');
const postController = require('../../controllers/v1/post.controller');

const postRouter = express.Router();
postRouter.use(authenticate);

postRouter.post('/', postController.create);
postRouter.get('/:type', postController.getAll);
postRouter.get('/:id', postController.getById);
postRouter.delete('/:id', postController.delete);

module.exports = postRouter;
