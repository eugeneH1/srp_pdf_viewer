import NextAuth, { SessionStrategy } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';
import { sql } from '@vercel/postgres';
import { Session } from 'inspector';
import { redirect } from 'next/dist/server/api-utils';

const authOptions = {
  session: {
    strategy: 'jwt' as SessionStrategy,
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        try {
          if (!credentials) {
            throw new Error('No credentials provided');
          }

          const { email, password } = credentials;

          if (!email || !password) {
            throw new Error('Email or password is missing');
          }

          // Fetch user from your database
          const response = await sql`
            SELECT * FROM users WHERE email = ${email}`
          const user = response.rows[0];
          if (!user) {
            throw new Error('No user found with the given email');
          }

          // Compare the provided password with the stored hashed password
          const isValidPassword = await compare(password, user.password);
          if (!isValidPassword) {
            throw new Error('Invalid password');
          }

          // Return the user object
          return { id: user.id, name: user.name, email: user.email, admin: user.admin, };
        } catch (error) {
          console.error('Error during authorization:', error);
          return null;
        }
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
      if(token) {
      session.user.id = token.id;
      session.user.admin = token.admin;
      }
      return session;
    },
    // async redirect(url, baseUrl) {
    //   return url.startsWith(baseUrl) ? `${baseUrl}/books`: baseUrl;
    // },
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };