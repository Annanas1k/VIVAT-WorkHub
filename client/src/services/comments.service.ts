// services/comments.service.ts
import axios from "axios";
import type { CommentEntityType, CommentResponse, SvarComment } from "../types/comments.types";

const API_URL = import.meta.env.VITE_API_URL;

// ─── Transformă răspunsul backend → format SVAR ──────────────
const toSvarComment = (c: CommentResponse): SvarComment => ({
  id: String(c.id),
  content: c.content,
  date: new Date(c.createdAt),
  author: {
    id: c.author.id,
    name: c.author.name,
    avatar: c.author.avatar
  },
});

// ─── Header cu token din localStorage ────────────────────────
const authHeaders = () => {
  const token = localStorage.getItem("app_token");
  return { Authorization: `Bearer ${token}` };
};

// GET /api/comments/:entityType/:entityId
export const fetchComments = async (entityType: CommentEntityType, entityId: number ): Promise<SvarComment[]> => {
  const { data } = await axios.get<CommentResponse[]>(
    `${API_URL}/comments/${entityType}/${entityId}`,
    { headers: authHeaders() }
  );
  return data.map(toSvarComment);
};

// POST /api/comments/:entityType/:entityId
export const createComment = async (entityType: CommentEntityType, entityId: number, content: string ): Promise<SvarComment> => {
  const { data } = await axios.post<CommentResponse>(
    `${API_URL}/comments/${entityType}/${entityId}`,
    { content },
    { headers: authHeaders() }
  );
  return toSvarComment(data);
};

// PUT /api/comments/:commentId
export const updateComment = async ( commentId: string, content: string ): Promise<void> => {
  await axios.put(
    `${API_URL}/comments/${commentId}`,
    { content },
    { headers: authHeaders() }
  );
};

// DELETE /api/comments/:commentId
export const deleteComment = async (commentId: string): Promise<void> => {
  await axios.delete(`${API_URL}/comments/${commentId}`, {
    headers: authHeaders(),
  });
};