import { Auth } from "aws-amplify";
import { jwtDecode } from 'jwt-decode';   

// per amplify advanced workflow docs: https://docs.amplify.aws/javascript/prev/build-a-backend/auth/advanced-workflows/
export const handleGoogleSignIn = async (googleCredential: string): Promise<Boolean> => {
  const token = jwtDecode(googleCredential) as any;
  const user = {
    email: token.email,
    name: token.name
  };
  await Auth.federatedSignIn(
    'google',
    { token: googleCredential, expires_at: token.exp },
    user
  );
  const currentUser = await Auth.currentAuthenticatedUser();
  console.log(currentUser);
  if (currentUser)
    return true;
  return false;
}