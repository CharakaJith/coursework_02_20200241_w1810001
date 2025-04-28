const commentService = require('../../services/v1/comment.service');

const commentController = {
  comment: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const commentData = ({ postId, content } = req.body);
      commentData.userId = userId;

      const response = await commentService.postNewComment(commentData);
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

module.exports = commentController;
