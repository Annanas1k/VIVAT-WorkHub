import { Response } from "express";
import prisma from "../config/prisma";
import type { AuthRequest } from "../middleware/auth.middleware";

// ─────────────────────────────────────────────────────────────
// GET /dashboard/stats
// ─────────────────────────────────────────────────────────────
export async function getDashboardStats(req: AuthRequest, res: Response) {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [
      activeProjects,
      totalCustomers,
      activeUsers,
      tasksCompletedThisMonth,
      projectStatusBreakdown,
      customerTypeBreakdown,
      userRoleBreakdown,
    ] = await Promise.all([
      prisma.project.count({ where: { status: "active" } }),
      prisma.customer.count(),
      prisma.user.count(),
      prisma.task.count({
        where: { status: "done", updatedAt: { gte: startOfMonth } },
      }),
      prisma.project.groupBy({ by: ["status"], _count: { id: true } }),
      prisma.customer.groupBy({ by: ["type"], _count: { id: true } }),
      prisma.user.groupBy({ by: ["role"], _count: { id: true } }),
    ]);

    return res.json({
      activeProjects,
      totalCustomers,
      activeUsers,
      tasksCompletedThisMonth,
      projectStatusBreakdown: projectStatusBreakdown.map((item) => ({
        status: item.status,
        count: item._count.id,
      })),
      customerTypeBreakdown: customerTypeBreakdown.map((item) => ({
        status: item.type,
        count: item._count.id,
      })),
      userRoleBreakdown: userRoleBreakdown.map((item) => ({
        status: item.role,
        count: item._count.id,
      })),
    });
  } catch (error) {
    console.error("getDashboardStats error:", error);
    return res.status(500).json({ message: "Eroare la încărcarea statisticilor." });
  }
}

// ─────────────────────────────────────────────────────────────
// GET /dashboard/charts/project-status
// ─────────────────────────────────────────────────────────────
export async function getProjectStatusBreakdown(req: AuthRequest, res: Response) {
  try {
    const breakdown = await prisma.project.groupBy({
      by: ["status"],
      _count: { id: true },
    });

    return res.json(
      breakdown.map((item) => ({ status: item.status, count: item._count.id }))
    );
  } catch (error) {
    console.error("getProjectStatusBreakdown error:", error);
    return res.status(500).json({ message: "Eroare la încărcarea datelor." });
  }
}

// ─────────────────────────────────────────────────────────────
// GET /dashboard/charts/customer-type
// ─────────────────────────────────────────────────────────────
export async function getCustomerTypeBreakdown(req: AuthRequest, res: Response) {
  try {
    const breakdown = await prisma.customer.groupBy({
      by: ["type"],
      _count: { id: true },
    });

    return res.json(
      breakdown.map((item) => ({ status: item.type, count: item._count.id }))
    );
  } catch (error) {
    console.error("getCustomerTypeBreakdown error:", error);
    return res.status(500).json({ message: "Eroare la încărcarea datelor." });
  }
}

// ─────────────────────────────────────────────────────────────
// GET /dashboard/charts/user-roles
// ─────────────────────────────────────────────────────────────
export async function getUserRoleBreakdown(req: AuthRequest, res: Response) {
  try {
    const breakdown = await prisma.user.groupBy({
      by: ["role"],
      _count: { id: true },
    });

    return res.json(
      breakdown.map((item) => ({ status: item.role, count: item._count.id }))
    );
  } catch (error) {
    console.error("getUserRoleBreakdown error:", error);
    return res.status(500).json({ message: "Eroare la încărcarea datelor." });
  }
}

// ─────────────────────────────────────────────────────────────
// GET /dashboard/activity?limit=10
// ─────────────────────────────────────────────────────────────
export async function getRecentActivity(req: AuthRequest, res: Response) {
  try {
    const limit = Math.min(Number(req.query.limit) || 10, 50);

    const logs = await prisma.activityLog.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        performedBy: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });

    return res.json(
      logs.map((log) => ({
        id: log.id,
        action: log.action,
        entityType: log.entityType,
        entityId: log.entityId,
        note: log.note,
        createdAt: log.createdAt,
        performedBy: log.performedBy
          ? { id: log.performedBy.id, name: log.performedBy.name, avatar: log.performedBy.avatar }
          : null,
      }))
    );
  } catch (error) {
    console.error("getRecentActivity error:", error);
    return res.status(500).json({ message: "Eroare la încărcarea activității." });
  }
}

// ─────────────────────────────────────────────────────────────
// GET /dashboard/activity-heatmap
// ─────────────────────────────────────────────────────────────
export async function getActivityHeatmap(req: AuthRequest, res: Response) {
  try {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const rows = await prisma.$queryRaw<{ date: string; count: bigint }[]>`
      SELECT
        TO_CHAR("createdAt" AT TIME ZONE 'UTC', 'YYYY-MM-DD') AS date,
        COUNT(*) AS count
      FROM "ActivityLog"
      WHERE "createdAt" >= ${oneYearAgo}
      GROUP BY date
      ORDER BY date ASC
    `;

    return res.json(
      rows.map((row) => ({ date: row.date, count: Number(row.count) }))
    );
  } catch (error) {
    console.error("getActivityHeatmap error:", error);
    return res.status(500).json({ message: "Eroare la încărcarea heatmap-ului." });
  }
}

// ─────────────────────────────────────────────────────────────
// GET /dashboard/my-projects
// ─────────────────────────────────────────────────────────────
export async function getMyProjects(req: AuthRequest, res: Response) {
  try {
    const userId = Number(req.user?.userId);
    if (!userId) return res.status(401).json({ message: "Neautentificat." });

    const projects = await prisma.project.findMany({
      where: {
        members: { some: { userId } },
        status: { not: "cancelled" },
      },
      orderBy: { dueDate: "asc" },
      select: {
        id: true,
        name: true,
        status: true,
        dueDate: true,
        customer: { select: { id: true, name: true } },
      },
    });

    return res.json(projects);
  } catch (error) {
    console.error("getMyProjects error:", error);
    return res.status(500).json({ message: "Eroare la încărcarea proiectelor." });
  }
}

// ─────────────────────────────────────────────────────────────
// GET /dashboard/upcoming-deadlines?days=14
// ─────────────────────────────────────────────────────────────
export async function getUpcomingDeadlines(req: AuthRequest, res: Response) {
  try {
    const userId = Number(req.user?.userId);
    if (!userId) return res.status(401).json({ message: "Neautentificat." });

    const days = Math.min(Number(req.query.days) || 14, 60);
    const until = new Date();
    until.setDate(until.getDate() + days);

    const projects = await prisma.project.findMany({
      where: {
        members: { some: { userId } },
        status: "active",
        dueDate: { gte: new Date(), lte: until },
      },
      orderBy: { dueDate: "asc" },
      select: {
        id: true,
        name: true,
        status: true,
        dueDate: true,
        customer: { select: { id: true, name: true } },
      },
    });

    return res.json(projects);
  } catch (error) {
    console.error("getUpcomingDeadlines error:", error);
    return res.status(500).json({ message: "Eroare la încărcarea termenelor." });
  }
}

// ─────────────────────────────────────────────────────────────
// GET /dashboard/recent-comments?limit=5
// ─────────────────────────────────────────────────────────────
export async function getRecentComments(req: AuthRequest, res: Response) {
  try {
    const userId = Number(req.user?.userId);
    if (!userId) return res.status(401).json({ message: "Neautentificat." });

    const limit = Math.min(Number(req.query.limit) || 5, 20);

    const userProjectIds = await prisma.projectMember.findMany({
      where: { userId },
      select: { projectId: true },
    });

    const projectIds = userProjectIds.map((pm) => pm.projectId);

    const comments = await prisma.comment.findMany({
      where: {
        projectId: { in: projectIds },
        authorId: { not: userId },
      },
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        Project: { select: { id: true, name: true } },
      },
    });

    return res.json(
      comments.map((c) => ({
        id: c.id,
        content: c.content,
        createdAt: c.createdAt,
        author: c.author,
        project: c.Project ? { id: c.Project.id, name: c.Project.name } : null,
      }))
    );
  } catch (error) {
    console.error("getRecentComments error:", error);
    return res.status(500).json({ message: "Eroare la încărcarea comentariilor." });
  }
}

// ─────────────────────────────────────────────────────────────
// GET /dashboard/recent-files?limit=5
// ─────────────────────────────────────────────────────────────
export async function getRecentFiles(req: AuthRequest, res: Response) {
  try {
    const userId = Number(req.user?.userId);
    if (!userId) return res.status(401).json({ message: "Neautentificat." });

    const limit = Math.min(Number(req.query.limit) || 5, 20);

    const userProjectIds = await prisma.projectMember.findMany({
      where: { userId },
      select: { projectId: true },
    });

    const projectIds = userProjectIds.map((pm) => pm.projectId);

    const files = await prisma.attachment.findMany({
      where: {
        entityType: "project",
        entityId: { in: projectIds },
      },
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        filename: true,
        mimetype: true,
        size: true,
        createdAt: true,
        uploadedBy: { select: { id: true, name: true } },
      },
    });

    return res.json(files);
  } catch (error) {
    console.error("getRecentFiles error:", error);
    return res.status(500).json({ message: "Eroare la încărcarea fișierelor." });
  }
}