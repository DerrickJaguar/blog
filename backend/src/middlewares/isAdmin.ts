import { verify } from "hono/jwt";
import { env } from "hono/adapter";
import type { Context, Next } from "hono";
import { PrismaClient } from "@prisma/client";

export default async function isAdmin(c: Context, next: Next) {
  try {
    const e = env<{ JWT_SECRET: string; DATABASE_URL: string }>(c) as any;
    const JWT_SECRET: string = e?.JWT_SECRET || process.env.JWT_SECRET!;
    const DATABASE_URL: string = e?.DATABASE_URL || process.env.DATABASE_URL!;
    
    const authHeader = c.req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return c.json({ msg: "Unauthorized - No token provided" }, 401);
    }

    const token = authHeader.split(" ")[1];
    const payload = await verify(token, JWT_SECRET);
    
    if (!payload || !payload.id) {
      return c.json({ msg: "Unauthorized - Invalid token" }, 401);
    }

    // Check if user has admin role
    const prisma = new PrismaClient({
      datasourceUrl: DATABASE_URL,
    });

    const user = await prisma.user.findUnique({
      where: { id: payload.id as string },
      select: { id: true, role: true },
    });

    if (!user) {
      return c.json({ msg: "User not found" }, 404);
    }

    if (user.role !== "admin") {
      return c.json({ 
        msg: "Forbidden - Admin access required. Only admins can create or edit blogs." 
      }, 403);
    }

    c.set("user", { id: user.id });
    await next();
  } catch (e) {
    console.error("Admin auth error:", e instanceof Error ? e.message : e);
    return c.json({ msg: "Unauthorized" }, 401);
  }
}
