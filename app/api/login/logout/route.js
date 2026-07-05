import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        // Clear the token cookie by setting it to an empty value and expiring it immediately
        const response = NextResponse.json({
            success: true,
            message: "User logged out successfully",
            status: 200,
        });
        response.cookies.set("refreshToken", "", { maxAge: 0 });

        return response;

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Server error occurred",
            status: 500,
        });
    }
}