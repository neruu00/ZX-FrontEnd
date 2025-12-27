import { MongoDBAdapter } from '@auth/mongodb-adapter';
import { ObjectId } from 'mongodb';
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

import { authConfig } from './auth.config';
import { clientPromise, getCollection } from './lib/mongodb';

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
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  events: {
    async createUser({ user }) {
      const collection = await getCollection('users');
      collection.updateOne(
        {
          _id: new ObjectId(user.id),
        },
        {
          $set: {
            createdAt: new Date(),
          },
        },
      );
    },
  },
  callbacks: {
    // JWT 생성 및 갱신 시 실행
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // User ID를 토큰에 저장
        token.createdAt = user.createdAt;
      }
      return token;
    },

    // 클라이언트에서 세션 조회(useSession) 시 실행
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.createdAt = token.createdAt as Date;
      }
      return session;
    },
  },
});
