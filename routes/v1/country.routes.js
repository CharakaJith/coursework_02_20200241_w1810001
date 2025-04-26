const express = require('express');
const authenticate = require('../../middleware/auth/authenticate');
const countryController = require('../../controllers/v1/country.controller');

const countryRouter = express.Router();
countryRouter.use(authenticate);

countryRouter.get('/', countryController.fetchAll);

module.exports = countryRouter;
