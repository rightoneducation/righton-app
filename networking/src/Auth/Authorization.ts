import { Auth } from "aws-amplify";
import { jwtDecode } from 'jwt-decode';   

// per amplify advanced workflow docs: https://docs.amplify.aws/javascript/prev/build-a-backend/auth/advanced-workflows/
export const handleGoogleSignIn = async (googleCredential: string): Promise<Boolean> => {
  const token = jwtDecode(googleCredential) as any;
  const user = {
    email: token.email,
    name: token.name
  };
  console.log('sup');
  console.log(user);
  console.log(token);
  console.log(googleCredential);
  await Auth.federatedSignIn(
    'google',
    { token: googleCredential, expires_at: token.exp },
    user
  );
  const currentUser = await Auth.currentAuthenticatedUser();
  if (currentUser)
    return true;
  return false;
}