const models = require('../../models');
const CustomError = require('../../util/customError');
const { DAO } = require('../../common/messages');
const { ENTITY } = require('../../constants/entity.constants');
const { STATUS_CODE } = require('../../constants/app.constants');

const currencyDao = {
  insert: async (currency) => {
    try {
      return await models.Currency.create(currency);
    } catch (error) {
      throw new CustomError(DAO.FAILED.INSERT(ENTITY.CURRENCY, error), STATUS_CODE.SERVER_ERROR);
    }
  },

  getByCode: async (currencyCode) => {
    try {
      return await models.Currency.findOne({
        where: {
          code: currencyCode,
        },
      });
    } catch (error) {
      throw new CustomError(DAO.FAILED.GET.BY_CODE(ENTITY.CURRENCY, error), STATUS_CODE.SERVER_ERROR);
    }
  },
};

module.exports = currencyDao;
