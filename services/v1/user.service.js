const bcrypt = require('bcrypt');
const logger = require('../../middleware/log/logger');
const fieldValidator = require('../../util/fieldValidator');
const CustomError = require('../../util/customError');
const userDao = require('../../repositories/v1/user.dao');
const { LOG_TYPE } = require('../../constants/logger.constants');
const { STATUS_CODE } = require('../../constants/app.constants');
const { RESPONSE, JWT } = require('../../common/messages');

const userService = {
  userSignup: async (data) => {
    const { firstName, lastName, phone, email, password } = data;

    // validate user details
    const errorArray = [];
    errorArray.push(await fieldValidator.validate_string(firstName, 'firstName'));
    errorArray.push(await fieldValidator.validate_string(lastName, 'lastName'));
    errorArray.push(await fieldValidator.validate_phone(phone, 'phone'));
    errorArray.push(await fieldValidator.validate_email(email, 'email'));
    errorArray.push(await fieldValidator.validate_string(password, 'password'));

    // check request data
    const filteredErrors = errorArray.filter((obj) => obj !== 1);
    if (filteredErrors.length !== 0) {
      logger(LOG_TYPE.ERROR, false, STATUS_CODE.BAD_REQUEST, filteredErrors);

      return {
        success: false,
        status: STATUS_CODE.BAD_REQUEST,
        data: filteredErrors,
      };
    }

    // check if user already registered
    const user = await userDao.getByEmail(email);
    if (user) {
      throw new CustomError(RESPONSE.USER.EXISTS, STATUS_CODE.CONFLICT);
    }

    // hash password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // create new user
    const userDetails = {
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      email: email,
      password: encryptedPassword,
    };
    const newUser = await userDao.insert(userDetails);

    // remove password
    delete newUser.dataValues.password;

    return {
      success: true,
      status: STATUS_CODE.CREATED,
      data: {
        user: newUser,
      },
    };
  },
};

module.exports = userService;
