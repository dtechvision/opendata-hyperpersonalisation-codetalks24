import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createAppClient, viemConnector } from "@farcaster/auth-client";
import { NextApiRequest, NextApiResponse } from "next";
import { NeynarAPIClient } from "@neynar/nodejs-sdk";

export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
      CredentialsProvider({
        name: "Sign in with Farcaster",
        credentials: {
          message: {
            label: "Message",
            type: "text",
            placeholder: "0x0",
          },
          signature: {
            label: "Signature",
            type: "text",
            placeholder: "0x0",
          },
          // In a production app with a server, these should be fetched from
          // your Farcaster data indexer rather than have them accepted as part
          // of credentials.
          name: {
            label: "Name",
            type: "text",
            placeholder: "0x0",
          },
          pfp: {
            label: "Pfp",
            type: "text",
            placeholder: "0x0",
          },
        },
        async authorize(credentials) {
          const {
            body: { csrfToken },
          } = req;

          const appClient = createAppClient({
            ethereum: viemConnector(),
          });

          const verifyResponse = await appClient.verifySignInMessage({
            message: credentials?.message as string,
            signature: credentials?.signature as `0x${string}`,
            domain: "dtech.vision",
            nonce: csrfToken,
          });
          const { success, fid } = verifyResponse;

          if (!success) {
            return null;
          }

          return {
            id: fid.toString(),
            name: credentials?.name,
            image: credentials?.pfp,
          };
        },
      }),
      // sign in with Farcaster Frame
      // used with link like: `https://dtech.vision/?signedmessagebytes=${signedmessagebytes}`
      CredentialsProvider({
        id: 'farcasterframe',
        name: 'Sign in with Farcaster Frame Message',
        credentials: {
          signedmessagebytes: { label: "Farcaster Signed Message Bytes", type: "text" },
        },
        authorize: async (credentials) => {
          try{
            const neynar = new NeynarAPIClient(process.env.NEYNAR_API_KEY!!);
            const response = await neynar.validateFrameAction(
              credentials?.signedmessagebytes as string,
              {
                castReactionContext: false,
                followContext: false,
                signerContext: false
              }
            );

            // shorten response types from Neynar (https://docs.neynar.com/reference/validate-frame)
            const action = response.action;
            const interactor = action?.interactor;
            console.log('login attempt by: ', interactor.username)

            // Convert ISO string to Unix time
            const actionTimestamp = new Date(action.timestamp).getTime();

            // Farcaster timestamp is seconds since Unix epoch, while Date.now is milliseconds since Unix epoch
            if (((actionTimestamp * 1000) + (1000 * 60 * 5)) < Date.now().valueOf()) {
              // don't allow messages older than 5 minutes, .valueOf() for UTC
              console.error('actionTimestamp too old. Timestamp:', actionTimestamp, 'Now:', Date.now().valueOf());
              return null;
            }

            console.log('Login the user: ', interactor?.username);
            return {
              id: interactor?.fid.toString(),
              name: interactor?.username,
              image: interactor?.pfp_url,
            };
          } catch (error) {
            console.error(`Error in authorize farcasterframe: ${error}`);
            return null;
          }
        },
      }),
    ],
  });
