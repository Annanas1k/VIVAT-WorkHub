// types/comments.types.ts

export type CommentEntityType = "project" | "task";

// Structura exactă cerută de SVAR Comments widget
export interface SvarComment {
  id: string;
  content: string;
  date: Date;
  author: {
    id: number;
    name: string;
    avatar: string;
  };
}

// Payload-ul primit în onChange de la SVAR
export interface SvarOnChange {
  action: "add" | "update" | "delete";
  id?: string;
  comment?: SvarComment;
  data: SvarComment[];
  originalValue: SvarComment[] | string | number;
}

// Ce vine de pe backend (Prisma include author)
export interface CommentResponse {
  id: number;
  content: string;
  entityType: CommentEntityType;
  entityId: number;
  authorId: number;
  author: {
    id: number;
    name: string;
    avatar: string;
  };
  createdAt: string;
  updatedAt: string;
}