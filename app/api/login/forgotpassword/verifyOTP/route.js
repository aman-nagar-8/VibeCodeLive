import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db.js";
import crypto from "node:crypto";
import OTP from "@/models/OTP.model";
import { ratelimit } from "@/lib/rateLimiter";

export async function POST(req) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";

    const { success } = await ratelimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        { success: false, message: "Too many requests" },
        { status: 429 },
      );
    }
    await connectDB();
    const { email, otp } = await req.json();

    const userOTP = otp.join("");

    if (!email || !userOTP) {
      return NextResponse.json(
        { success: false, message: "Email or otp is required " },
        { status: 400 },
      );
    }

    const storedOTP = await OTP.findOne({ email });

    if (!storedOTP) {
      return NextResponse.json(
        { success: false, message: "Write a valid Email" },
        { status: 404 },
      );
    }

    if (new Date() > storedOTP.expiresAt) {
      return NextResponse.json(
        { success: false, message: "OTP expired" },
        { status: 400 },
      );
    }

    const otpHash = crypto.createHash("sha256").update(userOTP).digest("hex");

    if (otpHash !== storedOTP.otpHash) {
      return NextResponse.json(
        { success: false, message: "Invalid OTP" },
        { status: 400 },
      );
    }

    const resetToken = crypto.randomUUID();
    storedOTP.resetToken = resetToken;
    await storedOTP.save();

    return NextResponse.json(
      {
        success: true,
        message: "OTP verified successfully",
        resetToken,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in verifyOTP route ", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
