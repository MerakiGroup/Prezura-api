import cognitoService from "../services/cognito.services";
import UserModel from "../models/user.model";
import commondbService from "../services/commondb.service";
import userService from "../services/user.service";

import logger from "../core/logger/app-logger";

const userController = {};

userController.signup = async (req, res) => {
  console.log(req.body);
  const { username, password, name } = req.body;
  try {
    const user = await cognitoService.signUp(username, password);
    const userObj = {
      name,
      email: username,
      cognitoId: user.userSub
    };
    const savedUser = await commondbService.add(UserModel, userObj);
    res.status(200).json({
      error: false,
      message: "User Successfully created",
      data: { _id: savedUser._id, email: savedUser.email }
    });
  } catch (error) {
    if (error.isCognito) {
      res.status(404).json({ error: true, message: error.err.message });
      return;
    }
    res.status(500).json({ error: true, message: "Error occurred from DB" });
  }
};

userController.getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(UserModel, req.params.id);
    res.status(200).json({ error: false, data: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: error });
  }
};

export default userController;
