import { useState, useEffect } from "react";
import { getProjectMembers } from '../services/members.service';
import type { ProjectMember } from '../types/members.type';

export function useProjectMembers(projectId: number) {
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;
    
    getProjectMembers(projectId)
      .then((data) => setMembers(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [projectId]);

  return { members, loading };
}

// Helperi mutați aici pentru a nu aglomera componentele vizuale
const AVATAR_COLORS = ["bg-blue-500", "bg-emerald-500", "bg-indigo-500", "bg-violet-500", "bg-amber-500"];

export function getAvatarBg(name: string) {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

export function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}