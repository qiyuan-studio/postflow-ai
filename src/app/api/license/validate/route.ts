import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { key, hostname } = await request.json();

    if (!key) {
      return NextResponse.json({ valid: false, error: "请输入授权码" }, { status: 400 });
    }

    const license = await prisma.license.findUnique({ where: { key: key.trim().toUpperCase() } });

    if (!license) {
      return NextResponse.json({ valid: false, error: "授权码无效" }, { status: 404 });
    }

    if (license.status === "revoked") {
      return NextResponse.json({ valid: false, error: "授权码已被吊销" }, { status: 403 });
    }

    if (license.expiresAt && license.expiresAt < new Date()) {
      return NextResponse.json({ valid: false, error: "授权码已过期" }, { status: 403 });
    }

    if (license.currentActivations >= license.maxActivations) {
      return NextResponse.json({ valid: false, error: "授权码已达最大激活次数" }, { status: 403 });
    }

    // 激活计数 + 记录激活信息
    if (license.status === "active") {
      await prisma.license.update({
        where: { id: license.id },
        data: {
          status: "used",
          currentActivations: { increment: 1 },
          activatedAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      valid: true,
      plan: license.plan,
      maxActivations: license.maxActivations,
      expiresAt: license.expiresAt,
    });
  } catch (error) {
    return NextResponse.json(
      { valid: false, error: "验证失败" },
      { status: 500 }
    );
  }
}

// 健康检查端点
export async function GET() {
  return NextResponse.json({
    status: "ok",
    version: "1.0.0",
    product: "PostFlow AI",
  });
}
