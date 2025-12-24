import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import User from "@/models/User.model.js";
import { connectDB } from "@/lib/db.js";
import { generateAccessToken, generateRefreshToken } from "@/lib/tokens";
import { hashToken } from "@/lib/hashToken";
import RefreshToken from "@/models/RefreshToken";

export async function POST(req) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({
        status: 400,
        error: null,
        message: "All fields are required",
        success: false,
      });
    }

    // Check if user exists
    const user = await User.findOne({ email: email.trim() }).select(
      "+password"
    );

    if (!user) {
      return NextResponse.json({
        status: 404,
        error: null,
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({
        status: 401,
        error: null,
        message: "Invalid email or password",
        success: false,
      });
    }

    // generate token
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // save token in db
    await RefreshToken.create({
      userId: user._id,
      tokenHash: hashToken(refreshToken),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // make response
    const response = NextResponse.json({
      status: 200,
      message: "Login successful",
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      success: true,
    });

    console.log("refresh token : ", refreshToken);
    // add refresh token in cookies
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/", // ALWAYS "/"
      maxAge: 60 * 60 * 24 * 7, // 7 days (seconds)
    });

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
