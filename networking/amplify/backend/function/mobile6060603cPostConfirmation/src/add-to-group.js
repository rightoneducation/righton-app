const {
  CognitoIdentityProviderClient,
  AdminAddUserToGroupCommand,
  GetGroupCommand,
  CreateGroupCommand,
} = require('@aws-sdk/client-cognito-identity-provider');
const AWS = require('aws-sdk');

const cognitoIdentityServiceProvider = new CognitoIdentityProviderClient({});
const cognito = new AWS.CognitoIdentityServiceProvider();

/**
 * @type {import('@types/aws-lambda').PostConfirmationTriggerHandler}
 */
exports.handler = async (event) => {
  const groupParams = {
    GroupName: process.env.GROUP,
    UserPoolId: event.userPoolId,
  };
  const addUserParams = {
    GroupName: process.env.GROUP,
    UserPoolId: event.userPoolId,
    Username: event.userName,
  };
  console.log(event);
  /**
   * Check if the group exists; if it doesn't, create it.
   */
  try {
    await cognitoIdentityServiceProvider.send(new GetGroupCommand(groupParams));
  } catch (e) {
    await cognitoIdentityServiceProvider.send(new CreateGroupCommand(groupParams));
  }
  /**
   * Then, add the user to the group.
   */
  await cognitoIdentityServiceProvider.send(new AdminAddUserToGroupCommand(addUserParams));
  const forceUserAutoConfirm = event.request.userAttributes["cognito:user_status"] === "EXTERNAL_PROVIDER";

  if (forceUserAutoConfirm) {
      const params =  {
          UserAttributes: [
              {
                  Name: "email_verified",
                  Value: "true"
              },
              {
                  Name: "phone_number_verified",
                  Value: "true"
              }
          ],
          UserPoolId: event.userPoolId,
          Username: event.userName
      }

      cognito.adminUpdateUserAttributes(params, function(err, data) {
          if (err) {
              console.log(err, err.stack); // an error occurred
          } else {
              console.log(data);           // successful response
          }
      }
      );
  }
  return event;
};
