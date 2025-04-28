const logger = require('../../middleware/log/logger');
const CustomError = require('../../util/customError');
const fieldValidator = require('../../util/fieldValidator');
const postDao = require('../../repositories/v1/post.dao');
const reactDao = require('../../repositories/v1/react.dao');
const { LOG_TYPE } = require('../../constants/logger.constants');
const { STATUS_CODE } = require('../../constants/app.constants');
const { RESPONSE } = require('../../common/messages');

const reactService = {
  newPostReact: async (data) => {
    const { userId, postId, isLike } = data;

    // validate user details
    const errorArray = [];
    errorArray.push(await fieldValidator.validate_boolean(isLike, 'isLike'));
    errorArray.push(await fieldValidator.validate_number(postId, 'postId'));

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

    // fetch and validate post
    const post = await postDao.getById(postId);
    if (!post) {
      throw new CustomError(RESPONSE.POST.NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }
    if (post.userId === userId) {
      throw new CustomError(RESPONSE.ACTION.DENIED, STATUS_CODE.FORBIDDON);
    }

    // check if already reacted
    const reacts = await reactDao.getByPost(postId, userId);
    const alreadyReacted = reacts.some((react) => react.isLike === isLike);

    if (alreadyReacted) {
      throw new CustomError(isLike ? RESPONSE.REACT.LIKED : RESPONSE.REACT.DILIKED, STATUS_CODE.BAD_REQUEST);
    }

    // check for opposite reaction
    const existingOppositeReact = reacts.find((react) => react.isLike !== isLike);
    if (existingOppositeReact) {
      const existingReactDetails = {
        id: existingOppositeReact.id,
        userId: existingOppositeReact.userId,
        postId: existingOppositeReact.postId,
        isLike: isLike,
      };

      const updatedReact = await reactDao.update(existingReactDetails);

      return {
        success: true,
        status: STATUS_CODE.CREATED,
        data: {
          react: updatedReact,
        },
      };
    }

    // create a new react
    const reactDetails = {
      postId: postId,
      userId: userId,
      isLike: isLike,
    };
    const newReact = await reactDao.insert(reactDetails);

    return {
      success: true,
      status: STATUS_CODE.CREATED,
      data: {
        react: newReact,
      },
    };
  },
};

module.exports = reactService;
