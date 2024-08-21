const postService = require("../services/post.service");

class PostController {
  async getAllPosts(req, res, next) {
    try {
      const posts = await postService.getAllPosts();
      res.status(200).json(posts);
    } catch (error) {
      next(error);
    }
  }
  async getPost(req, res, next) {
    try {
      const post = await postService.getPost(req.params.id);
      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  }
  async createPost(req, res, next) {
    try {
      const post = await postService.createPost(req.body, req.files.image, req.user.id);
      res.status(201).json(post);
    } catch (error) {
      next(error);
    }
  }
  async deletedPost(req, res, next) {
    try {
      const post = await postService.deletePost(req.params.id);
      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  }
  async editPost(req, res, next) {
    try {
      const { params, body } = req;
      const post = await postService.editPost(params.id, body);
      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PostController();
