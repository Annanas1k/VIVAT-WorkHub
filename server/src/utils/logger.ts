// src/utils/logger.ts
import prisma from "../config/prisma"
import { Prisma } from '@prisma/client'; // Sau direct '@prisma/client'

interface LogActivityInput {
  performedById?: number | null;
  action: Prisma.ActivityLogCreateInput['action']; 
  entityType: string;
  entityId: number;
  before?: Prisma.InputJsonValue | null;
  after?: Prisma.InputJsonValue | null;
  ip?: string | null;
  userAgent?: string | null;
  note?: string | null;
}

/**
 * Înregistrează o acțiune a utilizatorului în tabelul ActivityLog.
 * Nu blochează execuția principală în caz de eroare.
 */
export const logActivity = async (data: LogActivityInput): Promise<void> => {
  try {
    await prisma.activityLog.create({
      data: {
        performedById: data.performedById,
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        before: data.before ?? Prisma.DbNull,
        after: data.after ?? Prisma.DbNull,
        ip: data.ip,
        userAgent: data.userAgent,
        note: data.note,
      },
    });
  } catch (error) {
    // Dacă eșuează salvarea logului în DB, o trimitem în consola de sistem/fișier ca să nu crape aplicația principală
    console.error('⚠️ Critical Error: Failed to save ActivityLog to Database:', error);
  }
};