import { NextResponse } from "next/server";
import { rateLimit }  from "@/lib/rateLimiter";

// export function middleware(req) {
//   try {
//     const ip =
//       req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
//       req.headers.get("x-real-ip") ||
//       "unknown";

//     console.log(`Incoming request from IP: ${ip}`);

//     const { allowed, remaining } = rateLimit(ip);
//     if (!allowed) {
//       return NextResponse.json(
//         {
//           error: "Too many login attempts. Please try again later.",
//           retryAfter,
//         },
//         { status: 429 },
//       );
//     }
//     return NextResponse.next();
//   } catch (error) {
//     console.error("Error in middleware:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error from middleware" },
//       { status: 500 },
//     );
//   }
// }

// export const config = {
//   matcher: ["/api/login"],
// };


import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const redis = Redis.fromEnv();

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "1 m"),
});