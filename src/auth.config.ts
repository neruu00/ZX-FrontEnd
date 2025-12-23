import { NextAuthConfig } from 'next-auth';

/**
 * NOTE NextAuth 설정 파일 분할
 * Edge Runtime이 Node.js의 모든 모듈을 처리하지 못함
 * crypto, bcrypto, mongoDB 등이 이에 해당함
 */
export const authConfig = {
  pages: {
    signIn: '/login',
    newUser: '/signup',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnHome = nextUrl.pathname.startsWith('/home');

      if (isOnHome) {
        if (isLoggedIn) return true;
        return false;
      }
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
