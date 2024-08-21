module.exports = class PostDto {
  id;
  title;
  body;
  image;
  author;
  constructor(model) {
    (this.id = model._id),
      (this.title = model.title),
      (this.body = model.body),
      (this.image = model.image);
    this.author = model.author;
  }
};
