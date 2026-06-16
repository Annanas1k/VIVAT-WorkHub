import  { memo } from "react";
import type { AttachmentResponse } from "../../types/attachment.types";

// Importuri specifice din react-icons pentru fișiere colorate nativ din seturile dedicate
import { FiTrash2, FiExternalLink, FiFile } from "react-icons/fi";
import { FaFilePdf, FaFileWord, FaFileExcel, FaFileArchive } from "react-icons/fa";
import { useFileUrl } from "../../hooks/useFileUrl";
interface FileCardProps {
  file: AttachmentResponse;
  currentUserId?: number;
  currentUserRole?: string;
  onDelete: (id: number) => void;
  t: (key: string) => string;
  entityType: string;
  entityId: number;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Maparea designului folosind componente din react-icons
const getFileDesign = (mimetype: string) => {
  if (mimetype === "application/pdf") {
    return { icon: <FaFilePdf className="text-red-500" size={28} />, bg: "bg-red-50" };
  }
  if (mimetype.includes("word")) {
    return { icon: <FaFileWord className="text-blue-500" size={28} />, bg: "bg-blue-50" };
  }
  if (mimetype.includes("excel") || mimetype.includes("spreadsheet")) {
    return { icon: <FaFileExcel className="text-emerald-500" size={28} />, bg: "bg-emerald-50" };
  }
  if (mimetype.includes("zip") || mimetype.includes("rar")) {
    return { icon: <FaFileArchive className="text-amber-500" size={28} />, bg: "bg-amber-50" };
  }
  return { icon: <FiFile className="text-slate-400" size={28} />, bg: "bg-slate-50" };
};

export const FileCard = memo(({ file, currentUserId, currentUserRole, onDelete, t, entityType, entityId }: FileCardProps) => {
  const isImage = file.mimetype.startsWith("image/");
  const design = getFileDesign(file.mimetype);
  
  const canDelete = file.uploadedById === currentUserId || ["admin", "manager"].includes(currentUserRole ?? "");

  // URL-ul stabil fără paza middleware-ului de GET de pe backend
  const fileUrl = `${API_BASE_URL}/api/attachments/${entityType}/${entityId}/${file.filename}`;
  const blobUrl = useFileUrl(fileUrl); // înlocuiește src-ul direct
  return (
    <div className="group relative flex flex-col justify-between bg-slate-50/50 hover:bg-white border border-slate-100 hover:border-slate-200 rounded-xl overflow-hidden transition-all p-3 h-40">
      
      {/* Zona de Sus: Imagine directă sau Iconiță */}
      <div className="flex-1 flex items-center justify-center min-h-0 w-full mb-2">
        {isImage && blobUrl ? (
            <img src={blobUrl} alt={file.filename} className="w-full h-full object-cover" />
            ) : isImage ? (
            <div className="w-full h-full bg-slate-100 animate-pulse" /> // skeleton cât se încarcă
            ) : (
            <div className={`w-12 h-12 rounded-xl ${design.bg} flex items-center justify-center`}>
                {design.icon}
            </div>
        )}
      </div>

      {/* Zona de Jos: Informații text */}
      <div className="w-full min-w-0">
        <p className="text-[12px] font-semibold text-slate-700 truncate leading-tight">
          {file.filename}
        </p>
        <p className="text-[10px] text-slate-400 mt-0.5">
          {new Date(file.createdAt).toLocaleDateString("ro-RO")}
        </p>
      </div>

      {/* Overlay-ul de Hover cu butoane react-icons */}
      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 backdrop-blur-[1px] transition-opacity flex items-center justify-center gap-2 rounded-xl">
        <button
        onClick={() => {
                const token = localStorage.getItem("token");
                fetch(fileUrl, { headers: { Authorization: `Bearer ${token}` } })
                .then(res => res.blob())
                .then(blob => {
                    const url = URL.createObjectURL(blob);
                    window.open(url, "_blank");
                    setTimeout(() => URL.revokeObjectURL(url), 10000);
                });
            }}
            className="w-8 h-8 bg-white/90 hover:bg-white rounded-lg flex items-center justify-center text-slate-700"
            title="Deschide"
            >
            <FiExternalLink size={14} />
        </button>
        
        {canDelete && (
          <button
            onClick={() => onDelete(file.id)}
            className="p-2 bg-white hover:bg-red-50 rounded-lg text-red-500 transition-colors shadow-sm"
            title={t("attachments.delete") || "Șterge"}
          >
            <FiTrash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
});

FileCard.displayName = "FileCard";