import React, { useRef, useCallback, memo, useState } from "react";
import { useAttachments } from "../../hooks/useAttachments";
import { BeatLoader } from "react-spinners";
import type { AttachmentEntityType, AttachmentResponse } from "../../types/attachment.types";
import { FiExternalLink, FiTrash2, FiFile } from "react-icons/fi";
import { FaFilePdf, FaFileWord, FaFileExcel, FaFileArchive } from "react-icons/fa";

const API_BASE_URL = (import.meta.env.VITE_API_URL as string || "http://localhost:5000").replace(/\/api$/, "");

type FilterType = "all" | "images" | "files";

function getFileDesign(mimetype: string) {
  if (mimetype === "application/pdf")
    return { icon: <FaFilePdf className="text-red-500" size={26} />, bg: "bg-red-50" };
  if (mimetype.includes("word"))
    return { icon: <FaFileWord className="text-blue-500" size={26} />, bg: "bg-blue-50" };
  if (mimetype.includes("excel") || mimetype.includes("spreadsheet"))
    return { icon: <FaFileExcel className="text-emerald-500" size={26} />, bg: "bg-emerald-50" };
  if (mimetype.includes("zip") || mimetype.includes("rar"))
    return { icon: <FaFileArchive className="text-amber-500" size={26} />, bg: "bg-amber-50" };
  return { icon: <FiFile className="text-slate-400" size={26} />, bg: "bg-slate-100" };
}

interface FileCardProps {
  file: AttachmentResponse;
  currentUserId?: number;
  currentUserRole?: string;
  onDelete: (id: number) => void;
  entityType: string;
  entityId: number;
}

const FileCard = memo(({ file, currentUserId, currentUserRole, onDelete, entityType, entityId }: FileCardProps) => {
  const isImage = file.mimetype.startsWith("image/");
  const design = getFileDesign(file.mimetype);
  const canDelete =
    file.uploadedById === currentUserId ||
    ["admin", "manager"].includes(currentUserRole ?? "");

  const fileUrl = `${API_BASE_URL}/api/attachments/${entityType}/${entityId}/${file.filename}`;

  return (
    <div className="group w-full relative flex flex-col bg-white border border-slate-100 hover:border-slate-200 rounded-xl overflow-hidden transition-all h-37">
      {/* Media zone */}
      <div className="flex-1 flex items-center justify-center bg-slate-50 min-h-0 overflow-hidden">
        {isImage ? (
          <img
            src={fileUrl}
            alt={file.filename}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://placehold.co/200x120?text=Preview";
            }}
          />
        ) : (
          <div className={`w-12 h-12 rounded-xl ${design.bg} flex items-center justify-center`}>
            {design.icon}
          </div>
        )}
      </div>

      {/* Info zone */}
      <div className="px-2.5 py-2 border-t border-slate-100 shrink-0">
        <p className="text-[11px] font-semibold text-slate-700 truncate leading-tight">
          {file.filename}
        </p>
        <p className="text-[10px] text-slate-400 mt-0.5">
          {file.size ? `${Math.round(file.size / 1024)} KB · ` : ""}
          {new Date(file.createdAt).toLocaleDateString("ro-RO")}
        </p>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-slate-900/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-xl">
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 bg-white/90 hover:bg-white rounded-lg flex items-center justify-center text-slate-700 transition-colors shadow-sm"
          title="Deschide"
        >
          <FiExternalLink size={14} />
        </a>
        {canDelete && (
          <button
            onClick={() => onDelete(file.id)}
            className="w-8 h-8 bg-white/90 hover:bg-white rounded-lg flex items-center justify-center text-red-500 transition-colors shadow-sm"
            title="Șterge"
          >
            <FiTrash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
});

FileCard.displayName = "FileCard";

interface Props {
  entityType: AttachmentEntityType;
  entityId: number;
  currentUserId?: number;
  currentUserRole?: string;
}

export function AttachmentsPanel({ entityType, entityId, currentUserId, currentUserRole }: Props) {
  const { attachments, loading, uploading, upload, remove } = useAttachments(entityType, entityId);
  const inputRef = useRef<HTMLInputElement>(null);
  const [filter, setFilter] = useState<FilterType>("all");

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files?.length) return;
    upload(Array.from(files));
  }, [upload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const filtered = attachments.filter((f) => {
    if (filter === "images") return f.mimetype.startsWith("image/");
    if (filter === "files") return !f.mimetype.startsWith("image/");
    return true;
  });

  const imgCount = attachments.filter((f) => f.mimetype.startsWith("image/")).length;
  const fileCount = attachments.filter((f) => !f.mimetype.startsWith("image/")).length;

  return (
    <div className="flex flex-col gap-4">
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-slate-200 hover:border-violet-300 hover:bg-violet-50/40 rounded-xl p-5 flex flex-col items-center gap-1.5 cursor-pointer transition-colors"
      >
        <span className="text-2xl">📁</span>
        <p className="text-[12px] font-medium text-slate-600">
          {uploading ? "Se încarcă..." : "Trage fișiere aici sau click pentru a selecta"}
        </p>
        <p className="text-[10px] text-slate-400">Orice tip · max 50 MB · max 10 odată</p>
        <input ref={inputRef} type="file" multiple className="hidden"
          onChange={(e) => handleFiles(e.target.files)} />
      </div>

      {uploading && (
        <div className="flex items-center gap-2 px-1">
          <BeatLoader size={5} color="#7C3AED" />
          <span className="text-[11px] text-slate-500">Se încarcă fișierele...</span>
        </div>
      )}

      {/* Filters */}
      {attachments.length > 0 && (
        <div className="flex gap-2">
          {([
            { key: "all", label: "Toate", count: attachments.length },
            { key: "images", label: "Imagini", count: imgCount },
            { key: "files", label: "Fișiere", count: fileCount },
          ] as const).map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all ${
                filter === key
                  ? "bg-violet-600 text-white border-violet-600"
                  : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
              }`}
            >
              {label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                filter === key ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
              }`}>
                {count}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-6">
          <BeatLoader size={8} color="#7C3AED" />
        </div>
      ) : attachments.length === 0 ? (
        <p className="text-[12px] text-slate-400 text-center py-4">Niciun fișier atașat încă.</p>
      ) : filtered.length === 0 ? (
        <p className="text-[12px] text-slate-400 text-center py-4">Niciun fișier în această categorie.</p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-2.5">
          {filtered.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              currentUserId={currentUserId}
              currentUserRole={currentUserRole}
              onDelete={remove}
              entityType={entityType}
              entityId={entityId}
            />
          ))}
        </div>
      )}
    </div>
  );
}