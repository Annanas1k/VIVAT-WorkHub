export type ProjectStatus = 'active' | 'on_hold' | 'completed' | 'cancelled';


export interface ProjectMember {
    id: number;
    userId: number;
    projectId: number;
    joinedAt: Date | string;
}

export interface ProjectMemberWithUser extends ProjectMember {
    user: {
        id: number;
        name: string;
        email: string;
        avatar: string | null;
    }
}

export interface Project {
    id: number;
    name: string;
    status: ProjectStatus;
    description?: string | null;
    budget?: number;
    startDate?: Date | string;
    dueDate?: Date | string;

    customerId?: number;
    customer: {
        name: string;
    }

    createdById?: number;
    createdAt: Date | string;
    updatedAd: Date | string;



    members: ProjectMemberWithUser[]
}