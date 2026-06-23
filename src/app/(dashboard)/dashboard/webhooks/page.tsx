import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { WebhooksClient } from "./WebhooksClient";

export default async function WebhooksPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const webhooks = await prisma.webhook.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const serialized = webhooks.map((w) => ({
    ...w,
    events: JSON.parse(w.events || "[]"),
    createdAt: w.createdAt.toISOString(),
    updatedAt: w.updatedAt.toISOString(),
    lastTriggeredAt: w.lastTriggeredAt?.toISOString() || null,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary-900">Webhook 通知</h1>
        <p className="text-primary-500 mt-1">
          当内容发布、排期或失败时，自动通知你的服务
        </p>
      </div>
      <WebhooksClient webhooks={serialized} />
    </div>
  );
}
