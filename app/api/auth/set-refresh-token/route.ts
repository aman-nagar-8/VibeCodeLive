import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db.js";
import User from "@/models/User.model.js";
import { generateAccessToken, generateRefreshToken } from "@/lib/tokens";
import { hashToken } from "@/lib/hashToken";
import RefreshToken from "@/models/RefreshToken.js";

export async function POST(req: Request) {
  await connectDB();

  const { email } = await req.json();

  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json({ message: "User not found",success: false }, { status: 404 });
  }

  const refreshToken = generateRefreshToken(user);
  const accessToken = generateAccessToken(user);

  await RefreshToken.create({
    userId: user._id,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  const response = NextResponse.json({
       status: 200,
       message: "Login successful",
       refreshToken,
       accessToken,
       user: {
         id: user._id,
         name: user.name,
         email: user.email,
       },
       success: true,
     });

  response.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}