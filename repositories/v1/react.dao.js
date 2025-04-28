const models = require('../../models');
const CustomError = require('../../util/customError');
const { DAO } = require('../../common/messages');
const { STATUS_CODE } = require('../../constants/app.constants');
const { ENTITY } = require('../../constants/entity.constants');

const reactDao = {
  insert: async (react) => {
    try {
      return await models.Like.create(react);
    } catch (error) {
      throw new CustomError(DAO.FAILED.INSERT(ENTITY.LIKE, error), STATUS_CODE.SERVER_ERROR);
    }
  },
};

module.exports = reactDao;
