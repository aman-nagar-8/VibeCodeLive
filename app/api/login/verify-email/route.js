import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User.model.js";
import EmailVerification from "@/models/EmailVerification";
import { cleanupExpiredEmailVerifications } from "@/lib/cleanupEmailVerifications";

export async function GET(req) {
  try {
    await connectDB();
    // delete expiry token from db
    await cleanupExpiredEmailVerifications();

    // get token
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    // check token
    if (!token) {
      console.log("toekn :", token);
      return NextResponse.json(
        { message: "Invalid or missing token" },
        { status: 400 }
      );
    }

    // hash token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // find token in emailverification
    const verificationUser = await EmailVerification.findOne({
      verificationToken: hashedToken,
      tokenExpiry: { $gt: Date.now() },
    });

    // check if expiry or not
    if (!verificationUser) {
      return NextResponse.json(
        { message: "Token expired or invalid" },
        { status: 400 }
      );
    }
  
    // check if user exist
    const existUser = await User.findOne({email:verificationUser.email})
    console.log(existUser)

    if(existUser){
      await EmailVerification.deleteOne({ _id: verificationUser._id });
      return NextResponse.json({
      status:200,
      message: "Email already verified. Please log in.",
      success:true,
      data:existUser,
    });
    }

    // Create user
    const user = await User.create({
      name: verificationUser.name,
      email: verificationUser.email,
      password: verificationUser.password,
    });

    await user.save();

    //delete emailverifications 
    await EmailVerification.deleteOne({ _id: verificationUser._id });


    return NextResponse.json({
      status:200,
      message: "Email verified. Please log in.",
      success:true
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
