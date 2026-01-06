import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import User from "@/models/User.model.js";
import { connectDB } from "@/lib/db.js";
import { registerSchema } from "@/utils/registerSchema";
import crypto from "node:crypto";
import { sendEmail } from "@/utils/sendEmail";
import { verificationEmailTemplate } from "@/utils/verificationEmailTemplate";
import EmailVerification from "@/models/EmailVerification";

export async function POST(req) {
  try {
    await connectDB();
    

    const result = registerSchema.safeParse(await req.json());

    if (!result.success) {
      return NextResponse.json({
        status: 400,
        error: "Input from the user have some problem",
        message: "Invalid input",
        success: false,
      });
    }

    const { name, email, password } = result.data;

    // Validate fields
    if (!name || !email || !password) {
      return NextResponse.json({
        status: 400,
        error: "fields are empty from user input",
        message: "All fields are required",
        success: false,
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({
        status: 409,
        error: "With is email user already exist",
        message: "Email already registered",
        success: false,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Generate & Store Verification Token
    const rawToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    // Create user
    const VerificationUser = await EmailVerification.create({
      name,
      email,
      password: hashedPassword,
      verificationToken: hashedToken,
      tokenExpiry: Date.now() + 15 * 60 * 1000,
    });

    await VerificationUser.save();

    // Verification URL

    const verifyUrl = `http://${process.env.APP_URL}/login/register/VerifyEmail?token=${rawToken}`;

    // send email
    const response = await sendEmail({
      to: email,
      subject: "Confirm your email 🚀",
      html: verificationEmailTemplate({name: name, verifyUrl:verifyUrl }),
    });

    return response;
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
