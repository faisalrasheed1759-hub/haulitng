import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const AUTH_SECRET = process.env.AUTH_SECRET || (process.env.NODE_ENV === "development" ? "dev-secret-do-not-use-in-production" : undefined);

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!ADMIN_USER || !ADMIN_PASSWORD) {
          console.error("ADMIN_USER or ADMIN_PASSWORD not set");
          return null;
        }
        const { username, password } = credentials;
        if (username === ADMIN_USER && password === ADMIN_PASSWORD) {
          return { id: "1", name: "Admin", email: "admin@haulitng.com" };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.id;
      return session;
    },
  },
  session: { strategy: "jwt" },
  secret: AUTH_SECRET,
});
