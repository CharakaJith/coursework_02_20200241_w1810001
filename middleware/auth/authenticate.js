const jwt = require('jsonwebtoken');
const logger = require('../log/logger');
const { STATUS_CODE } = require('../../constants/app.constants');
const { JWT } = require('../../common/messages');
const { LOG_TYPE } = require('../../constants/logger.constants');

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    // decode access token
    const decodedToken = jwt.verify(JSON.parse(token), process.env.ACCESS_TOKEN_SECRET);
    req.user = decodedToken.tokenUser;

    next();
  } catch (error) {
    const statusCode = STATUS_CODE.UNAUTHORIZED;

    res.status(statusCode).json({
      success: false,
      response: {
        status: statusCode,
        data: JWT.AUTH.FAILED,
      },
    });

    logger(LOG_TYPE.ERROR, false, statusCode, `${error.message}`, req);
  }
};

module.exports = authenticate;
