const logger = require('../../middleware/log/logger');
const CustomError = require('../../util/customError');
const fieldValidator = require('../../util/fieldValidator');
const postDao = require('../../repositories/v1/post.dao');
const commentDao = require('../../repositories/v1/comment.dao');
const { LOG_TYPE } = require('../../constants/logger.constants');
const { STATUS_CODE } = require('../../constants/app.constants');
const { RESPONSE, JWT } = require('../../common/messages');

const commentService = {
  postNewComment: async (data) => {
    const { userId, postId, content } = data;

    // validate user details
    const errorArray = [];
    errorArray.push(await fieldValidator.validate_string(content, 'content'));
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

    // create new comment
    const commentDetails = {
      postId: postId,
      userId: userId,
      content: content,
    };
    const newComment = await commentDao.insert(commentDetails);

    return {
      success: true,
      status: STATUS_CODE.CREATED,
      data: {
        comment: newComment,
      },
    };
  },
};

module.exports = commentService;
