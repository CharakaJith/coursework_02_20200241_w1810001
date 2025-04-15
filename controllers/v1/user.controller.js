const userService = require('../../services/v1/user.service');

const userController = {
  signup: async (req, res) => {
    await userService.userSignup();
  },
};

module.exports = userController;
