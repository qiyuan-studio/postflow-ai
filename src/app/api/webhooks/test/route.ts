import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Webhook ID required" }, { status: 400 });
    }

    const webhook = await prisma.webhook.findUnique({ where: { id } });
    if (!webhook || webhook.userId !== session.user.id) {
      return NextResponse.json({ error: "Webhook not found" }, { status: 404 });
    }

    // Build test payload
    const payload = JSON.stringify({
      event: "test.ping",
      data: {
        message: "This is a test webhook from PostFlow AI",
        timestamp: new Date().toISOString(),
      },
    });

    // Generate signature
    const signature = crypto
      .createHmac("sha256", webhook.secret || "")
      .update(payload)
      .digest("hex");

    // Send test request
    const response = await fetch(webhook.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-PostFlow-Signature": signature,
        "X-PostFlow-Event": "test.ping",
        "User-Agent": "PostFlow-Webhook/1.0",
      },
      body: payload,
    });

    if (response.ok) {
      await prisma.webhook.update({
        where: { id },
        data: { lastTriggeredAt: new Date() },
      });
      return NextResponse.json({ success: true, statusCode: response.status });
    } else {
      return NextResponse.json({
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
        statusCode: response.status,
      });
    }
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message || "Network error",
    });
  }
}
