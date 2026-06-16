import { RequestHandler } from "express";
import { prisma } from "../config/prisma";
import fs from "fs";
import path from "path";

// POST /attachments/:entityType/:entityId
export const uploadAttachments: RequestHandler = async (req, res) => {
  try {
    const entityType = req.params.entityType as string;
    const entityId = req.params.entityId as string;
    const userId = (req as any).user?.userId;
    const files = req.files as Express.Multer.File[];

    if (!files?.length) {
      res.status(400).json({ message: "No files uploaded" });
      return;
    }

    if (!["project", "task"].includes(entityType)) {
      res.status(400).json({ message: "Invalid entityType" });
      return;
    }

    const attachments = await prisma.$transaction(
      files.map((file) =>
        prisma.attachment.create({
          data: {
            filename: file.originalname,
            storedName: file.filename,
            mimetype: file.mimetype,
            size: file.size,
            path: file.path.replace(/\\/g, "/"), // Windows safe
            entityType: entityType as any,
            entityId: Number(entityId),
            uploadedById: userId ?? null,
          },
          include: { uploadedBy: { select: { id: true, name: true, avatar: true } } },
        })
      )
    );

    res.status(201).json(attachments);
  } catch (err) {
    console.error("[uploadAttachments]", err);
    res.status(500).json({ message: "Upload failed" });
  }
};

// GET /attachments/:entityType/:entityId
export const getAttachments: RequestHandler = async (req, res) => {
  try {
    const { entityType, entityId } = req.params;

    const attachments = await prisma.attachment.findMany({
      where: {
        entityType: entityType as any,
        entityId: Number(entityId),
      },
      include: { uploadedBy: { select: { id: true, name: true, avatar: true } } },
      orderBy: { createdAt: "desc" },
    });

    res.json(attachments);
  } catch (err) {
    console.error("[getAttachments]", err);
    res.status(500).json({ message: "Failed to fetch attachments" });
  }
};

// DELETE /attachments/:id
export const deleteAttachment: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.userId;
    const userRole = (req as any).user?.role;

    const attachment = await prisma.attachment.findUnique({
      where: { id: Number(id) },
    });

    if (!attachment) {
      res.status(404).json({ message: "Attachment not found" });
      return;
    }

    // Doar owner sau admin/manager pot șterge
    const canDelete =
      attachment.uploadedById === userId ||
      ["admin", "manager"].includes(userRole);

    if (!canDelete) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    // Șterge fișierul de pe disk
    const fullPath = path.resolve(attachment.path);
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);

    await prisma.attachment.delete({ where: { id: Number(id) } });

    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("[deleteAttachment]", err);
    res.status(500).json({ message: "Delete failed" });
  }
};