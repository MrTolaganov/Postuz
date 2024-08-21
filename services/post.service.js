const PostDto = require("../dtos/post.dto");
const postModel = require("../models/post.model");
const fileService = require("./file.service");

class PostService {
  async getAllPosts() {
    const posts = await postModel.find();
    const postDtos = posts.map(post => new PostDto(post));
    return { posts: postDtos };
  }
  async getPost(id) {
    const post = await postModel.findById(id);
    const postDto = new PostDto(post);
    return { post: postDto };
  }
  async createPost(post, image, author) {
    const fileName = fileService.save(image);
    const newPost = await postModel.create({ ...post, image: fileName, author });
    const postDto = new PostDto(newPost);
    return { post: postDto };
  }
  async deletePost(id) {
    const deletedPost = await postModel.findByIdAndDelete(id);
    const postDto = new PostDto(deletedPost);
    return { post: postDto };
  }
  async editPost(id, post) {
    const editedPost = await postModel.findByIdAndUpdate(id, post, { new: true });
    const postDto = new PostDto(editedPost);
    return { post: postDto };
  }
}

module.exports = new PostService();
