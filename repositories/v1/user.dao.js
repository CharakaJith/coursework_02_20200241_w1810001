const model = require('../../models');
const CustomError = require('../../util/customError');
const { DAO } = require('../../common/messages');
const { STATUS_CODE } = require('../../constants/app.constants');
const { ENTITY } = require('../../constants/entity.constant');

const userDao = {
  insert: async (user) => {
    try {
      return await model.User.create(user);
    } catch (error) {
      throw new CustomError(DAO.FAILED.INSERT(ENTITY.USER, error), STATUS_CODE.SERVER_ERROR);
    }
  },

  getByEmail: async (userEmail) => {
    try {
      return await model.User.findOne({
        where: {
          email: userEmail,
          isActive: true,
        },
      });
    } catch (error) {
      throw new CustomError(DAO.FAILED.GET.BY_EMAIL(ENTITY.USER, error), STATUS_CODE.SERVER_ERROR);
    }
  },
};

module.exports = userDao;
