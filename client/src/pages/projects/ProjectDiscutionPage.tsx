import { useParams } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { CommentsPanel } from "../../components/comments/CommentPanel";
import { useProjectMembers } from "../../hooks/useProjectMembers";
import { DiscussionSidebar } from "../../components/comments/DiscussionSidebar";

export const ProjectDiscussionPage = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const projectId = Number(id);
  const { members, loading: membersLoading } = useProjectMembers(projectId);

  return (
    <div className="flex h-170 w-full overflow-hidden bg-white">
      {/* Zona principală de comentarii */}
      <main className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <CommentsPanel
          entityType="project"
          entityId={projectId}
          currentUserId={user?.id}
        />
      </main>

      {/* Sidebar dreapta — membri */}
      <DiscussionSidebar
        members={members}
        loading={membersLoading}
        currentUser={user}
      />
    </div>
  );
};