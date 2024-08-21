const { Router } = require("express");
const postController = require("../controllers/post.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const authorMiddleware = require("../middlewares/author.middleware");

const router = Router();

router.get("/get", postController.getAllPosts);
router.get("/get/:id", postController.getPost);
router.post("/post", authMiddleware, postController.createPost);
router.delete("/delete/:id", authMiddleware, authorMiddleware, postController.deletedPost);
router.put("/put/:id", authMiddleware, authorMiddleware, postController.editPost);

module.exports = router;
