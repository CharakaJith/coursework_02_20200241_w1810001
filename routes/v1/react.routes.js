const express = require('express');
const authenticate = require('../../middleware/auth/authenticate');
const reactController = require('../../controllers/v1/react.controller');

const reactRouter = express.Router();
reactRouter.use(authenticate);

reactRouter.post('/', reactController.react);

module.exports = reactRouter;
