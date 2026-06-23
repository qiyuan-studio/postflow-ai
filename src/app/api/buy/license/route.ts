import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

function generateLicenseKey(): string {
  const segments: string[] = [];
  for (let i = 0; i < 4; i++) {
    segments.push(crypto.randomBytes(4).toString("hex").toUpperCase());
  }
  return segments.join("-");
}

export async function POST(request: Request) {
  try {
    const { plan, email, name } = await request.json();
    
    if (!["pro", "enterprise"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const prices: Record<string, number> = { pro: 29900, enterprise: 99900 };
    const expiresDays: Record<string, number> = { pro: 365, enterprise: 365 };

    const key = generateLicenseKey();
    const license = await prisma.license.create({
      data: {
        key,
        plan,
        status: "active",
        buyerEmail: email,
        buyerName: name || null,
        price: prices[plan],
        expiresAt: new Date(Date.now() + expiresDays[plan] * 86400000),
        maxActivations: plan === "enterprise" ? 10 : 1,
      },
    });

    return NextResponse.json({
      success: true,
      key: license.key,
      plan: license.plan,
      expiresAt: license.expiresAt,
      price: license.price,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "创建授权失败: " + (error as Error).message },
      { status: 500 }
    );
  }
}
