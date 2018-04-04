import {
  CognitoUserPool,
  CognitoUserAttribute
} from "amazon-cognito-identity-js";

import config from "../core/config/config.aws";

const cognitoService = {};

cognitoService.signUp = (username, password) => {
  const userPool = new CognitoUserPool({
    UserPoolId: config.AWS.Cognito.userPoolId,
    ClientId: config.AWS.Cognito.clientId
  });
  const attributeEmail = new CognitoUserAttribute({
    Name: "email",
    Value: username
  });

  return new Promise((resolve, reject) => {
    userPool.signUp(
      username,
      password,
      [attributeEmail],
      null,
      (err, result) => {
        if (err) {
          reject({ isCognito: true, err });
          return;
        }
        resolve(result);
      }
    );
  });
};

export default cognitoService;
