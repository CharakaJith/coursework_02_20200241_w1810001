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
};

module.exports = followDao;
