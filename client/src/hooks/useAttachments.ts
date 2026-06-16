import { useEffect, useState, useCallback } from "react";
import {
  fetchAttachments,
  uploadAttachments as uploadService,
  deleteAttachment as deleteService,
} from "../services/attachments.service";
import type { AttachmentEntityType, AttachmentResponse } from "../types/attachment.types";

export function useAttachments(entityType: AttachmentEntityType, entityId: number) {
  const [attachments, setAttachments] = useState<AttachmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetchAttachments(entityType, entityId)
      .then(setAttachments)
      .catch((e) => setError(e?.message ?? "Eroare"))
      .finally(() => setLoading(false));
  }, [entityType, entityId]);

  useEffect(() => { load(); }, [load]);

  const upload = useCallback(
    async (files: File[]) => {
      setUploading(true);
      try {
        const newFiles = await uploadService(entityType, entityId, files);
        setAttachments((prev) => [...newFiles, ...prev]);
      } catch (e) {
        setError(e?.message ?? "Upload eșuat");
      } finally {
        setUploading(false);
      }
    },
    [entityType, entityId]
  );

  const remove = useCallback(async (id: number) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
    try {
      await deleteService(id);
    } catch {
      load(); // rollback
    }
  }, [load]);

  return { attachments, loading, uploading, error, upload, remove };
}