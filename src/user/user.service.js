const UserModel = require('./user.model');

class UserService {
  static async findUserById(id) {
    const user = await UserModel.findById(id);

    if (!user) {
      return { success: false, message: "User does not exist", data: user };
    }

    return { success: true, message: "", data: user };
  }

  static async findUserByLogin(login) {
    return UserModel.findOne({ login });
  }

  static async createNewUser(userData) {
    return new UserModel(userData).save();
  }
}

module.exports = UserService;