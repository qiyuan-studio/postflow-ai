import { prisma } from "./prisma";

export async function verifyApiKey(request: Request): Promise<{ userId: string; error?: never } | { error: string; userId?: never }> {
  const authHeader = request.headers.get("Authorization");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { error: "Missing or invalid Authorization header. Use: Bearer YOUR_API_KEY" };
  }

  const apiKey = authHeader.slice(7).trim();
  if (!apiKey) {
    return { error: "API key is required" };
  }

  try {
    const keyRecord = await prisma.apiKey.findUnique({
      where: { key: apiKey },
      select: { id: true, userId: true, active: true, expiresAt: true },
    });

    if (!keyRecord) {
      return { error: "Invalid API key" };
    }

    if (!keyRecord.active) {
      return { error: "API key is disabled" };
    }

    if (keyRecord.expiresAt && keyRecord.expiresAt < new Date()) {
      return { error: "API key has expired" };
    }

    // Update last used timestamp
    await prisma.apiKey.update({
      where: { id: keyRecord.id },
      data: { lastUsed: new Date() },
    });

    return { userId: keyRecord.userId };
  } catch (error) {
    return { error: "Authentication failed" };
  }
}
