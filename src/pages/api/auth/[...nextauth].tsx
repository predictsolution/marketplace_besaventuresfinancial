import Users from '@models/Users';
import database from '@utils/db';
import { get } from 'http';
import NextAuth, { User } from 'next-auth';
import { AdapterUser } from 'next-auth/adapters';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getCsrfToken } from 'next-auth/react';
import { SiweMessage } from 'siwe';

export default async function auth(req: any, res: any) {
  const providers = [
    CredentialsProvider({
      name: 'Ethereum',
      credentials: {
        message: {
          label: 'Message',
          type: 'text',
          placeholder: '0x0',
        },
        signature: {
          label: 'Signature',
          type: 'text',
          placeholder: '0x0',
        },
      },
      async authorize(credentials) {
        try {
          const siwe = new SiweMessage(
            JSON.parse(credentials!.message || '{}')
          );
          const nextAuthUrl = new URL(
            process.env.NEXTAUTH_URL != undefined
              ? process.env.NEXTAUTH_URL
              : 'https://dapp.besagaming.com'
          );

          const result = await siwe.verify({
            signature: credentials?.signature || '',
            domain: nextAuthUrl.host,
            nonce: await getCsrfToken({ req }),
          });

          if (result.success) {
            await database.connect();

            const user = await Users.findOne({
              user_address: siwe.address,
            });

            // If user does not exist, create it
            if (!user) {
              const newUser = new Users({
                user_address: siwe.address,
              });

              await newUser.save();

              if (newUser) {
                return {
                  id: siwe.address,
                  email: null,
                  create_at: newUser.createdAt,
                };
              }

              await database.disconnect();

              throw new Error('Error creating user. Try again later.');
            }

            await database.disconnect();

            return {
              id: user.user_address,
              email: user.user_email,
              create_at: user.createdAt,
            };
          }

          return null;
        } catch (e) {
          console.log(e);
          throw new Error('Error verifying signature. Try again later.');
        }
      },
    }),
  ];

  // Hide Sign-In with Ethereum from default sign page
  const isDefaultSigninPage =
    req.method === 'GET' &&
    req.query.nextauth.includes('signin') &&
    !req.url.includes('updateEmail');

  if (isDefaultSigninPage) {
    providers.pop();
  }

  return await NextAuth(req, res, {
    providers,
    session: {
      strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      async jwt({
        token,
        user,
      }: {
        token: JWT;
        user?: User | AdapterUser | undefined;
      }) {
        // Get url
        const getUrl = req.url;

        // Add = to url for production
        if (
          token.created_at == undefined ||
          getUrl == '/api/auth/session?updateEmail='
        ) {
          try {
            await database.connect();

            const userFetch = await Users.findOne(
              {
                user_address: token.sub,
              },
              {
                _id: 1,
                user_address: 1,
                user_email: 1,
                createdAt: 1,
              }
            );

            if (userFetch) {
              token._id = userFetch._id;
              token.address = userFetch.user_address;
              token.email = userFetch.user_email;
              token.created_at = userFetch.createdAt;

              await database.disconnect();

              return token;
            }
          } catch (error) {
            await database.disconnect();
            console.log('ERROR EN JWT');
            console.log(error);
          }
        }

        return token;
      },
      async session({ session, token }: { session: any; token: any }) {
        session.user._id = token._id;
        session.user.email = token.email;
        session.user.address = token.address;
        session.user.created_at = token.created_at;
        return session;
      },
    },
  });
}
