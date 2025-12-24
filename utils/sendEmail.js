import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App password
      },
    });

    await transporter.sendMail({
      from: `"VibeCodeLive" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    return NextResponse.json({
      status: 200,
      data: null,
      message: "We’ve sent a verification link to your email. Please verify to continue.",
      success: true,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      error: error,
      message: "Failed to send email. Please try again.",
      success: false,
    });
  }
};
