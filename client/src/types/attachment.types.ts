export type AttachmentEntityType = "project" | "task";

export interface AttachmentResponse {
  id: number;
  filename: string;
  storedName: string;
  mimetype: string;
  size: number;
  path: string;
  entityType: AttachmentEntityType;
  entityId: number;
  uploadedById: number | null;
  uploadedBy: { id: number; name: string; avatar: string | null } | null;
  createdAt: string;
}