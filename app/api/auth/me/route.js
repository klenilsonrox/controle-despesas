import { NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/api-auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    const userId = await getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(userId).select("-password").lean();
    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro ao carregar usuário" }, { status: 500 });
  }
}
