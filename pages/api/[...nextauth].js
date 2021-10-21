import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { ConnectToDB } from "../../lib/connect-to-db";

export default NextAuth({
  session: {
    jwt: true,
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",

      async authorize(credentials, req) {
        const connectDB = ConnectToDB("auth/login/email");
        const res = await fetch(connectDB, {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" },
        });
        const user = await res.json();

        // if(!user) {
        //     throw new Error('No User Found')
        // }

        // If no error and we have user data, return it
        if (res.ok && user) {
          return user;
        }
        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],
});
