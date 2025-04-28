const models = require('../../models');
const CustomError = require('../../util/customError');
const { DAO } = require('../../common/messages');
const { STATUS_CODE } = require('../../constants/app.constants');
const { ENTITY } = require('../../constants/entity.constants');

const commentDao = {
  insert: async (comment) => {
    try {
      return await models.Comment.create(comment);
    } catch (error) {
      throw new CustomError(DAO.FAILED.INSERT(ENTITY.COMMENT, error), STATUS_CODE.SERVER_ERROR);
    }
  },
};

module.exports = commentDao;
