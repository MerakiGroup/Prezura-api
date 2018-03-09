"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _amazonCognitoIdentityJs = require("amazon-cognito-identity-js");

var _config = require("../core/config/config.aws");

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cognitoService = {};

cognitoService.signUp = function (username, password) {
  var userPool = new _amazonCognitoIdentityJs.CognitoUserPool({
    UserPoolId: _config2.default.AWS.Cognito.userPoolId,
    ClientId: _config2.default.AWS.Cognito.clientId
  });

  var attributeEmail = new _amazonCognitoIdentityJs.CognitoUserAttribute({
    Name: "email",
    Value: username
  });

  userPool.signUp(username, password, [attributeEmail]).promise();
};

exports.default = cognitoService;