import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      /** The user's postal address. */
      _id: string;
      address: string;
      created_at: string;
    } & DefaultSession['user'];
  }
}
