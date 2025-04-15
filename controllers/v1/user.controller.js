const userService = require('../../services/v1/user.service');
const { APP_ENV } = require('../../constants/app.constants');

const userController = {
  signup: async (req, res, next) => {
    try {
      const userData = ({ firstName, lastName, phone, email, password } = req.body);

      const response = await userService.userSignup(userData);
      const { success, status, data } = response;

      res.status(status).json({
        success: success,
        response: {
          status: status,
          data: data,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const userData = ({ email, password } = req.body);

      const response = await userService.userLogin(userData);
      const { success, status, data, accessToken, refreshToken } = response;

      // set access token
      res.set({
        'Access-Token': accessToken,
      });

      // set refresh token in a http-only cookie
      const isSecure = process.env.NODE_ENV === APP_ENV.DEV ? false : true;
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isSecure,
        sameSite: 'Strict',
        path: '/',
      });

      res.status(status).json({
        success: success,
        response: {
          status: status,
          data: data,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userController;
