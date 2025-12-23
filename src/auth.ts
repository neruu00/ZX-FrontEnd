import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import { clientPromise } from './lib/mongodb';
import Google from 'next-auth/providers/google';
import { authConfig } from './auth.config';

/**
 * Google only provides Refresh Token
 * to an application the first time a user signs in.
 *
 * To force Google to re-issue a Refresh Token,
 * the user needs to remove the application
 *
 * from their account and sign in again:
 * https://myaccount.google.com/permissions
 */

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    newUser: '/signup',
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_OAUTH_ID,
      clientSecret: process.env.GOOGLE_OAUTH_SECRET,
    }),
    CredentialsProvider({
      async authorize(credentials) {
        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/login`;

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: credentials.username,
            password: credentials.password,
          }),
        });

        if (!response.ok) {
          return null;
        }

        const user = await response.json();
        return {
          email: user.id,
          name: user.nickname,
          image: user.image,
          ...user,
        };
      },
    }),
  ],
});
