import jwt from "jsonwebtoken";
import {ApiError} from "@/lib/errors";

export function getUserFromRequest(req) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError("Please log in to continue.", 401, "LOGIN_REQUIRED");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    return decoded;
  } catch (err) {
    throw new ApiError(
      "Your session has expired. Please log in again.",
      401,
      "SESSION_EXPIRED",
    );
  }
}
