import { NextResponse } from "next/server";
import { verifyApiKey } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const auth = await verifyApiKey(request);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get subscription info
    const subscription = await prisma.subscription.findUnique({
      where: { userId: auth.userId },
      select: { plan: true, status: true },
    });

    // Get platform count
    const platformCount = await prisma.platformAccount.count({
      where: { userId: auth.userId, isConnected: true },
    });

    return NextResponse.json({
      ...user,
      subscription: subscription || { plan: "free", status: "active" },
      platformCount,
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
