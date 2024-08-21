const BaseError = require("../errors/base.error");
const tokenService = require("../services/token.service");

module.exports = function (req, res, next) {
  try {
    const authHead = req.headers.authorization;
    if (!authHead) return next(BaseError.UnAuthorizedError());
    const accessToken = authHead.split(" ").at(1);
    if (!accessToken) return next(BaseError.UnAuthorizedError());
    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) return next(BaseError.UnAuthorizedError());
    req.user = userData;
    next();
  } catch (error) {
    return next(BaseError.UnAuthorizedError());
  }
};
