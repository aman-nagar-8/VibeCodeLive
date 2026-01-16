// File: pages/api/meetings/join.js
// Join meeting API
// - Takes meetingUrl from body
// - Extracts user data from cookie (JWT token)
// - Finds meeting and user
// - Adds user to meeting.members array (if not already added)

import { connectDB } from "@/lib/db.js";
import Meeting from "@/models/Meeting.js";
import User from "@/models/User.model.js";
import { stat } from "fs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/getUserFromRequest";

export async function POST(req, res) {
  // if (req.method !== "POST")
  //   return NextResponse.json({
  //     success: false,
  //     message: "Method not allowed",
  //     status: 405,
  //   });

  await connectDB();

  try {
    // const { meetingUrl } = await req.json();
    // if (!meetingUrl) {
    //   return NextResponse.json({
    //     success: false,
    //     message: "Meeting URL is required",
    //     status: 400,
    //   });
    // }

    // 1. Read user token from cookies
    const decodedUser = await getUserFromRequest(req);
    // const token = req.cookies.get("token")?.value;
    // if (!token) {
    //   return NextResponse.json({
    //     success: false,
    //     message: "No user token found",
    //     status: 401,
    //   });
    // }

    // 2. Verify user token
    // let decoded;
    // try {
    //   decoded = jwt.verify(token, process.env.JWT_SECRET);
    // } catch (err) {
    //   return NextResponse.json({
    //     success: false,
    //     message: "Invalid token",
    //     status: 401,
    //   });
    // }

    const userId = decodedUser.userId;
    const { meetingId , password , formData } = await req.json();

    // 3. Find the user from DB
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User not found",
        status: 404,
      });
    }

    // 4. Find meeting based on meetingUrl
    // const meeting = await Meeting.findById(meetingId);
    // if (!meeting) {
    //   return NextResponse.json({
    //     success: false,
    //     message: "Meeting not found",
    //     status: 404,
    //   });
    // }

    // 5. If user already exists in members, return success
    // const alreadyMember = meeting.members.some(
    //   (m) => m.toString() === user._id.toString()
    // );

    // if (!alreadyMember) {
    //   meeting.members.push(user._id);
    //   await meeting.save();
    // }

    await Meeting.findByIdAndUpdate(meetingId, {
      $addToSet: { members: user._id },
    } );

    const socketAuth = jwt.sign(
      { id: user._id, meetingId: meetingId , username: user.name },
      process.env.SOCKET_JWT_SECRET,
      { expiresIn: "30m" }
    );

    return NextResponse.json({
      success: true,
      socketAuth,
      message: "User added to meeting",
      status: 200,
    });
  } catch (error) {
    console.error("JOIN MEETING ERROR:", error);
    return NextResponse.json({
      success: false,
      message: "Server problem joining meeting , try again later.",
      status: 500,
    });
  }
}
