const models = require('../../models');
const CustomError = require('../../util/customError');
const { DAO } = require('../../common/messages');
const { STATUS_CODE } = require('../../constants/app.constants');
const { ENTITY } = require('../../constants/entity.constants');

const postDao = {
  insert: async (post) => {
    try {
      return await models.Post.create(post);
    } catch (error) {
      throw new CustomError(DAO.FAILED.INSERT(ENTITY.POST, error), STATUS_CODE.SERVER_ERROR);
    }
  },

  getAll: async () => {
    try {
      return await models.Post.findAll({
        include: [
          {
            model: models.User,
          },
          {
            model: models.Country,
            include: [
              {
                model: models.Currency,
              },
            ],
            attributes: { exclude: ['currencyId'] },
          },
          {
            model: models.Like,
            include: [
              {
                model: models.User,
                attributes: { exclude: ['password'] },
              },
            ],
            attributes: { exclude: ['postId'] },
          },
          {
            model: models.Comment,
            include: [
              {
                model: models.User,
                attributes: { exclude: ['password'] },
              },
            ],
            attributes: { exclude: ['postId'] },
          },
        ],
        attributes: { exclude: ['countryId'] },
        order: [['createdAt', 'DESC']],
      });
    } catch (error) {
      throw new CustomError(DAO.FAILED.GET.ALL(ENTITY.POST, error), STATUS_CODE.SERVER_ERROR);
    }
  },

  getById: async (postId) => {
    try {
      return await models.Post.findOne({
        where: {
          id: postId,
        },
        include: [
          {
            model: models.Country,
            include: [
              {
                model: models.Currency,
              },
            ],
            attributes: { exclude: ['currencyId'] },
          },
          {
            model: models.Like,
            include: [
              {
                model: models.User,
                attributes: { exclude: ['password'] },
              },
            ],
            attributes: { exclude: ['postId'] },
          },
          {
            model: models.Comment,
            include: [
              {
                model: models.User,
                attributes: { exclude: ['password'] },
              },
            ],
            attributes: { exclude: ['postId'] },
          },
        ],
        attributes: { exclude: ['countryId'] },
      });
    } catch (error) {
      throw new CustomError(DAO.FAILED.GET.BY_ID(ENTITY.POST, error), STATUS_CODE.SERVER_ERROR);
    }
  },

  update: async (post) => {
    try {
      return await models.Post.update(
        {
          title: post.title,
          content: post.content,
          countryId: post.countryId,
          visitDate: post.visitDate,
        },
        {
          where: {
            id: post.id,
          },
        }
      );
    } catch (error) {
      throw new CustomError(DAO.FAILED.UPDATE(ENTITY.POST, error), STATUS_CODE.SERVER_ERROR);
    }
  },

  delete: async (postId) => {
    try {
      await models.Post.destroy({
        where: {
          id: postId,
        },
      });
    } catch (error) {
      throw new CustomError(DAO.FAILED.DELETE(ENTITY.POST, error), STATUS_CODE.SERVER_ERROR);
    }
  },
};

module.exports = postDao;
