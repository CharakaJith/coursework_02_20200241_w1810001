const logger = require('../log/logger');
const { STATUS_CODE } = require('../../constants/app.constants');
const { LOG_TYPE } = require('../../constants/logger.constants');
const { JWT } = require('../../common/messages');

const authorize = (...allowedRoles) => {
  const checkRole = async (req, res, next) => {
    try {
      // TODO: implement role based access control
      next();
    } catch (error) {
      const statusCode = STATUS_CODE.FORBIDDON;

      res.status(statusCode).json({
        success: false,
        response: {
          status: statusCode,
          data: JWT.AUTH.FORBIDDEN,
        },
      });

      logger(LOG_TYPE.ERROR, false, statusCode, `${error.message}`, req);
    }
  };
};

module.exports = authorize;
