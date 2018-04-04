const userService = {};

userService.getUserById = (model, id) => model.find({ cognitoId: id });

export default userService;
