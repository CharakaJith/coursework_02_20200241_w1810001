const reactService = require('../../services/v1/react.service');

const reactController = {
  react: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const reactData = ({ postId, isLike } = req.body);
      reactData.userId = userId;

      const response = await reactService.newPostReact(reactData);
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

module.exports = reactController;
