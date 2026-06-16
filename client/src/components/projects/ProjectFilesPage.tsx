import { useParams } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { AttachmentsPanel } from "../../components/attachment/AttachmentsPanel";

export const ProjectFilesPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const projectId = Number(id);

  return (
    <div className=" flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">Fișiere</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Toate fișierele atașate acestui proiect
          </p>
        </div>
      </div>

      {/* Panel */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <AttachmentsPanel
          entityType="project"
          entityId={projectId}
          currentUserId={user?.id}
          currentUserRole={user?.role}
        />
      </div>
    </div>
  );
};