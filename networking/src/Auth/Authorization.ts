import { signInWithRedirect, fetchUserAttributes } from "aws-amplify/auth";
import { jwtDecode } from 'jwt-decode';   

// per amplify advanced workflow docs: https://docs.amplify.aws/javascript/prev/build-a-backend/auth/advanced-workflows/
export const handleGoogleSignIn = async (googleCredential: string): Promise<Boolean> => {
  const token = jwtDecode(googleCredential) as any;
  console.log(token);
  await signInWithRedirect(
    {provider: 'Google'}
  );
  const currentUser = await fetchUserAttributes();
  if (currentUser)
    return true;
  return false;
}