import { comment_entity_type } from "@prisma/client";
import { AuthRequest } from "../middleware/auth.middleware";
import { Response } from "express";
import prisma from "../config/prisma";

// ─── Helper: verifică că entitatea există ────────────────────
const entityExists = async (
  entityType: comment_entity_type,
  entityId: number
): Promise<boolean> => {
  if (entityType === "project") {
    const p = await prisma.project.findUnique({ where: { id: entityId } });
    return p !== null;
  }
  if (entityType === "task") {
    const t = await prisma.task.findUnique({ where: { id: entityId } });
    return t !== null;
  }
  return false;
};

// ─────────────────────────────────────────
// GET /api/comments/:entityType/:entityId
// ─────────────────────────────────────────
export const getAllComments = async (req: AuthRequest, res: Response) => {
  try {
    const entityType = req.params.entityType as comment_entity_type;
    const entityId = Number(req.params.entityId);

    if (!Object.values(comment_entity_type).includes(entityType)) {
      return res.status(400).json({ error: "entityType invalid. Acceptat: project | task" });
    }
    if (isNaN(entityId)) {
      return res.status(400).json({ error: "entityId trebuie să fie un număr" });
    }

    const exists = await entityExists(entityType, entityId);
    if (!exists) {
      return res.status(404).json({ error: `${entityType} cu id ${entityId} nu există` });
    }

    const comments = await prisma.comment.findMany({
      where: { entityType, entityId },
      include: { author: { select: { id: true, name: true, avatar: true } } },
      orderBy: { createdAt: "asc" },
    });

    return res.json(comments);
  } catch (err) {
    console.error("getAllComments error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// ─────────────────────────────────────────
// POST /api/comments/:entityType/:entityId
// ─────────────────────────────────────────
export const createComment = async (req: AuthRequest, res: Response) => {
  try {
    const entityType = req.params.entityType as comment_entity_type;
    const entityId = Number(req.params.entityId);
    const { content } = req.body;
    const authorId = Number(req.user!.userId); // ← req.user.userId din middleware

    if (!Object.values(comment_entity_type).includes(entityType)) {
      return res.status(400).json({ error: "entityType invalid. Acceptat: project | task" });
    }
    if (isNaN(entityId)) {
      return res.status(400).json({ error: "entityId trebuie să fie un număr" });
    }
    if (!content || typeof content !== "string" || content.trim() === "") {
      return res.status(400).json({ error: "content este obligatoriu" });
    }

    const exists = await entityExists(entityType, entityId);
    if (!exists) {
      return res.status(404).json({ error: `${entityType} cu id ${entityId} nu există` });
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        entityType,
        entityId,
        authorId,
      },
      include: { author: { select: { id: true, name: true } } },
    });

    return res.status(201).json(comment);
  } catch (err) {
    console.error("createComment error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// ─────────────────────────────────────────
// PUT /api/comments/:commentId
// ─────────────────────────────────────────
export const updateComment = async (req: AuthRequest, res: Response) => {
  try {
    const commentId = Number(req.params.commentId);
    const { content } = req.body;
    const userId = Number(req.user!.userId); // ← req.user.userId din middleware

    if (isNaN(commentId)) {
      return res.status(400).json({ error: "commentId invalid" });
    }
    if (!content || typeof content !== "string" || content.trim() === "") {
      return res.status(400).json({ error: "content este obligatoriu" });
    }

    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) {
      return res.status(404).json({ error: "Comentariul nu există" });
    }
    if (comment.authorId !== userId) {
      return res.status(403).json({ error: "Nu poți edita comentariul altui utilizator" });
    }

    const updated = await prisma.comment.update({
      where: { id: commentId },
      data: { content: content.trim() },
      include: { author: { select: { id: true, name: true } } },
    });

    return res.json(updated);
  } catch (err) {
    console.error("updateComment error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// ─────────────────────────────────────────
// DELETE /api/comments/:commentId
// ─────────────────────────────────────────
export const deleteComment = async (req: AuthRequest, res: Response) => {
  try {
    const commentId = Number(req.params.commentId);
    const userId = Number(req.user!.userId); // ← req.user.userId din middleware

    if (isNaN(commentId)) {
      return res.status(400).json({ error: "commentId invalid" });
    }

    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) {
      return res.status(404).json({ error: "Comentariul nu există" });
    }
    if (comment.authorId !== userId) {
      return res.status(403).json({ error: "Nu poți șterge comentariul altui utilizator" });
    }

    await prisma.comment.delete({ where: { id: commentId } });

    return res.status(200).json({ message: "Comentariul a fost șters" });
  } catch (err) {
    console.error("deleteComment error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};