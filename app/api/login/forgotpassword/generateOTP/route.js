import { NextResponse } from "next/server";
import User from "@/models/User.model.js";
import { connectDB } from "@/lib/db.js";
import { emailSchema } from "@/utils/registerSchema";
import { sendEmail } from "@/utils/sendEmail";
import { changePasswordTemplate } from "@/utils/changePasswordTemplate";
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
    const userData = await req.json();
    const result = emailSchema.safeParse(userData);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: "Invaild Email, please write correct one" },
        { status: 400 },
      );
    }

    const { email } = result.data;

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Email does not exist" },
        { status: 404 },
      );
    }

    await OTP.findOneAndDelete({ email });

    const otp = crypto.randomInt(100000, 1000000).toString();

    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    await OTP.create({
      email,
      otpHash,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min
    });

    const response = await sendEmail({
      to: email,
      subject: "Change Password in VibeCodeLive",
      html: changePasswordTemplate(otp),
    });

    return response;
  } catch (error) {
    console.error("Error in generateOTP route : ", error);
    return NextResponse.json(
      { success: false, message: "Interal Server Error" },
      { status: 500 },
    );
  }
}
