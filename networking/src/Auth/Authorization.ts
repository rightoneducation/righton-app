import { signInWithRedirect, fetchAuthSession } from "aws-amplify/auth";
import { jwtDecode } from 'jwt-decode';   

// per amplify advanced workflow docs: https://docs.amplify.aws/javascript/prev/build-a-backend/auth/advanced-workflows/
export const handleGoogleSignIn = async (googleCredential: string): Promise<Boolean> => {
  const token = jwtDecode(googleCredential) as any;
  console.log(token);
  await signInWithRedirect(
    {provider: 'Google'}
  );
  console.log('Authenticated with Google:');
  const currentUser = await fetchAuthSession();
  console.log(currentUser);
  if (currentUser)
    return true;
  return true;
}