const models = require('../../models');
const CustomError = require('../../util/customError');
const { DAO } = require('../../common/messages');
const { STATUS_CODE } = require('../../constants/app.constants');
const { ENTITY } = require('../../constants/entity.constants');

const userDao = {
  insert: async (user) => {
    try {
      return await models.User.create(user);
    } catch (error) {
      throw new CustomError(DAO.FAILED.INSERT(ENTITY.USER, error), STATUS_CODE.SERVER_ERROR);
    }
  },

  getAll: async () => {
    try {
      return await models.User.findAll({
        order: [['lastName', 'ASC']],
      });
    } catch (error) {
      throw new CustomError(DAO.FAILED.GET.ALL(ENTITY.USER, error), STATUS_CODE.SERVER_ERROR);
    }
  },

  getByEmail: async (userEmail) => {
    try {
      return await models.User.findOne({
        where: {
          email: userEmail,
          isActive: true,
        },
      });
    } catch (error) {
      throw new CustomError(DAO.FAILED.GET.BY_EMAIL(ENTITY.USER, error), STATUS_CODE.SERVER_ERROR);
    }
  },

  getById: async (userId) => {
    try {
      return await models.User.findByPk(userId);
    } catch (error) {
      throw new CustomError(DAO.FAILED.GET.BY_ID(ENTITY.USER, error), STATUS_CODE.SERVER_ERROR);
    }
  },

  update: async (user) => {
    try {
      return await models.User.update(
        {
          firstName: user.firstName,
          lastName: user.lastName,
          password: user.password,
          phone: user.phone,
          isActive: user.isActive,
        },
        {
          where: {
            id: user.id,
          },
        }
      );
    } catch (error) {
      throw new CustomError(DAO.FAILED.UPDATE(ENTITY.USER, error), STATUS_CODE.SERVER_ERROR);
    }
  },
};

module.exports = userDao;
