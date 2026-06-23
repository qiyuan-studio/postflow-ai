import { auth } from "./auth";
import { prisma } from "./prisma";

interface UsageLimit {
  maxGenerationsPerMonth: number;
  maxPlatforms: number;
  maxApiKeys: number;
  maxTeamMembers: number;
  hasAnalytics: boolean;
  hasApiAccess: boolean;
  hasPrioritySupport: boolean;
}

const PLAN_LIMITS: Record<string, UsageLimit> = {
  free: {
    maxGenerationsPerMonth: 10,
    maxPlatforms: 1,
    maxApiKeys: 0,
    maxTeamMembers: 1,
    hasAnalytics: false,
    hasApiAccess: false,
    hasPrioritySupport: false,
  },
  pro: {
    maxGenerationsPerMonth: Infinity,
    maxPlatforms: 5,
    maxApiKeys: 3,
    maxTeamMembers: 5,
    hasAnalytics: true,
    hasApiAccess: true,
    hasPrioritySupport: false,
  },
  enterprise: {
    maxGenerationsPerMonth: Infinity,
    maxPlatforms: Infinity,
    maxApiKeys: Infinity,
    maxTeamMembers: Infinity,
    hasAnalytics: true,
    hasApiAccess: true,
    hasPrioritySupport: true,
  },
};

export async function getCurrentPlan(): Promise<{ plan: string; limits: UsageLimit }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { plan: "free", limits: PLAN_LIMITS.free };
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  const plan = subscription?.status === "active" ? (subscription.plan || "free") : "free";
  return { plan, limits: PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.free };
}

export async function checkGenerationLimit(): Promise<{ allowed: boolean; used: number; limit: number }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { allowed: false, used: 0, limit: 0 };
  }

  const { plan, limits } = await getCurrentPlan();

  // Pro/Enterprise: no limit
  if (limits.maxGenerationsPerMonth === Infinity) {
    return { allowed: true, used: 0, limit: Infinity };
  }

  // Count generations this month
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const count = await prisma.contentPost.count({
    where: {
      userId: session.user.id,
      aiGenerated: true,
      createdAt: { gte: startOfMonth },
    },
  });

  return {
    allowed: count < limits.maxGenerationsPerMonth,
    used: count,
    limit: limits.maxGenerationsPerMonth,
  };
}

export function getPlanLimits(plan?: string): UsageLimit {
  return PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.free;
}
