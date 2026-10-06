/**
 * One account per email: whichever sign-in method an email registered with
 * first is the only one it can use.
 *
 * Cognito gives a Google sign-in (`google_<id>`) and an email/password user
 * different subs, so without this the same teacher gets two User rows and two
 * sets of classrooms. Linking was considered and rejected: it only works
 * Google → native, and linking here fails the first Google sign-in. Instead the
 * second method is refused, in both directions, the same way central_v2's
 * PreSignup trigger refuses duplicates.
 *
 * Errors are `CODE|message`: the app shows the half after the `|` (AuthGuard for
 * the Google redirect, awsSignUp for the email form).
 *
 * PreSignUp runs whenever a Cognito user is about to be created, so a first
 * Google sign-in from /login is covered as well as one from /signup. Admin-created
 * users (PreSignUp_AdminCreateUser) pass through untouched.
 */
const {
  CognitoIdentityProviderClient,
  ListUsersCommand,
  AdminDeleteUserCommand,
} = require('@aws-sdk/client-cognito-identity-provider');

const client = new CognitoIdentityProviderClient({});

const isGoogleUser = (user) => user.Username.toLowerCase().startsWith('google_');

exports.handler = async (event) => {
  const email = event.request.userAttributes.email?.trim().toLowerCase();
  if (!email) return event;

  const { Users = [] } = await client.send(new ListUsersCommand({
    UserPoolId: event.userPoolId,
    // Quotes in an email would break the filter expression; such an address
    // cannot match an existing user anyway.
    Filter: `email = "${email.replace(/"/g, '')}"`,
  }));
  const google = Users.filter(isGoogleUser);
  const native = Users.filter((user) => !isGoogleUser(user));

  if (event.triggerSource === 'PreSignUp_ExternalProvider') {
    if (native.some((user) => user.UserStatus === 'CONFIRMED')) {
      throw new Error('EMAIL_ACCOUNT_EXISTS|This email already has an account. Log in with your email and password.');
    }
    // An email signup that never confirmed its code proved nothing about the
    // address; Google has. Clear it rather than lock the email out of both
    // methods.
    const abandoned = native.filter((user) => user.UserStatus === 'UNCONFIRMED');
    await Promise.all(abandoned.map((user) => client.send(new AdminDeleteUserCommand({
      UserPoolId: event.userPoolId,
      Username: user.Username,
    }))));
  }

  if (event.triggerSource === 'PreSignUp_SignUp' && google.length > 0) {
    throw new Error('GOOGLE_ACCOUNT_EXISTS|This email is registered with Google. Use Continue with Google.');
  }

  return event;
};
