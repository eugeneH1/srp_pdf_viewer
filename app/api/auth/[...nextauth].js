import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

const options = {
    providers: [
        Providers.Credentials({
            // The name to display on the sign-in form (e.g. "Sign in with...")
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            authorize: async (credentials) => {
                // Add your own authentication logic here
                // For example, you can validate the credentials against a database
                const user = { id: 1, name: 'John Doe', email: 'john@example.com' };
                if (user) {
                    // Return the user object if authentication is successful
                    return Promise.resolve(user);
                } else {
                    // Return null if authentication fails
                    return Promise.resolve(null);
                }
            }
        })
    ],
    // Add any other NextAuth.js options here
};

export default (req, res) => NextAuth(req, res, options);