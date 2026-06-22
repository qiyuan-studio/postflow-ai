import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - 获取当前订阅
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    });

    if (!subscription) {
      // 默认免费订阅
      return NextResponse.json({
        plan: "free",
        status: "active",
      });
    }

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error("Subscription fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription" },
      { status: 500 }
    );
  }
}

// POST - 升级/更改订阅
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { plan } = await request.json();

    if (!["free", "pro", "enterprise"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const subscription = await prisma.subscription.upsert({
      where: { userId: session.user.id },
      update: { plan, status: "active" },
      create: {
        userId: session.user.id,
        plan,
        status: "active",
      },
    });

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error("Subscription update error:", error);
    return NextResponse.json(
      { error: "Failed to update subscription" },
      { status: 500 }
    );
  }
}
