import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Meeting from "@/models/Meeting";

export async function POST(req) {
  try {
    await connectDB();

    const { query } =  await req.json();

    if (!query || !query.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Search query is required",
          result: [],
        },
        { status: 400 }
      );
    }

    // 🔹 Normalize user input
    // const normalizedQuery = query
    //   .toLowerCase()
    //   .trim()
    //   .replace(/\s+/g, "-"); // spaces → hyphen

    // 🔹 Find meetings by URL (partial match)
    const meetings = await Meeting.find({
      url: {
        $regex: query,
        $options: "i",
      },
    //   status: { $in: ["running", "scheduled"] }, // optional filter
    }).limit(5)
    // .select("title url status joinPolicy"); // return only required fields

    return NextResponse.json(
      {
        success: true,
        message: "Meetings fetched successfully",
        result: meetings,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("getMeetingRoute error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while searching meetings",
        result: [],
      },
      { status: 500 }
    );
  }
}
