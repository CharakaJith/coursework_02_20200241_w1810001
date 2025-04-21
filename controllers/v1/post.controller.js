const postService = require('../../services/v1/post.service');

const postController = {
  create: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const postData = ({ title, content, countryId, visitDate } = req.body);
      postData.userId = userId;

      const response = await postService.createNewPost(postData);
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

  getAll: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const type = req.params.type;
      const postData = {
        userId: userId,
        postType: type,
      };

      const response = await postService.getAllPosts(postData);
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

  getById: async (req, res, next) => {
    try {
      const postId = req.params.id;

      const response = await postService.getPostById(postId);
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

module.exports = postController;
