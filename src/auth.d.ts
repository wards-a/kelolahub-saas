import NextAuth from 'next-auth'; // Wajib diimport

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
    } & DefaultSession['user'];
  }

  interface JWT {
    id?: string;
    email?: string;
    name?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    email?: string;
    name?: string;
  }
}