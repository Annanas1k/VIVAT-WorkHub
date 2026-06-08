import { Response } from "express"
import prisma from "../config/prisma"
import { AuthRequest } from "../middleware/auth.middleware"
import { logActivity } from "../utils/logger";

// ─────────────────────────────────────────
// GET /api/projects
// ─────────────────────────────────────────

export const getAllProjectsHandler = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const projects = await prisma.project.findMany({
            include: {
                createdBy: { select: { id: true, name: true, avatar: true } },
                customer: { select: { id: true, name: true, type: true } },
                members: {
                    include: {
                        user: { select: { id: true, name: true, avatar: true, role: true } }
                    }
                },
                tasks: { select: { id: true, title: true, status: true, priority: true } }
            },
            orderBy: { createdAt: 'desc' }
        })

        return res.status(200).json({ projects })
    } catch (error) {
        console.error('getAllProjects error:', error)
        return res.status(500).json({ error: 'server error' })
    }
}

// ─────────────────────────────────────────
// GET /api/projects/:id
// ─────────────────────────────────────────

export const getProjectByIdHandler = async (req: AuthRequest, res: Response): Promise<any> => {
    const { id } = req.params

    try {
        const project = await prisma.project.findUnique({
            where: { id: Number(id) },
            include: {
                createdBy: { select: { id: true, name: true, avatar: true } },
                customer: { select: { id: true, name: true, type: true, email: true, phone: true } },
                members: {
                    include: {
                        user: { select: { id: true, name: true, avatar: true, role: true } }
                    }
                },
                tasks: {
                    include: {
                        assignees: {
                            include: {
                                user: { select: { id: true, name: true, avatar: true } }
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                }
            }
        })

        if (!project) return res.status(404).json({ error: 'Project not found' })

        return res.status(200).json({ project })
    } catch (error) {
        console.error('getProjectById error:', error)
        return res.status(500).json({ error: 'server error' })
    }
}

// ─────────────────────────────────────────
// POST /api/projects
// ─────────────────────────────────────────

export const createProjectHandler = async (req: AuthRequest, res: Response): Promise<any> => {
    const { userId } = req.user!
    const { name, description, status, startDate, dueDate, budget, customerId, memberIds } = req.body

    if (!name) return res.status(400).json({ error: 'Project name is required' })

    try {
        if (customerId) {
            const customer = await prisma.customer.findUnique({ where: { id: Number(customerId) } })
            if (!customer) return res.status(404).json({ error: 'Customer not found' })
        }

        const project = await prisma.project.create({
            data: {
                name,
                description,
                status: status || 'active',
                startDate: startDate ? new Date(startDate) : undefined,
                dueDate: dueDate ? new Date(dueDate) : undefined,
                budget: budget ? Number(budget) : undefined,
                customerId: customerId ? Number(customerId) : undefined,
                createdById: Number(userId),
                members: memberIds?.length
                    ? {
                        create: memberIds.map((uid: number) => ({
                            userId: Number(uid),
                            role: 'member'
                        }))
                    }
                    : undefined
            },
            include: {
                createdBy: { select: { id: true, name: true, avatar: true } },
                customer: { select: { id: true, name: true } },
                members: {
                    include: {
                        user: { select: { id: true, name: true, avatar: true } }
                    }
                }
            }
        })

        await logActivity({
            performedById: Number(userId),
            action: 'created',
            entityType: 'Project',
            entityId: project.id,
            before: null,
            after: project,
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            note: `Proiectul "${project.name}" a fost inițializat în sistem.`
        });

        return res.status(201).json({ project })
    } catch (error) {
        console.error('createProject error:', error)
        return res.status(500).json({ error: 'server error' })
    }
}

// ─────────────────────────────────────────
// PATCH /api/projects/:id
// ─────────────────────────────────────────

export const updateProjectHandler = async (req: AuthRequest, res: Response): Promise<any> => {
    const { id } = req.params
    const { name, description, status, startDate, dueDate, budget, customerId } = req.body

    try {
        const project = await prisma.project.findUnique({ where: { id: Number(id) } })
        if (!project) return res.status(404).json({ error: 'Project not found' })

        if (customerId) {
            const customer = await prisma.customer.findUnique({ where: { id: Number(customerId) } })
            if (!customer) return res.status(404).json({ error: 'Customer not found' })
        }

        const updateData: any = {}
        if (name) updateData.name = name
        if (description !== undefined) updateData.description = description
        if (status !== undefined) updateData.status = status
        if (startDate !== undefined) updateData.startDate = startDate ? new Date(startDate) : null
        if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null
        if (budget !== undefined) updateData.budget = budget ? Number(budget) : null
        if (customerId !== undefined) updateData.customerId = customerId ? Number(customerId) : null

        const updated = await prisma.project.update({
            where: { id: Number(id) },
            data: updateData,
            include: {
                createdBy: { select: { id: true, name: true, avatar: true } },
                customer: { select: { id: true, name: true } },
                members: {
                    include: {
                        user: { select: { id: true, name: true, avatar: true } }
                    }
                }
            }
        })

        await logActivity({
            performedById: Number(req.user!.userId),
            action: 'updated',
            entityType: 'Project',
            entityId: updated.id,
            before: null,
            after: updated,
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            note: `Proiectul "${updated.name}" a fost actualizat.`
        });

        return res.status(200).json({ project: updated })
    } catch (error) {
        console.error('updateProject error:', error)
        return res.status(500).json({ error: 'server error' })
    }
}

// ─────────────────────────────────────────
// DELETE /api/projects/:id
// ─────────────────────────────────────────

export const deleteProjectHandler = async (req: AuthRequest, res: Response): Promise<any> => {
    const { id } = req.params

    try {
        const project = await prisma.project.findUnique({ where: { id: Number(id) } })
        if (!project) return res.status(404).json({ error: 'Project not found' })

        await prisma.project.delete({ where: { id: Number(id) } })

        await logActivity({
            performedById: Number(req.user!.userId),
            action: 'deleted',
            entityType: 'Project',
            entityId: Number(id),
            before: project,
            after: null,
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            note: `Proiectul "${project.name}" a fost șters definitiv.`
        });

        return res.status(200).json({ message: `Project: ${project.name} was successfully deleted` })
    } catch (error) {
        console.error('deleteProject error:', error)
        return res.status(500).json({ error: 'server error' })
    }
}

// ─────────────────────────────────────────
// POST /api/projects/:id/members
// ─────────────────────────────────────────

export const addProjectMemberHandler = async (req: AuthRequest, res: Response): Promise<any> => {
    const { id } = req.params
    const { userId, role } = req.body

    if (!userId) return res.status(400).json({ error: 'userId is required' })

    try {
        const project = await prisma.project.findUnique({ where: { id: Number(id) } })
        if (!project) return res.status(404).json({ error: 'Project not found' })

        const user = await prisma.user.findUnique({ where: { id: Number(userId) } })
        if (!user) return res.status(404).json({ error: 'User not found' })

        const existing = await prisma.projectMember.findUnique({
            where: { userId_projectId: { userId: Number(userId), projectId: Number(id) } }
        })
        if (existing) return res.status(409).json({ error: 'User is already a member of this project' })

        const member = await prisma.projectMember.create({
            data: {
                userId: Number(userId),
                projectId: Number(id),
                role: role || 'member'
            },
            include: {
                user: { select: { id: true, name: true, avatar: true, role: true } }
            }
        })

        await logActivity({
            performedById: Number(req.user!.userId),
            action: 'assigned',
            entityType: 'Project',
            entityId: Number(id),
            before: null,
            after: member,
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            note: `Utilizatorul ${member.user.name} a fost adăugat în echipă cu rolul de "${member.role}".`
        });

        return res.status(201).json({ member })
    } catch (error) {
        console.error('addProjectMember error:', error)
        return res.status(500).json({ error: 'server error' })
    }
}

// ─────────────────────────────────────────
// DELETE /api/projects/:id/members/:userId
// ─────────────────────────────────────────

export const removeProjectMemberHandler = async (req: AuthRequest, res: Response): Promise<any> => {
    const { id, userId } = req.params

    try {
        const member = await prisma.projectMember.findUnique({
            where: { userId_projectId: { userId: Number(userId), projectId: Number(id) } }
        })
        if (!member) return res.status(404).json({ error: 'Member not found in this project' })

        await prisma.projectMember.delete({
            where: { userId_projectId: { userId: Number(userId), projectId: Number(id) } }
        })

        await logActivity({
            performedById: Number(req.user!.userId),
            action: 'unassigned',
            entityType: 'Project',
            entityId: Number(id),
            before: member,
            after: null,
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            note: `Utilizatorul ${member} a fost eliminat din echipa proiectului.`
        });

        return res.status(200).json({ message: 'Member removed from project' })
    } catch (error) {
        console.error('removeProjectMember error:', error)
        return res.status(500).json({ error: 'server error' })
    }
}