const { Router } = require("express");
const authController = require("../controllers/auth.controller");
const { body } = require("express-validator");
const authMiddleware = require("../middlewares/auth.middleware");

const router = Router();

router.post(
  "/register",
  body("email").isEmail(),
  body("password").isLength({ min: 8, max: 16 }),
  authController.register
);
router.get("/activate/:id", authController.activate);
router.post(
  "/login",
  body("email").isEmail(),
  body("password").isLength({ min: 8, max: 16 }),
  authController.login
);
router.delete("/logout", authController.logout);
router.get("/refresh", authController.refresh);
router.get("/get-users", authMiddleware, authController.getUsers);
router.post("/forgot-pass", authController.forgotPass);
router.put("/recovery-acc", authController.recoveryAcc);

module.exports = router;
