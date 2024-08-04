import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { sql } from '@vercel/postgres';
import { JWT } from 'next-auth/jwt';
import { Session } from 'next-auth';

// Define the NextAuth options
const authOptions = {
  session: {
    strategy: 'jwt' as const,
  },
  pages: {
    signIn: '/login',
    error: '/login',  // Redirect to login on error
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials) {
          throw new Error('No credentials provided');
        }

        const { email, password } = credentials;

        if (!email || !password) {
          throw new Error('Email or password is missing');
        }

        // Fetch user from your database
        const response = await sql`
          SELECT * FROM users WHERE email = ${email}`;
        if (response.rowCount === 0) {
          throw new Error('No user found with the given email');
        }
        const user = response.rows[0];

        // Compare the provided password with the stored hashed password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          throw new Error('Invalid password');
        }

        // Return the user object
        return { id: user.id, name: user.name, email: user.email, admin: user.admin };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.admin = user.admin;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && token.id && typeof token.admin !== 'undefined') {
        session.user.id = token.id;
        session.user.admin = token.admin;
      }
      return session;
    },
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
