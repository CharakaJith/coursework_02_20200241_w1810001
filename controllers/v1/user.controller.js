const userService = require('../../services/v1/user.service');

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
};

module.exports = userController;
