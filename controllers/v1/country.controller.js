const countryService = require('../../services/v1/country.service');

const countryController = {
  fetchAll: async (req, res, next) => {
    try {
      const response = await countryService.fetchAllCountries();
      const { success, status, data } = response;

      res.status(status).json({
        success: success,
        response: {
          status: status,
          data: data,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = countryController;
