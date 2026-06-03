import { Request, Response } from "express";
import prisma from "../config/prisma";
import { AuthRequest } from '../middleware/auth.middleware';
import { role } from "@prisma/client"; 

// Extragem toate valorile validede roluri pentru validare directă în runtime
const validRoles = Object.values(role);

export const getUsersHandler = async (req: Request, res: Response): Promise<any> => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                role: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'asc' }
        });
        return res.status(200).json({ users });
    } catch (error) {
        console.error("Get Users Error:", error);
        return res.status(500).json({ error: 'server error' });
    }
};



export const updateRoleHandler = async (req: AuthRequest, res: Response): Promise<any> => {
      console.log('PATCH HIT', req.params, req.body, req.user); // ← adaugă asta
  const { id } = req.params;
  const { role: newRole } = req.body; 

  const targetId = Number(id); 

  if (Number(req.user?.userId) === targetId) {
    return res.status(400).json({ error: 'You cannot change your own role' });
  }

  try {
    const updated = await prisma.user.update({
      where: { id: targetId }, // Forțat numeric
      data: { role: newRole },
      select: { id: true, name: true, email: true, role: true }
    });
    
    return res.status(200).json({ user: updated });
  } catch (error) {
    console.error("Update Role Error:", error);
    return res.status(500).json({ error: 'Server error' });
  }
};