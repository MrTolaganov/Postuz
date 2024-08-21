const { validationResult } = require("express-validator");
const authService = require("../services/auth.service");
const BaseError = require("../errors/base.error");

class AuthController {
  async register(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return next(BaseError.BadRequest("Error with registering", errors.array()));
      const { email, password } = req.body;
      const user = await authService.register(email, password);
      res.cookie("refreshToken", user.refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 30,
      });
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }
  async activate(req, res, next) {
    try {
      await authService.activate(req.params.id);
      res.redirect(process.env.CLIENT_URL);
    } catch (error) {
      next(error);
    }
  }
  async login(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return next(BaseError.BadRequest("Error with logining", errors.array()));
      const { email, password } = req.body;
      const user = await authService.login(email, password);
      res.cookie("refreshToken", user.refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 30,
      });
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      await authService.logout(refreshToken);
      res.clearCookie("refreshToken");
      res.status(200).json({ message: "User has logged out" });
    } catch (error) {
      next(error);
    }
  }
  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const user = await authService.refresh(refreshToken);
      res.cookie("refreshToken", user.refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 30,
      });
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
  async getUsers(req, res, next) {
    try {
      const users = await authService.getUsers();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }
  async forgotPass(req, res, next) {
    try {
      await authService.forgotPass(req.body.email);
      res.status(200).json({ message: "Account is ready for recovery" });
    } catch (error) {
      next(error);
    }
  }
  async recoveryAcc(req, res, next) {
    try {
      const { token, password } = req.body;
      await authService.recoveryAcc(token, password);
      res.status(200).json({ message: "Account is recovered" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
