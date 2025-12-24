// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

// export function middleware(req) {
//   const { pathname } = req.nextUrl;
//   const method = req.method;

//   // 1️⃣ Protect PAGES using refresh token presence
//   if (!pathname.startsWith("/api")) {
//     if (pathname.startsWith("/meeting")) {
//       const refreshToken = req.cookies.get("refreshToken");

//       if (!refreshToken) {
//         return
//         return NextResponse.redirect(
//           new URL("/login", req.url)
//         );
//       }
//     }

//     return NextResponse.next();
//   }

//   // 2️⃣ Allow auth APIs
//   if (
//     pathname.startsWith("/api/login") ||
//     pathname.startsWith("/api/login/register") ||
//     pathname.startsWith("/api/login/refresh") ||
//     pathname.startsWith("/api/login/verify-email")||
//     pathname.startsWith("/api/meeting/getCurrentMeeting")
//   ) {
//     return NextResponse.next();
//   }

//   // 3️⃣ Protect write APIs with access token
//   if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
//     const authHeader = req.headers.get("authorization");
//     console.log("AUTH HEADER:", req.headers.get("authorization"));


//     if (!authHeader?.startsWith("Bearer ")) {
//       return NextResponse.json(
//         { message: "Unauthorized in middle" },
//         { status: 401 }
//       );
//     }

//     try {
//       jwt.verify(
//         authHeader.split(" ")[1],
//         process.env.ACCESS_TOKEN_SECRET
//       );
//       return NextResponse.next();
//     } catch {
//       return NextResponse.json(
//         { message: "Unauthorized he hu" },
//         { status: 401 }
//       );
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
// };

