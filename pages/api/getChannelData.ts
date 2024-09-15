import { NextApiRequest, NextApiResponse } from 'next';
import { createObjectCsvStringifier } from 'csv-writer';

import { NeynarAPIClient } from "@neynar/nodejs-sdk";
import { getSession } from 'next-auth/react';
import { useProfile } from '@farcaster/auth-kit';

import storeInputInGoogleSheet from '../../utils/logGoogleSheets';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const session = await getSession({ req });
    if (!session) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.method === 'GET') {
        let { channel } = req.query;
        let channelName = channel as string;

        if (channelName) {
            try {
                const neynar = new NeynarAPIClient(process.env.NEYNAR_API_KEY!!);
                const data: Array<{ channelName: string, fname: string, fid: number, ethAddresses: string, solAddresses: string, bio: string }> = [];
                let cursor;

                let userFname = session.user?.name!!;
                storeInputInGoogleSheet('getChannelData', userFname, channelName)
                
                do {
                    const response = await neynar.fetchFollowersForAChannel(channelName, { cursor, limit: 1000 });
                    response.users.forEach((user) => {
                        data.push({
                            channelName: channelName,
                            fname: user.username,
                            fid: user.fid,
                            ethAddresses: user.verified_addresses.eth_addresses.join(', '),
                            solAddresses: user.verified_addresses.sol_addresses.join(', '),
                            bio: user.profile.bio.text,
                        });
                    });

                    cursor = response.next?.cursor;

                } while (cursor);

                const csvStringifier = createObjectCsvStringifier({
                    header: [
                        { id: 'channel', title: 'Channel' },
                        { id: 'fname', title: 'First Name' },
                        { id: 'fid', title: 'ID' },
                        { id: 'ethAddresses', title: 'ETH Addresses' },
                        { id: 'solAddresses', title: 'SOL Addresses' },
                        { id: 'bio', title: 'Profile Bio' },
                    ],
                });

                const csv = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(data);
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', `attachment; filename=${channelName}.csv`);
                res.status(200).send(csv);
            } catch (error) {
                console.error('Error fetching channel data: ', error);
                res.status(500).json({ error: 'Error fetching channel data' });
            }
        } else {
            res.status(400).json({ error: 'Missing channel parameter' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}