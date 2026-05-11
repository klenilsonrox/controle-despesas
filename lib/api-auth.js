import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/jwt";
import { AUTH_COOKIE_NAME } from "@/lib/cookie-options";
import User from "@/models/User";

export async function getUserIdFromRequest() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const payload = verifyToken(token);
  if (!payload?.userId) {
    return null;
  }

  await connectDB();
  const exists = await User.exists({ _id: payload.userId });
  if (!exists) {
    return null;
  }

  return payload.userId;
}
