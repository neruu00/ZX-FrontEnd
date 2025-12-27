import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  // Session 객체 확장
  interface Session {
    user: {
      createdAt?: Date; // createdAt 필드 추가
    } & DefaultSession['user'];
  }

  // User 객체 확장 (DB에서 넘어오는 타입)
  interface User {
    createdAt?: Date;
  }
}

declare module 'next-auth/jwt' {
  // JWT 토큰 확장
  interface JWT {
    createdAt?: Date;
  }
}
