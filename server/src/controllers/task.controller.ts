import { Response } from "express"
import prisma from "../config/prisma"
import { AuthRequest } from "../middleware/auth.middleware"

// ─────────────────────────────────────────
// GET /api/tasks
// ─────────────────────────────────────────

export const getAllTasksHandler = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const tasks = await prisma.task.findMany({
            include: {
                createdBy: { select: { id: true, name: true, avatar: true } },
                project: { select: { id: true, name: true, status: true } },
                assignees: {
                    include: {
                        user: { select: { id: true, name: true, avatar: true } }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        return res.status(200).json({ tasks })
    } catch (error) {
        console.error('getAllTasks error:', error)
        return res.status(500).json({ error: 'server error' })
    }
}

// ─────────────────────────────────────────
// GET /api/tasks/:id
// ─────────────────────────────────────────

export const getTaskByIdHandler = async (req: AuthRequest, res: Response): Promise<any> => {
    const { id } = req.params

    try {
        const task = await prisma.task.findUnique({
            where: { id: Number(id) },
            include: {
                createdBy: { select: { id: true, name: true, avatar: true } },
                project: { select: { id: true, name: true, status: true, dueDate: true } },
                assignees: {
                    include: {
                        user: { select: { id: true, name: true, avatar: true, role: true } }
                    }
                }
            }
        })

        if (!task) return res.status(404).json({ error: 'Task not found' })

        return res.status(200).json({ task })
    } catch (error) {
        console.error('getTaskById error:', error)
        return res.status(500).json({ error: 'server error' })
    }
}

// ─────────────────────────────────────────
// POST /api/tasks
// ─────────────────────────────────────────

export const createTaskHandler = async (req: AuthRequest, res: Response): Promise<any> => {
    const { userId } = req.user!
    const { title, description, status, priority, dueDate, projectId, assigneeIds } = req.body

    if (!title) return res.status(400).json({ error: 'Task title is required' })

    try {
        if (projectId) {
            const project = await prisma.project.findUnique({ where: { id: Number(projectId) } })
            if (!project) return res.status(404).json({ error: 'Project not found' })
        }

        const task = await prisma.task.create({
            data: {
                title,
                description,
                status: status || 'backlog',
                priority: priority || 'medium',
                dueDate: dueDate ? new Date(dueDate) : undefined,
                projectId: projectId ? Number(projectId) : undefined,
                createdById: Number(userId),
                assignees: assigneeIds?.length
                    ? {
                        create: assigneeIds.map((uid: number) => ({
                            userId: Number(uid)
                        }))
                    }
                    : undefined
            },
            include: {
                createdBy: { select: { id: true, name: true, avatar: true } },
                project: { select: { id: true, name: true } },
                assignees: {
                    include: {
                        user: { select: { id: true, name: true, avatar: true } }
                    }
                }
            }
        })

        return res.status(201).json({ task })
    } catch (error) {
        console.error('createTask error:', error)
        return res.status(500).json({ error: 'server error' })
    }
}

// ─────────────────────────────────────────
// PATCH /api/tasks/:id
// ─────────────────────────────────────────

export const updateTaskHandler = async (req: AuthRequest, res: Response): Promise<any> => {
    const { id } = req.params
    const { title, description, status, priority, dueDate, projectId } = req.body

    try {
        const task = await prisma.task.findUnique({ where: { id: Number(id) } })
        if (!task) return res.status(404).json({ error: 'Task not found' })

        if (projectId) {
            const project = await prisma.project.findUnique({ where: { id: Number(projectId) } })
            if (!project) return res.status(404).json({ error: 'Project not found' })
        }

        const updateData: any = {}
        if (title) updateData.title = title
        if (description !== undefined) updateData.description = description
        if (status !== undefined) updateData.status = status
        if (priority !== undefined) updateData.priority = priority
        if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null
        if (projectId !== undefined) updateData.projectId = projectId ? Number(projectId) : null

        const updated = await prisma.task.update({
            where: { id: Number(id) },
            data: updateData,
            include: {
                createdBy: { select: { id: true, name: true, avatar: true } },
                project: { select: { id: true, name: true } },
                assignees: {
                    include: {
                        user: { select: { id: true, name: true, avatar: true } }
                    }
                }
            }
        })

        return res.status(200).json({ task: updated })
    } catch (error) {
        console.error('updateTask error:', error)
        return res.status(500).json({ error: 'server error' })
    }
}

// ─────────────────────────────────────────
// DELETE /api/tasks/:id
// ─────────────────────────────────────────

export const deleteTaskHandler = async (req: AuthRequest, res: Response): Promise<any> => {
    const { id } = req.params

    try {
        const task = await prisma.task.findUnique({ where: { id: Number(id) } })
        if (!task) return res.status(404).json({ error: 'Task not found' })

        await prisma.task.delete({ where: { id: Number(id) } })
        return res.status(200).json({ message: `Task: ${task.title} was successfully deleted` })
    } catch (error) {
        console.error('deleteTask error:', error)
        return res.status(500).json({ error: 'server error' })
    }
}

// ─────────────────────────────────────────
// POST /api/tasks/:id/assignees
// ─────────────────────────────────────────

export const addTaskAssigneeHandler = async (req: AuthRequest, res: Response): Promise<any> => {
    const { id } = req.params
    const { userId } = req.body

    if (!userId) return res.status(400).json({ error: 'userId is required' })

    try {
        const task = await prisma.task.findUnique({ where: { id: Number(id) } })
        if (!task) return res.status(404).json({ error: 'Task not found' })

        const user = await prisma.user.findUnique({ where: { id: Number(userId) } })
        if (!user) return res.status(404).json({ error: 'User not found' })

        const existing = await prisma.taskAssignee.findUnique({
            where: { userId_taskId: { userId: Number(userId), taskId: Number(id) } }
        })
        if (existing) return res.status(409).json({ error: 'User is already assigned to this task' })

        const assignee = await prisma.taskAssignee.create({
            data: {
                userId: Number(userId),
                taskId: Number(id)
            },
            include: {
                user: { select: { id: true, name: true, avatar: true, role: true } }
            }
        })

        return res.status(201).json({ assignee })
    } catch (error) {
        console.error('addTaskAssignee error:', error)
        return res.status(500).json({ error: 'server error' })
    }
}

// ─────────────────────────────────────────
// DELETE /api/tasks/:id/assignees/:userId
// ─────────────────────────────────────────

export const removeTaskAssigneeHandler = async (req: AuthRequest, res: Response): Promise<any> => {
    const { id, userId } = req.params

    try {
        const assignee = await prisma.taskAssignee.findUnique({
            where: { userId_taskId: { userId: Number(userId), taskId: Number(id) } }
        })
        if (!assignee) return res.status(404).json({ error: 'Assignee not found on this task' })

        await prisma.taskAssignee.delete({
            where: { userId_taskId: { userId: Number(userId), taskId: Number(id) } }
        })

        return res.status(200).json({ message: 'Assignee removed from task' })
    } catch (error) {
        console.error('removeTaskAssignee error:', error)
        return res.status(500).json({ error: 'server error' })
    }
}