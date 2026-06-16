import axios from "axios";
import type { AttachmentEntityType, AttachmentResponse } from "../types/attachment.types";

const API_URL = import.meta.env.VITE_API_URL;

const authHeaders = () => {
  const token = localStorage.getItem("app_token");
  return { Authorization: `Bearer ${token}` };
};

// GET /api/attachments/:entityType/:entityId
export const fetchAttachments = async (
  entityType: AttachmentEntityType,
  entityId: number
): Promise<AttachmentResponse[]> => {
  const { data } = await axios.get<AttachmentResponse[]>(
    `${API_URL}/attachments/${entityType}/${entityId}`,
    { headers: authHeaders() }
  );
  return data;
};

// POST /api/attachments/:entityType/:entityId
export const uploadAttachments = async (
  entityType: AttachmentEntityType,
  entityId: number,
  files: File[]
): Promise<AttachmentResponse[]> => {
  const form = new FormData();
  files.forEach((f) => form.append("files", f));
  const { data } = await axios.post<AttachmentResponse[]>(
    `${API_URL}/attachments/${entityType}/${entityId}`,
    form,
    { headers: { ...authHeaders(), "Content-Type": "multipart/form-data" } }
  );
  return data;
};

// DELETE /api/attachments/:id
export const deleteAttachment = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/attachments/${id}`, {
    headers: authHeaders(),
  });
};