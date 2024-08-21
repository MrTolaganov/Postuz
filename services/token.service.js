const jwt = require("jsonwebtoken");
const tokenModel = require("../models/token.model");

class TokenService {
  generateToken(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_KEY, { expiresIn: "15m" });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_KEY, { expiresIn: "30d" });
    return { accessToken, refreshToken };
  }
  async saveToken(userId, refreshToken) {
    const isExisted = await tokenModel.findOne({ user: userId });
    if (isExisted) {
      isExisted.refreshToken = refreshToken;
      return isExisted.save();
    }
    const token = await tokenModel.create({ user: userId, refreshToken });
    return token;
  }
  async removeToken(refreshToken) {
    await tokenModel.findOneAndDelete({ refreshToken });
  }
  async findOneRefreshToken(refreshToken) {
    return await tokenModel.findOne({ refreshToken });
  }
  validateRefreshToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_KEY);
    } catch {
      return null;
    }
  }
  validateAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_ACCESS_KEY);
    } catch {
      return null;
    }
  }
}

module.exports = new TokenService();
