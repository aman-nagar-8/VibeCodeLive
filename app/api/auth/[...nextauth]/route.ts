import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/lib/db.js";
import User from "@/models/User.model.js";
import { JWT } from "next-auth/jwt";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user }: { user: any }) {
      await connectDB();
      const isUser = await User.findOne({ email: user.email });
      if (!isUser) {
        const newUser = new User({
          name: user.name,
          email: user.email,
          provider: "google",
        });
        await newUser.save();
      }
      return true;
    },
    async jwt({ token, user }: { token: JWT; user: any }) {
      try {
        await connectDB();
        if (user) {
          const res = await fetch(`${process.env.APP_URL}/api/auth/set-refresh-token`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: user.email }),
          });

          const data = await res.json();
          token.accessToken = data.accessToken;
          token.refreshToken = data.refreshToken;
          token.userId = data.user.id;
        }

        return token;
      } catch (error) {
        console.error("Error in JWT callback:", error);
        return token;
      }
    },
    async session({ session, token }: { session: any; token: JWT }) {
      session.accessToken = token.accessToken;
      session.user.id = token.userId;

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
