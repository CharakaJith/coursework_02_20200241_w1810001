const express = require('express');
const cors = require('cors');
const initialize = require('./database/initialze');
const errorHandler = require('./middleware/errorHandler');
const swagger = require('swagger-ui-express');
const swaggerDocV1 = require('./docs/v1/swagger.json');
require('dotenv').config();

const routesV1 = require('./routes/v1/index');
const routesV2 = require('./routes/v2/index');

// initialize the express app
const app = express();
app.use(
  cors({
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Access-Token'],
  })
);
app.use(express.json());

// initialize database
const initialization = async () => {
  await initialize();
};
initialization();

// swagger doc
app.use('/api-docs', swagger.serve, swagger.setup(swaggerDocV1));

// setup routing paths
app.use('/api/v1', routesV1);
app.use('/api/v2', routesV2);

// global custom error handler
app.use(errorHandler);

// start the server
const ENV = process.env.ENV || 'development';
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`${ENV} | ${PORT}`);
});
