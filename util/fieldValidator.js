const { VALIDATE } = require('../common/messages');

const fieldValidator = {
  validate_string: async (value, param) => {
    if (!value || value.trim().length === 0) {
      return {
        fields: param,
        message: VALIDATE.PARAM.EMPTY(param),
      };
    }

    return 1;
  },

  validate_number: async (value, param) => {
    if (isNaN(value) || isNaN(parseFloat(value))) {
      return {
        fields: param,
        message: VALIDATE.PARAM.EMPTY(param),
      };
    }

    return 1;
  },

  validate_email: async (email) => {
    const emailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    const isValidString = await fieldValidator.validate_string(email, 'email');
    if (isValidString != 1) {
      return isValidString;
    }

    if (!email.match(emailformat)) {
      return {
        fields: 'email',
        message: VALIDATE.PARAM.INVALID('email'),
      };
    }

    return 1;
  },

  validate_phone: async (phone) => {
    const phoneFormat = /^\+94\d{9}$/;

    const isValidString = await fieldValidator.validate_string(phone, 'phone');
    if (isValidString != 1) {
      return isValidString;
    }

    if (!phone.match(phoneFormat)) {
      return {
        fields: 'phone',
        message: VALIDATE.PARAM.INVALID('phone'),
      };
    }

    return 1;
  },

  validate_date: async (date, param) => {
    const dateFormat = /^(\d{2})\/(\d{2})\/(\d{4})$/;

    const isValidString = await fieldValidator.validate_string(date, param);
    if (isValidString != 1) {
      return isValidString;
    }

    if (!date.match(dateFormat)) {
      return {
        fields: param,
        message: VALIDATE.PARAM.INVALID(param),
      };
    }

    return 1;
  },
};

module.exports = fieldValidator;
