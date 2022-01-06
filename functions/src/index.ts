import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
admin.initializeApp();

export const helloWorld = functions.https.onRequest(
  async (request, response) => {
    functions.logger.info("Hello logs!", { structuredData: true });
    try {
      let user = await getAutenticatedUser(request);
      response.send(
        `<marquee scrollamount="50" style="font-weight: 700; color: green; font-size: 10vh;"> Hey ${user.email} you are allowed to call this function 😃🥳</marquee>`
      );
    } catch (e) {
      functions.logger.error(e);
      response.send(
        '<marquee scrollamount="50" style="font-weight: 700; color: red; font-size: 10vh;">😠 you are not authenticated!😠</marquee>'
      );
    }
  }
);

/**
 * Check if firebase authentication header is present and if it is present
 * verify the token with firestore returning the decoded user data
 * @param req request
 */
async function getAutenticatedUser(
  req: functions.https.Request
): Promise<admin.auth.DecodedIdToken> {
  const tokenId = req.get("Authorization");
  functions.logger.info(tokenId, { structuredData: true });

  if (!tokenId) {
    throw new Error("No authorization header found");
  }

  return admin.auth().verifyIdToken(tokenId.split("Bearer ")[1]);
}
