import NextAuth, { SessionStrategy } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt, { compare } from 'bcrypt';
import { sql } from '@vercel/postgres';
import { Session } from 'inspector';

const authOptions = {
  session: {
    strategy: 'jwt' as SessionStrategy,
  },
  pages: {
    signIn: '/login',
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
          console.log('Password', password);
          console.log('User password', user.password);
          const hashedPassword = bcrypt.hash(password, 10);
          console.log('Hashed password', hashedPassword);
          const isValidPassword = await compare(password, user.password);
          if (!isValidPassword) {
            throw new Error('Invalid password');
          }

          // Return the user object
          return { id: user.id, name: user.name, email: user.email };
        } catch (error) {
          console.error('Error during authorization:', error);
          return null;
        }
      }
    })
  ]
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };