import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function createUser({ name, email, password }) {
  await connectDB();
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return { error: "E-mail já cadastrado" };
  }
  const hashed = await bcrypt.hash(password, 12);
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashed,
  });
  return { user };
}

export async function validateCredentials(email, password) {
  await connectDB();
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return null;
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return null;
  }
  return user;
}

export async function updateUserProfile(userId, { name }) {
  await connectDB();
  const user = await User.findByIdAndUpdate(
    userId,
    { name },
    { new: true, runValidators: true }
  )
    .select("-password")
    .lean();
  return user;
}

export async function updateUserPassword(userId, currentPassword, newPassword) {
  await connectDB();
  const user = await User.findById(userId);
  if (!user) {
    return { error: "Usuário não encontrado" };
  }
  const ok = await bcrypt.compare(currentPassword, user.password);
  if (!ok) {
    return { error: "Senha atual incorreta" };
  }
  user.password = await bcrypt.hash(newPassword, 12);
  await user.save();
  return { success: true };
}
