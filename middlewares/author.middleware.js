const BaseError = require("../errors/base.error");
const postModel = require("../models/post.model");

module.exports = async function (req, res, next) {
  try {
    const post = await postModel.findById(req.params.id);
    if (post.author.toString() !== req.user.id)
      return next(BaseError.BadRequest("Only author can edit or delete this post"));
    next();
  } catch (error) {
    return next(BaseError.BadRequest("Only author can edit or delete this post"));
  }
};
