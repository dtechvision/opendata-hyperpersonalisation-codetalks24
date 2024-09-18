# Hyperpersonalised E-Commerce

This example app shows how to use Sign In With Farcaster in a Next.js app with a backend API, using [NextAuth.js](https://next-auth.js.org/) for authentication.

In addition it illustrates how one can use Open Data on Web3 Networks like Ethereum and Farcaster to hyperpersonalise an E-Commerce Store Front.

## Getting Started

```sh
bun install
bun run dev
```

Make sure you're `.env` is properly set.

For illustration purposes the following `.env` can be used.

```
NEXTAUTH_SECRET='760...'
NEXTAUTH_URL='http://localhost:3000'
NEYNAR_API_KEY='NEYNAR_API_DOCS'
```
which is also present in `.env.sample`

You likely want to configure the NEXTAUTH_URL yourself and set it to your actual domain.

## Questions?

Reach out to [Samuel Huber](https://warpcast.com/samuellhuber) or us directly at [dtech.vision](https://dtech.vision)

To learn more on how this was built the detailled documentation to consult is as follows:

- [Authentification Tutorial](https://dtech.vision/farcaster/frames/authentication-from-frames-with-nextauth/)
- [Farcaster Frames](https://dtech.vision/farcaster/frames/howdofarcasterframeswork/)
- [Farcaster Data from Hubs](https://dtech.vision/farcaster/hubs/howdofarcasterhubswork/)
- [Ethereum Data? use Viem](https://viem.sh/)