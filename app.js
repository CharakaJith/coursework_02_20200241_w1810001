const express = require('express');
const cors = require('cors');
const initialize = require('./database/initialze');
const swagger = require('swagger-ui-express');
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

// TODO: swagger doc

// setup routing paths
app.use('/api/v1', routesV1);
app.use('/api/v2', routesV2);

// TODO: global custom error handler

// start the server
const ENV = process.env.ENV || 'development';
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`${ENV} | ${PORT}`);
});
