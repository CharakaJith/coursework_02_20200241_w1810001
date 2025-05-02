const models = require('../../models');
const CustomError = require('../../util/customError');
const { DAO } = require('../../common/messages');
const { STATUS_CODE } = require('../../constants/app.constants');
const { ENTITY } = require('../../constants/entity.constants');

const followDao = {
  insert: async (follow) => {
    try {
      return await models.Follow.create(follow);
    } catch (error) {
      throw new CustomError(DAO.FAILED.INSERT(ENTITY.FOLLOW, error), STATUS_CODE.SERVER_ERROR);
    }
  },

  getById: async (followId) => {
    try {
      return await models.Follow.findOne({
        where: {
          id: followId,
        },
      });
    } catch (error) {
      throw new CustomError(DAO.FAILED.GET.BY_ID(ENTITY.FOLLOW, error), STATUS_CODE.SERVER_ERROR);
    }
  },

  delete: async (followId) => {
    try {
      await models.Follow.destroy({
        where: {
          id: followId,
        },
      });
    } catch (error) {
      throw new CustomError(DAO.FAILED.DELETE(ENTITY.FOLLOW, error), STATUS_CODE.SERVER_ERROR);
    }
  },
};

module.exports = followDao;
