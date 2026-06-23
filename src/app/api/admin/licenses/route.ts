import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

// 生成授权码
function generateLicenseKey(): string {
  const segments: string[] = [];
  for (let i = 0; i < 4; i++) {
    segments.push(crypto.randomBytes(4).toString("hex").toUpperCase());
  }
  return segments.join("-");
}

// 获取所有授权（仅admin）
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 简单admin检测：第一个用户或特定邮箱
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user?.email || user.email !== "8873721@qq.com") {
    return NextResponse.json({ error: "Forbidden: admin only" }, { status: 403 });
  }

  const licenses = await prisma.license.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(licenses);
}

// 生成新授权码
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user?.email || user.email !== "8873721@qq.com") {
    return NextResponse.json({ error: "Forbidden: admin only" }, { status: 403 });
  }

  try {
    const { plan, buyerEmail, buyerName, price, expiresInDays } = await request.json();

    const key = generateLicenseKey();
    const expiresAt = expiresInDays 
      ? new Date(Date.now() + expiresInDays * 86400000) 
      : null;

    const license = await prisma.license.create({
      data: {
        key,
        plan: plan || "pro",
        buyerEmail: buyerEmail || null,
        buyerName: buyerName || null,
        price: price || null,
        expiresAt,
        maxActivations: plan === "enterprise" ? 10 : 1,
      },
    });

    return NextResponse.json(license);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create license: " + (error as Error).message },
      { status: 500 }
    );
  }
}
