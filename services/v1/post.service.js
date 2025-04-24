const moment = require('moment');
const logger = require('../../middleware/log/logger');
const CustomError = require('../../util/customError');
const fieldValidator = require('../../util/fieldValidator');
const postDao = require('../../repositories/v1/post.dao');
const countryDao = require('../../repositories/v1/country.dao');
const { LOG_TYPE } = require('../../constants/logger.constants');
const { STATUS_CODE } = require('../../constants/app.constants');
const { POST_TYPE } = require('../../constants/post.constant');
const { RESPONSE, JWT } = require('../../common/messages');

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

  getAllPosts: async (data) => {
    const { userId, postType } = data;

    // validate post type
    const isValidType = Object.values(POST_TYPE).includes(postType);
    if (!isValidType) {
      throw new CustomError(RESPONSE.POST.INVALID_TYPE, STATUS_CODE.BAD_REQUEST);
    }

    // get all posts
    let posts = await postDao.getAll();

    // filter out posts for user
    if (postType === POST_TYPE.USER) {
      posts = posts.filter((post) => post.userId === userId);
    }

    // parse country language
    for (const post of posts) {
      post.Country.languages = JSON.parse(post.Country.languages);
    }

    return {
      success: true,
      status: STATUS_CODE.OK,
      data: {
        posts: posts,
      },
    };
  },

  getPostById: async (postId) => {
    // validate post id
    if (isNaN(postId) || isNaN(parseFloat(postId))) {
      throw new CustomError(RESPONSE.POST.INVALID_ID, STATUS_CODE.BAD_REQUEST);
    }

    // fetch the post
    const post = await postDao.getById(postId);
    if (!post) {
      throw new CustomError(RESPONSE.POST.NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    return {
      success: true,
      status: STATUS_CODE.OK,
      data: {
        post: post,
      },
    };
  },

  deletePost: async (data) => {
    const { userId, postId } = data;

    // validate post id
    if (isNaN(postId) || isNaN(parseFloat(postId))) {
      throw new CustomError(RESPONSE.POST.INVALID_ID, STATUS_CODE.BAD_REQUEST);
    }

    // fetch and validate post
    const post = await postDao.getById(postId);
    if (!post) {
      throw new CustomError(RESPONSE.POST.NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }
    if (post.userId !== userId) {
      throw new CustomError(JWT.AUTH.FORBIDDEN, STATUS_CODE.FORBIDDON);
    }

    // delete post
    await postDao.delete(post.id);

    return {
      success: true,
      status: STATUS_CODE.GONE,
      data: {
        message: RESPONSE.POST.DELETED,
      },
    };
  },
};

module.exports = postService;
