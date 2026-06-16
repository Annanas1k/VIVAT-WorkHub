import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { uploadAttachment } from "../middleware/upload.middleware";
import {
  uploadAttachments,
  getAttachments,
  deleteAttachment,
} from "../controllers/attachment.controller";

const router = Router();

router.use(authMiddleware);

router.post(
  "/:entityType/:entityId",
  uploadAttachment.array("files", 10), // max 10 fișiere odată
  uploadAttachments
);

router.get("/:entityType/:entityId", getAttachments);

router.delete("/:id", deleteAttachment);

export default router;