const jwt = require('jsonwebtoken');
const CustomError = require('../util/customError');
const { JWT } = require('../common/messages');
const { STATUS_CODE } = require('../constants/app.constants');

const jwtService = {
  generateAccessToken: async (tokenUser) => {
    try {
      return jwt.sign({ tokenUser }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '3h',
      });
    } catch (error) {
      throw new CustomError(JWT.GENERATE.FAILED('access', error), STATUS_CODE.SERVER_ERROR);
    }
  },

  generateRefreshToken: async (tokenUser) => {
    try {
      return jwt.sign({ tokenUser }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '7d',
      });
    } catch (error) {
      throw new CustomError(JWT.GENERATE.FAILED('refresh', error), STATUS_CODE.SERVER_ERROR);
    }
  },

  refreshToken: async (token) => {
    try {
      // verify access token
      const decodeToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
      const tokenUser = decodeToken.tokenUser;

      return jwt.sign({ tokenUser }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '3h',
      });
    } catch (error) {
      throw new CustomError();
    }
  },
};

module.exports = jwtService;
