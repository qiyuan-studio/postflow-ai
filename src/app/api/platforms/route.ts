import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - 获取用户的所有平台连接
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const accounts = await prisma.platformAccount.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        platform: true,
        platformUserName: true,
        isConnected: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ accounts });
  } catch (error) {
    console.error("Platform fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch platforms" },
      { status: 500 }
    );
  }
}

// POST - 连接平台账号
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { platform, accessToken, platformUserName } = await request.json();

    if (!platform) {
      return NextResponse.json(
        { error: "Platform is required" },
        { status: 400 }
      );
    }

    // Upsert: create or update
    const account = await prisma.platformAccount.upsert({
      where: {
        userId_platform: {
          userId: session.user.id,
          platform,
        },
      },
      update: {
        accessToken,
        platformUserName,
        isConnected: true,
      },
      create: {
        userId: session.user.id,
        platform,
        accessToken,
        platformUserName,
        isConnected: true,
      },
    });

    return NextResponse.json({ account }, { status: 201 });
  } catch (error) {
    console.error("Platform connect error:", error);
    return NextResponse.json(
      { error: "Failed to connect platform" },
      { status: 500 }
    );
  }
}
