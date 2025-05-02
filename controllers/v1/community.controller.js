const communityService = require('../../services/v1/community.service');

const communityController = {
  follow: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const userData = ({ followerId } = req.body);
      userData.userId = userId;

      const response = await communityService.followUser(userData);
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

  unfollow: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const userData = ({ followId } = req.body);
      userData.userId = userId;

      const response = await communityService.unfollowUser(userData);
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

module.exports = communityController;
