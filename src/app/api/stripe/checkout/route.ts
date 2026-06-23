import { NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const hasStripe = !!process.env.STRIPE_SECRET_KEY;

const stripe = hasStripe
  ? new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-03-31" as any })
  : null;

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { plan } = await request.json();
    if (!["pro", "enterprise"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    if (stripe) {
      const priceIds: Record<string, string> = {
        pro: process.env.STRIPE_PRO_PRICE_ID || "price_pro",
        enterprise: process.env.STRIPE_ENTERPRISE_PRICE_ID || "price_enterprise",
      };

      const checkoutSession = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [{ price: priceIds[plan], quantity: 1 }],
        success_url: `${process.env.AUTH_URL || "http://localhost:3000"}/dashboard/settings?success=true`,
        cancel_url: `${process.env.AUTH_URL || "http://localhost:3000"}/dashboard/settings?canceled=true`,
        client_reference_id: session.user.id,
        customer_email: session.user.email || undefined,
        metadata: { userId: session.user.id, plan },
      });

      return NextResponse.json({ url: checkoutSession.url });
    }

    // Mock mode: activate subscription immediately
    await prisma.subscription.upsert({
      where: { userId: session.user.id },
      update: {
        plan,
        status: "active",
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      create: {
        userId: session.user.id, plan, status: "active",
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
    return NextResponse.json({ success: true, plan, mode: "mock" });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
