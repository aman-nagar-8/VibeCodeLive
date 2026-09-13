import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Meeting from "@/models/Meeting";
import User from "@/models/User.model.js";
import { connectDB } from "@/lib/db.js";
import { getUserFromRequest } from "@/lib/getUserFromRequest";
import { nanoid } from "nanoid";
import  slugify  from "slugify";
import { ApiError } from "@/lib/errors";

export async function POST(req) {
  try {
    await connectDB();

    // Get user from cookies
    const decodedUser = await getUserFromRequest(req);

    console.log("Decoded User:", decodedUser);

    if(!decodedUser){
      return NextResponse.json(
        { error: "Unauthorized",message: "User not authenticated" },
        { status: 401 },
      );
    }

    const adminUser = await User.findById(decodedUser.userId);
    if (!adminUser) {
      return NextResponse.json(
        { error: "Admin user not found" },
        { status: 404 },
      );
    }

    // Read data from frontend
    const { name, joinPolicy, status, requiredFields } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    const meetingCode = nanoid(8); // Generate unique meeting URL
    const slug = slugify(name, {
      lower: true,
      trim: true,
    });

    // Create meeting
    const meeting = await Meeting.create({
      name,
      url: `${slug}-${meetingCode}`,
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
      {
        id: adminUser._id,
        meetingId: meeting._id.toString(),
        meetingUrl: meeting.url,
        username: adminUser.name,
        isHost: true,
        role: "teacher",
      },
      process.env.SOCKET_JWT_SECRET,
      { expiresIn: "15m" },
    );

    return NextResponse.json(
      {
        message: "Meeting created successfully",
        meeting,
        socketAuth,
        success: true,
      },
      { status: 201 },
    );
  } catch (error) {

        if (error instanceof ApiError) {
      return Response.json(
        {
          success: false,
          message: error.message,
          code: error.code,
        },
        {
          status: error.status,
        }
      );
    }
    console.error("Error creating meeting:", error);
    return Response.json(
      {
        success: false,
        message: "Internal server error.",
        code: "INTERNAL_ERROR",
      },
      {
        status: 500,
      }
    );
  }
}
