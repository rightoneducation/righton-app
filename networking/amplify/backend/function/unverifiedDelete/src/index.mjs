import { CognitoIdentityProviderClient, AdminDeleteUserCommand } from '@aws-sdk/client-cognito-identity-provider';

const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.REGION || 'us-east-1' });

export const handler = async (event) => {
  try {
    const { email } = event.arguments.input;
    
    if (!email) {
      throw new Error('Email is required');
    }

    // Delete the user from Cognito
    const deleteCommand = new AdminDeleteUserCommand({
      UserPoolId: process.env.USER_POOL_ID, // We need to set this in our lambda function.
      Username: email
    });

    await cognitoClient.send(deleteCommand);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `User ${email} deleted successfully`
      }),
    };
  } catch (error) {
    console.error('Error deleting user:', error);
    
    let errorMessage = 'Failed to delete user';
    if (error.name === 'UserNotFoundException') {
      errorMessage = 'User not found';
    } else if (error.name === 'NotAuthorizedException') {
      errorMessage = 'Not authorized to delete users';
    }

    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({
        message: errorMessage,
        error: error.message
      }),
    };
  }
};