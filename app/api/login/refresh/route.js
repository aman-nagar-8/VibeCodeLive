import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import RefreshToken from "@/models/RefreshToken";
import User from "@/models/User.model";
import { generateAccessToken, generateRefreshToken } from "@/lib/tokens";
import { hashToken } from "@/lib/hashToken";
import { success } from "zod";

export async function POST(req) {
  try {
    await connectDB();

    // 1️⃣ Get refresh token from cookies
    const refreshToken = req.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { message: "Refresh token missing" },
        { status: 401 }
      );
    }

    // 2️⃣ Verify refresh token signature
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      return NextResponse.json(
        { message: "Invalid refresh token" },
        { status: 401 }
      );
    }

    // // 3️⃣ Hash refresh token and find in DB
    const tokenHash = hashToken(refreshToken);

    const storedToken = await RefreshToken.findOne({
      tokenHash,
      // expiresAt: { $gt: new Date() },
    });

    if (!storedToken) {
      return NextResponse.json(
        { message: "Refresh token expired or revoked" },
        { status: 401 }
      );
    }

    // 4️⃣ Get user
    const user = await User.findById(storedToken.userId);

    if (!user) {
      await RefreshToken.deleteOne({ tokenHash });
      return NextResponse.json({ message: "User not found" }, { status: 401 });
    }

    // 6️⃣ Generate new access token
    const newAccessToken = generateAccessToken(user);

    // 7️⃣ Send response
    const response = NextResponse.json(
      {
        accessToken: newAccessToken,
      },
      { status: 200 }
    );

    // 5️⃣ ROTATE refresh token (important)
    const ROTATE_THRESHOLD = 24 * 60 * 60 * 1000; // 24 hours

    const shouldRotate =
      storedToken.expiresAt.getTime() - Date.now() < ROTATE_THRESHOLD;

    // Rotate ONLY if near expiry
    if (shouldRotate) {
      await RefreshToken.deleteOne({ tokenHash });

      const newRefreshToken = generateRefreshToken(user);
      const newRefreshTokenHash = hashToken(newRefreshToken);

      await RefreshToken.create({
        userId: user._id,
        tokenHash: newRefreshTokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      response.cookies.set("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/", // ALWAYS "/"
        maxAge: 60 * 60 * 24 * 7, // 7 days (seconds)
      });
    }
    
    return response;
  } catch (error) {
    console.error("Refresh token error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
