const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Env = require("../common/env");
const UserService = require("../user/user.service");

class AuthService {
  static async signUp({ login, password }) {
    const existingUser = await UserService.findUserByLogin(login);

    if (existingUser) {
      return { success: false, message: "Login is already taken", data: null };
    }

    const newUser = await UserService.createNewUser({ login, password });

    return { success: true, message: "", data: newUser };
  }

  static async signIn({ login, password }) {
    const user = await UserService.findUserByLogin(login);

    if (!user) {
      return {
        success: false,
        message: "User with this login does not exists",
        data: user,
      };
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return { success: false, message: "Wrong password", data: user };
    }

    return { success: true, message: "", data: user };
  }

  static async getAuthenticatedUser(accessToken, refreshToken) {
    try {
      const { id } = await jwt.verify(accessToken, Env.JWT_SECRET);
      return UserService.findUserById(id);
    } catch (e) {
      if (e instanceof jwt.TokenExpiredError) {
        try {
          const {id: refreshTokenStoredUserId, accessToken: refreshTokenStoredAccessToken} = await jwt.verify(
            refreshToken,
            Env.JWT_SECRET
          );
          const {id: accessTokenStoredUserId} = await jwt.verify(
            accessToken,
            Env.JWT_SECRET,
            {
              ignoreExpiration: true,
            }
          );

          if (accessTokenStoredUserId === refreshTokenStoredUserId && refreshTokenStoredAccessToken === accessToken) {
            return UserService.findUserById(accessTokenStoredUserId);
          } 
          throw e;
        } catch (e) {
          throw e;
        }
      } else {
        throw e;
      }
    }
  }

  static generateTokensPair(userId) {
    const accessToken = jwt.sign({ id: userId }, Env.JWT_SECRET, {
      expiresIn: "7d",
    });
    const refreshToken = jwt.sign({ id: userId, accessToken }, Env.JWT_SECRET, {
      expiresIn: "21d",
    });

    return { accessToken, refreshToken };
  }
}

module.exports = AuthService;
