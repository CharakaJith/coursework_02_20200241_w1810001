const express = require('express');
const authenticate = require('../../middleware/auth/authenticate');
const postController = require('../../controllers/v1/post.controller');
const commentController = require('../../controllers/v1/comment.controller');
const reactController = require('../../controllers/v1/react.controller');

const postRouter = express.Router();
postRouter.use(authenticate);

postRouter.post('/', postController.create);
postRouter.get('/:type', postController.getAll);
postRouter.get('/single/:id', postController.getById);
postRouter.put('/', postController.update);
postRouter.delete('/:id', postController.delete);

postRouter.post('/react', reactController.react);
postRouter.post('/comment', commentController.comment);

module.exports = postRouter;
