import { NextResponse } from "next/server";
import { emailSchema, passwordSchema } from "@/utils/registerSchema";
import { success } from "zod";
import User from "@/models/User.model.js";
import bcrypt from "bcrypt";
import OTP from "@/models/OTP.model";

export async function POST(req) {
  try {
    const {
      email: userEmail,
      password: userPassword,
      resetToken,
    } = await req.json();

    if (!userEmail || !userPassword) {
      return NextResponse.json(
        { success: false, message: "Email or Password is required " },
        { status: 400 },
      );
    }

    if (!resetToken) {
      return NextResponse.json(
        { success: false, message: "OTP verifiction is required" },
        { status: 400 },
      );
    }

    const emailResult = emailSchema.safeParse({ email: userEmail });
    if (!emailResult.success) {
      return NextResponse.json(
        { success: false, message: "Invail Email Format" },
        { status: 400 },
      );
    }
    const { email } = emailResult.data;

    const passwordResult = passwordSchema.safeParse({ password: userPassword });
    if (!passwordResult.success) {
      return NextResponse.json(
        { success: false, message: "Invail Password Format" },
        { status: 400 },
      );
    }
    const { password } = passwordResult.data;

    const otpInfo = await OTP.findOne({ email });
    console.log(otpInfo);

    if (otpInfo.resetToken !== resetToken) {
      return NextResponse.json(
        { success: false, message: "Reset Token is invaild" },
        { status: 400 },
      );
    }

    const user = await User.findOne({ email }, { password: 1 });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Email does not exist" },
        { status: 404 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    await user.save();

    return NextResponse.json(
      { success: true, message: "Password updated successfully!" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in login/changepassword route : ", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
