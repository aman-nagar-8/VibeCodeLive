import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/getUserFromRequest";
import User from "@/models/User.model.js";

export async function GET(req) {
  try {
    const decodedUser = await getUserFromRequest(req);

    const user = await User.findById(decodedUser.userId);

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("getUser error:", error);

    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }
}
