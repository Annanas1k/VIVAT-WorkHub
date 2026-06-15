import { useEffect, useState, useCallback } from "react";
import { Willow } from "@svar-ui/react-core";
import { Comments } from "@svar-ui/react-comments";
import { BeatLoader } from "react-spinners";
import {
  fetchComments,
  createComment,
  updateComment,
  deleteComment,
} from "../../services/comments.service";
import type { CommentEntityType, SvarComment } from "../../types/comments.types";
import MessageRenderer from "./MessageRenderer";

interface CommentsPanelProps {
  entityType: CommentEntityType;
  entityId: number;
  currentUserId: number;
}

// Tipul corect pentru onChange — SVAR pasează un obiect cu aceste câmpuri
interface SvarChangeEvent {
  action: "add" | "update" | "delete";
  id?: number | string;
  comment?: { content: string; [key: string]: unknown };
  data: SvarComment[];
}

export function CommentsPanel({
  entityType,
  entityId,
  currentUserId,
}: CommentsPanelProps) {
  const [comments, setComments] = useState<SvarComment[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchComments(entityType, entityId)
      .then((data) => { if (active) setComments(data); })
      .catch((err) => { if (active) setError(err?.message ?? "Eroare server"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [entityType, entityId]);

  const handleChange = useCallback(
    async ({ action, id, comment, data }: SvarChangeEvent) => {
      // Setăm imediat starea optimistă
      setComments(data);

      try {
        if (action === "add" && comment) {
          await createComment(entityType, entityId, comment.content);
          const fresh = await fetchComments(entityType, entityId);
          setComments(fresh);
        }
        if (action === "update" && id && comment) {
          await updateComment(Number(id), comment.content);
        }
        if (action === "delete" && id) {
          await deleteComment(Number(id));
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`[CommentsPanel] ${action} failed:`, msg);
        // Rollback la starea din server
        fetchComments(entityType, entityId)
          .then(setComments)
          .catch(console.error);
      }
    },
    [entityType, entityId]
  );

  if (error) {
    return (
      <div className="p-6 text-sm text-red-500 flex items-center gap-2">
        <span>⚠️</span>
        <span>error: {error}</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <BeatLoader size={12} color="#4D179A" loading />
      </div>
    );
  }

  return (
    <Willow>
      <Comments
        value={comments}
        activeUser={currentUserId}
        onChange={handleChange}
        format="text"
        render={MessageRenderer}
      />
    </Willow>
  );
}