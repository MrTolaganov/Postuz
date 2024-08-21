const { hash, compare } = require("bcryptjs");
const userModel = require("../models/user.model");
const UserDto = require("../dtos/user.dto");
const tokenService = require("./token.service");
const mailService = require("./mail.service");
const BaseError = require("../errors/base.error");

class AuthService {
  async register(email, password) {
    const isExisted = await userModel.findOne({ email });
    if (isExisted) throw BaseError.BadRequest("User already registered");
    const hashedPassword = await hash(password, 10);
    const user = await userModel.create({ email, password: hashedPassword });
    const userDto = new UserDto(user);
    await mailService.sendMail(
      email,
      `${process.env.API_URL}/api/auth/activate/${userDto.id.toString()}`
    );
    const tokens = tokenService.generateToken({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { user: userDto, ...tokens };
  }
  async activate(userId) {
    const user = await userModel.findById(userId);
    if (!user) throw BaseError.BadRequest("User is not defined");
    user.isActivated = true;
    await user.save();
  }
  async login(email, password) {
    const user = await userModel.findOne({ email });
    if (!user) throw BaseError.BadRequest("User has not registered");
    const correctPass = await compare(password, user.password);
    if (!correctPass) throw BaseError.BadRequest("Password is incorrect");
    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { user: userDto, ...tokens };
  }
  async logout(refreshToken) {
    await tokenService.removeToken(refreshToken);
  }
  async refresh(refreshToken) {
    if (!refreshToken) throw BaseError.UnAuthorizedError("Bad authorization");
    const userPayload = tokenService.validateRefreshToken(refreshToken);
    const foundRefreshToken = await tokenService.findOneRefreshToken(refreshToken);
    if (!userPayload || !foundRefreshToken) throw BaseError.UnAuthorizedError("Bad authorization");
    const user = await userModel.findById(userPayload.id);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { user: userDto, ...tokens };
  }
  async getUsers() {
    const users = await userModel.find();
    return users;
  }
  async forgotPass(email) {
    const user = await userModel.findOne({ email });
    if (!user) throw BaseError.BadRequest("User has not registered with this email");
    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({ ...userDto });
    await mailService.sendForgotPass(
      email,
      `${process.env.CLIENT_URL}/recovery-account/${tokens.accessToken}`
    );
  }
  async recoveryAcc(token, password) {
    const userData = tokenService.validateAccessToken(token);
    if (!userData) throw BaseError.UnAuthorizedError();
    const hashedPassword = await hash(password, 10);
    await userModel.findByIdAndUpdate(userData.id, { password: hashedPassword });
  }
}

module.exports = new AuthService();
