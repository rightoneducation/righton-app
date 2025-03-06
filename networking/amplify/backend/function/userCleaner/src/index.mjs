import AWS from 'aws-sdk'; // Use ES Module syntax
import { fetchAuthSession, fetchUserAttributes } from 'aws-amplify/auth';

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
export const handler = async (event) => {
  try {
    // console.log("Starting the delete user data process");

    // Verify the authentication session and get the current user nickname
    const isAuthenticated = await verifyAuth();
    // console.log(isAuthenticated)
    if (isAuthenticated == false) {
    //   return {
    //     statusCode: 401,
    //     body: JSON.stringify({ message: "User is not authenticated" }),
    //   };
        console.log("User is not Authenticated")
    }

    const userNickname = await getUserNickname();
    console.log(userNickname)
    if (!userNickname) {
    //   return {
    //     statusCode: 400,
    //     body: JSON.stringify({ message: "User nickname not found" }),
    //   };
        console.log("User nickname not found")
    }

    // Proceed with deletion of user data here...

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "User data deletion process completed." })
    };

  } catch (error) {
    console.error("Error deleting user data:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error", error: error.message }),
    };
  }
};

// Correctly defining verifyAuth outside the handler
async function verifyAuth() {
    try {
      const session = await fetchAuthSession();
      return !!session?.tokens?.accessToken; // If accessToken exists, user is authenticated
    } catch (error) {
      console.error("Error verifying auth:", error);
      return false;
    }
  }

//   async function getUserNickname() {
//     try {
//       const attributes = await fetchUserAttributes();
//       console.log("User Attributes:", attributes);
//       if (attributes && attributes.nickname !== undefined) {
//         return attributes.nickname;
//       } else {
//         return null; // Ensure undefined is converted to null
//       }
//     } catch (error) {
//       console.error("Error fetching user attributes:", error);
//       return null;
//     }
//   }