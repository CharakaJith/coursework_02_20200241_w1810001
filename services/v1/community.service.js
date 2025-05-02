const logger = require('../../middleware/log/logger');
const CustomError = require('../../util/customError');
const fieldValidator = require('../../util/fieldValidator');
const followDao = require('../../repositories/v1/follow.dao');
const userDao = require('../../repositories/v1/user.dao');
const { LOG_TYPE } = require('../../constants/logger.constants');
const { STATUS_CODE } = require('../../constants/app.constants');
const { POST_TYPE } = require('../../constants/post.constant');
const { RESPONSE, JWT } = require('../../common/messages');

const communityService = {
  followUser: async (data) => {
    const { userId, followerId } = data;

    // validate user details
    const errorArray = [];
    errorArray.push(await fieldValidator.validate_number(followerId, 'followerId'));

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

    // check user ids
    if (userId === followerId) {
      throw new CustomError(RESPONSE.ACTION.DENIED, STATUS_CODE.FORBIDDON);
    }

    // validate user
    const follower = await userDao.getById(followerId);
    if (!follower) {
      throw new CustomError(RESPONSE.USER.NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    // check if already follows
    const alreadyFollowing = follower.Followers?.some((f) => f.id === userId);
    if (alreadyFollowing) {
      throw new CustomError(RESPONSE.USER.FOLLOWS, STATUS_CODE.FORBIDDON);
    }

    // create new follow
    const followDetails = {
      followerId: userId,
      followingId: followerId,
    };
    const newFollow = await followDao.insert(followDetails);

    return {
      success: true,
      status: STATUS_CODE.OK,
      data: {
        follow: newFollow,
      },
    };
  },

  unfollowUser: async (data) => {
    const { userId, followId } = data;

    // validate user details
    const errorArray = [];
    errorArray.push(await fieldValidator.validate_number(followId, 'followId'));

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

    // fetch and validate follow
    const follow = await followDao.getById(followId);
    if (!follow) {
      throw new CustomError(RESPONSE.FOLLOW.NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }
    if (follow.followerId !== userId) {
      throw new CustomError(RESPONSE.ACTION.DENIED, STATUS_CODE.FORBIDDON);
    }

    // remove follow
    await followDao.delete(follow.id);

    return {
      success: true,
      status: STATUS_CODE.OK,
      data: {
        message: RESPONSE.USER.UNFOLLOWED,
      },
    };
  },
};

module.exports = communityService;
