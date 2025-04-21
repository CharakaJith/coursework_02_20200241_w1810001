const models = require('../../models');
const CustomError = require('../../util/customError');
const { DAO } = require('../../common/messages');
const { STATUS_CODE } = require('../../constants/app.constants');
const { ENTITY } = require('../../constants/entity.constants');

const countryDao = {
  insert: async (country) => {
    try {
      return await models.Country.create(country);
    } catch (error) {
      throw new CustomError(DAO.FAILED.INSERT(ENTITY.COUNTRY, error), STATUS_CODE.SERVER_ERROR);
    }
  },

  getAll: async () => {
    try {
      return await models.Country.findAll();
    } catch (error) {
      throw new CustomError(DAO.FAILED.GET.ALL(ENTITY.COUNTRY, error), STATUS_CODE.SERVER_ERROR);
    }
  },

  getById: async (countryId) => {
    try {
      return await models.Country.findOne({
        where: {
          id: countryId,
        },
        include: [
          {
            model: models.Currency,
          },
        ],
        attributes: { exclude: ['currencyId'] },
      });
    } catch (error) {
      throw new CustomError(DAO.FAILED.GET.BY_ID(ENTITY.COUNTRY, error), STATUS_CODE.SERVER_ERROR);
    }
  },
};

module.exports = countryDao;
