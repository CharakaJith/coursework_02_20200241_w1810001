const countryDao = require('../../repositories/v1/country.dao');
const { STATUS_CODE } = require('../../constants/app.constants');

const countryService = {
  fetchAllCountries: async () => {
    // fetch countries
    const countries = await countryDao.getAll();

    return {
      success: true,
      status: STATUS_CODE.OK,
      data: {
        countries: countries,
      },
    };
  },
};

module.exports = countryService;
