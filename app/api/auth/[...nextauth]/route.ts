import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/lib/db.js";
import User from "@/models/User.model.js";
import { generateAccessToken, generateRefreshToken } from "@/lib/tokens";
import { hashToken } from "@/lib/hashToken";
import RefreshToken from "@/models/RefreshToken";
import { NextResponse } from "next/server";
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
          provider: "google"
        });
        await newUser.save();
      }
      return true;
    },
    async jwt({ token, user }: { token: JWT; user: any }) {
      await connectDB();
      if (user) {
        const isUser = await User.findOne({ email: user.email });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // save token in db
        await RefreshToken.create({
          userId: isUser._id,
          tokenHash: hashToken(refreshToken),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
        token.accessToken = accessToken;
        token.refreshToken = refreshToken;
        token.userId = isUser._id;
      }

      return token;
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
