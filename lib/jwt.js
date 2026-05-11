import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = "7d";

export function signToken(payload) {
  if (!SECRET) {
    throw new Error("Defina JWT_SECRET no arquivo .env.local");
  }
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
}

export function verifyToken(token) {
  if (!SECRET || !token) {
    return null;
  }
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}
