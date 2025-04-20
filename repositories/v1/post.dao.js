const models = require('../../models');
const CustomError = require('../../util/customError');
const { DAO } = require('../../common/messages');
const { STATUS_CODE } = require('../../constants/app.constants');
const { ENTITY } = require('../../constants/entity.constants');

const postDao = {
  insert: async (post) => {
    try {
      return await models.Post.create(post);
    } catch (error) {
      throw new CustomError(DAO.FAILED.INSERT(ENTITY.POST, error), STATUS_CODE.SERVER_ERROR);
    }
  },
};

module.exports = postDao;
