import Meeting from "@/models/Meeting.js";
import { connectDB} from "@/lib/db.js";
import { NextResponse } from "next/server";
import User from "@/models/User.model.js";

export async function POST(req , res) {
  try {
    await connectDB();

    const { meetingId } = await req.json();

    if (!meetingId) {
      return new NextResponse(JSON.stringify({ error: "Meeting ID is required" }), { status: 400 });
    }

    const meeting = await Meeting.findById(meetingId);

    if (!meeting) {
      return new NextResponse(JSON.stringify({ error: "Meeting not found" }), { status: 404 });
    }

    const members = await User.find({ _id: { $in: meeting.members } });
    if(!members){
      return new NextResponse(JSON.stringify({ error: "Members not found" , meeting }), { status: 404 });
    }


    return new NextResponse(JSON.stringify({meeting , members}), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
