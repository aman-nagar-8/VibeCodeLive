import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Meeting from "@/models/Meeting";
import User from "@/models/User.model.js";
import { connectDB } from "@/lib/db.js";
import { getUserFromRequest } from "@/lib/getUserFromRequest";

export async function POST(req) {
  try {
    await connectDB();

    // Get user from cookies
    const decodedUser = await getUserFromRequest(req);

    const adminUser = await User.findById(decodedUser.userId);
    if (!adminUser) {
      return NextResponse.json(
        { error: "Admin user not found" },
        { status: 404 }
      );
    }

    // Read data from frontend
    const { name, url , joinPolicy , status , requiredFields } = await req.json();

    if (!name || !url) {
      return NextResponse.json(
        { error: "Name and URL are required" },
        { status: 400 }
      );
    }

    // Create meeting
    const meeting = await Meeting.create({
      name,
      url,
      admin: adminUser._id,
      adminName: adminUser.name,
      joinPolicy,
      status,
      requiredFields,
      members: [adminUser._id], // Add admin as first member
      problems: [],
      data: {},
      createdAt: new Date(),
      requiresPassword: false,
    });

    const socketAuth = jwt.sign(
      { id: adminUser._id, meetingId: meeting._id, username: adminUser.name },
      process.env.SOCKET_JWT_SECRET,
      { expiresIn: "15m" }
    );

    return NextResponse.json(
      {
        message: "Meeting created successfully",
        meeting,
        socketAuth,
        success: true,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Meeting creation error:", err);
    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}
