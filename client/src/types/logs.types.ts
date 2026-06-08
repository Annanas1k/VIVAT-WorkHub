

export interface ActivityLog {
  id: number;
  performedById: number | null;
  action: 'created' | 'updated' | 'deleted' | 'login' | 'logout' | 'password_changed' | 'role_changed' | 'assigned' | 'unassigned';
  entityType: string;
  entityId: number;
  note: string | null;
  createdAt: string;
}

export interface GetLogsResponse {
    logs: ActivityLog[]
}

export interface DetailedActivityLog {
  id: number;
  performedById: number | null;
  action: string;
  entityType: string;
  entityId: number;
  before: any;
  after: any;
  ip: string | null;
  userAgent: string | null;
  note: string | null;
  createdAt: string;
}

export interface DetailedLogResponse {
    log: DetailedActivityLog
}