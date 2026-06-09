import prisma from "../config/prisma"
import { AuthRequest } from "../middleware/auth.middleware"
import { Response } from "express"

// ─────────────────────────────────────────
// GET /api/logs
// ─────────────────────────────────────────
export const getAllLogsHandlers = async (req: AuthRequest, res: Response): Promise<any> =>{
    try{
        const logs = await prisma.activityLog.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            take: 50,
            include: {
                performedBy: {
                    select: {
                        id: true,
                        name: true,
                        role: true
                    }
                }
            }
        })

        res.status(200).json({logs})
    }catch(error){
        console.error('getAllLogs error: ', error)
        return res.status(500).json({error: 'server error'})
    }

}

export const getLogByIdHandler = async (req: AuthRequest, res: Response): Promise<any> =>{
    const {id} = req.params
    try{
        const log = await prisma.activityLog.findUnique({
            where: {id: Number(id)},
            include: {
                performedBy: {
                    select: {
                        id: true,
                        name: true,
                        role: true
                    }
                }
            }
            
        })
        if(!log) return res.status(404).json({error: 'log with this id not found'})
        
        return res.status(200).json({log})
    }catch(error){
        console.error('getOneLog error: ', error)
        return res.status(500).json({error: ' server error'})
    }
}