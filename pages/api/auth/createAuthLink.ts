import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler ( req: NextApiRequest, res: NextApiResponse ) {
    if(req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
    }

    try { 
        const frameRequest = req.body as FrameRequest;
        const input = frameRequest.untrustedData.inputText;
        const signedmessagebytes =  frameRequest.trustedData.messageBytes;

        res.writeHead(302, {
            Location: `${process.env.NEXTAUTH_URL}/?input=${input}&signedmessagebytes=${signedmessagebytes}`
        });
        res.end();
    } catch (error) {
        console.log('create Auth Link Error: ', req.body, error)
        console.error(`Error in createAuthLink: ${error}`)
        res.writeHead(302, {
            Location: `${process.env.NEXTAUTH_URL}/`
        });
        res.end();
    }
}

/**
 * Types taken from @coinbase/onchainkit/src/frame/types.ts
 */

interface FrameRequest {
  untrustedData: FrameData;
  trustedData: {
    messageBytes: string;
  };
}

interface FrameData {
  buttonIndex: number;
  castId: {
    fid: number;
    hash: string;
  };
  inputText: string;
  fid: number;
  messageHash: string;
  network: number;
  state: string;
  timestamp: number;
  transactionId?: string;
  url: string;
}