const axios = require('axios');
const logger = require('../middleware/log/logger');
const countryDao = require('../repositories/v1/country.dao');
const currencyDao = require('../repositories/v1/currency.dao');
const { LOG_TYPE } = require('../constants/logger.constants');
const { STATUS_CODE, CONNECTION } = require('../constants/app.constants');

const restCountriesService = {
  updateDatabase: async () => {
    try {
      // fetch all countries
      const existingCountries = await countryDao.getAll();
      const restCountries = await getAllCountries();

      // extract country details
      const newCountries = restCountries.map((country) => {
        // extract currency data
        const currencyKey = country.currencies ? Object.keys(country.currencies)[0] : null;
        const currencyData = currencyKey ? country.currencies[currencyKey] : null;

        return {
          officialName: country.name ? country.name.official : null,
          commonName: country.name ? country.name.common : null,
          capital: country.capital ? country.capital[0] : null,
          currency: {
            name: currencyData ? currencyData.name : null,
            code: currencyKey,
            symbol: currencyData ? currencyData.symbol : null,
          },
          languages: country.languages ? country.languages : null,
          flagUrl: country.flags ? country.flags.svg : null,
        };
      });

      if (newCountries.length > existingCountries.length) {
        // get countries to save
        const countriesToSave = newCountries.filter((newCountry) => {
          return !existingCountries.some((existingCountry) => existingCountry.officialName === newCountry.officialName);
        });

        await saveCountries(countriesToSave);
      }
    } catch (error) {
      console.log(error);

      logger(LOG_TYPE.FAIL, false, STATUS_CODE.SERVER_ERROR, `Failed to update countries: ${error.message}`);
    }
  },
};

async function getAllCountries() {
  try {
    const response = await axios.get(`${process.env.RC_BASE_URL}/all`);

    return response.data;
  } catch (error) {
    const statusCode = await getStatusCode(error);

    logger(LOG_TYPE.FAIL, false, statusCode, `Failed to fetch countries from RC: ${error.message}`);
  }
}

async function saveCountries(countries) {
  for (const country of countries) {
    // extract currency data
    const rawCurrency = country.currency || {};
    const currencyData = {
      name: rawCurrency.name || 'N/A',
      code: rawCurrency.code || 'N/A',
      symbol: rawCurrency.symbol || 'N/A',
    };
    const currencyCode = currencyData.code || 'N/A';

    // check currency
    let currency = await currencyDao.getByCode(currencyCode);
    if (!currency) {
      // create new currency
      const currencyDetails = {
        name: currencyData.name,
        code: currencyCode,
        symbol: currencyData.symbol,
      };
      currency = await currencyDao.insert(currencyDetails);
    }

    // create country
    const countryDetails = {
      officialName: country.officialName || 'N/A',
      commonName: country.commonName || 'N/A',
      capital: country.capital || 'N/A',
      currencyId: currency?.id,
      languages: JSON.stringify(country.languages || {}),
      flagUrl: country.flagUrl || 'N/A',
    };
    await countryDao.insert(countryDetails);
  }
}

async function getStatusCode(error) {
  let statusCode = STATUS_CODE.SERVER_ERROR;

  if (error.response) statusCode = error.response.status;
  else if (error.code === CONNECTION.ABORT) statusCode = STATUS_CODE.TIME_OUT;
  else if (error.code === CONNECTION.NOTFOUND || error.code === CONNECTION.REFUSED) statusCode = STATUS_CODE.BAD_GATEWAY;

  return statusCode;
}

module.exports = restCountriesService;
