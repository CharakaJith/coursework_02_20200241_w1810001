const moment = require('moment');
const logger = require('../../middleware/log/logger');
const CustomError = require('../../util/customError');
const fieldValidator = require('../../util/fieldValidator');
const postDao = require('../../repositories/v1/post.dao');
const countryDao = require('../../repositories/v1/country.dao');
const { LOG_TYPE } = require('../../constants/logger.constants');
const { STATUS_CODE } = require('../../constants/app.constants');
const { RESPONSE } = require('../../common/messages');

const postService = {
  createNewPost: async (postData) => {
    const { title, content, countryId, visitDate, userId } = postData;

    // validate user details
    const errorArray = [];
    errorArray.push(await fieldValidator.validate_string(title, 'title'));
    errorArray.push(await fieldValidator.validate_string(content, 'content'));
    errorArray.push(await fieldValidator.validate_number(countryId, 'countryId'));
    errorArray.push(await fieldValidator.validate_date(visitDate, 'visitDate'));

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

    // validate country
    const country = await countryDao.getById(countryId);
    if (!country) {
      throw new CustomError(RESPONSE.COUNTRY.INVALID, STATUS_CODE.NOT_FOUND);
    }

    // create new post
    const postDetails = {
      userId: userId,
      title: title,
      content: content,
      countryId: countryId,
      visitDate: moment(visitDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
    };
    const newPost = await postDao.insert(postDetails);

    return {
      success: true,
      status: STATUS_CODE.CREATED,
      data: {
        post: newPost,
      },
    };
  },
};

module.exports = postService;
