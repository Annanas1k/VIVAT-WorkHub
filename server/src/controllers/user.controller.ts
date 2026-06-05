import { Request, Response } from "express";
import prisma from "../config/prisma";
import { AuthRequest } from '../middleware/auth.middleware';
import { role } from "@prisma/client"; 
import bcrypt from 'bcryptjs';
import { JsonArray } from '../../generated/prisma/internal/prismaNamespace';
import jwt from 'jsonwebtoken';
import { uploadAvatar } from "../middleware/upload.middleware";





// Extragem toate valorile validede roluri pentru validare directă în runtime
const validRoles = Object.values(role);



// ─────────────────────────────────────────
// GET /admin/users
// ─────────────────────────────────────────

export const getUsersHandler = async (req: Request, res: Response): Promise<any> => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                role: true,
                phone: true,
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


// ─────────────────────────────────────────
// GET /users/:id
// ─────────────────────────────────────────

export const getUserByIdHandler = async (req: Request, res: Response): Promise<any> =>{
  const {id} = req.params
  
  try{
      const user = await prisma.user.findUnique({
        where: {id: Number(id)},
        select: { id: true, name: true, email: true, role: true, avatar: true, phone: true }
      })

      if(!user){
        return res.status(404).json({error: 'user not found'})
      }
      return res.status(200).json( user );

  }catch(error){
    console.error(error)
    return res.status(500).json({error: 'server error'})
  }
}

// ─────────────────────────────────────────
// POST /users
// ─────────────────────────────────────────
export const createUserHandler = async (req: AuthRequest, res: Response): Promise<any> => {
  const { name, email, password, phone, role: userRole } = req.body;
 
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required.' });
  }
 
  const validRoles = Object.values(role);
  if (userRole && !validRoles.includes(userRole)) {
    return res.status(400).json({ error: `Invalid role. Valid roles: ${validRoles.join(', ')}` });
  }
 
  try {
    // Verificăm dacă email-ul există deja
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'A user with this email already exists.' });
    }
 
    // Verificăm unicitatea telefonului dacă e furnizat
    if (phone) {
      const existingPhone = await prisma.user.findFirst({ where: { phone } });
      if (existingPhone) {
        return res.status(409).json({ error: 'Phone number already in use.' });
      }
    }
 
    const hashedPassword = await bcrypt.hash(password, 10);
 
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        role: userRole || 'member',
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        phone: true,
        createdAt: true,
      },
    });
 
    return res.status(201).json({ user: newUser });
  } catch (error) {
    console.error('adminCreateUser Error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};
 


// ─────────────────────────────────────────
// PATCH /users/:id
// ─────────────────────────────────────────
export const updateUserHandler = async (req: AuthRequest, res: Response): Promise<any> => {
  const { id } = req.params;
  const { name, email, phone, role: newRole, password } = req.body;
 
  const validRoles = Object.values(role);
  if (newRole && !validRoles.includes(newRole)) {
    return res.status(400).json({ error: `Invalid role. Valid roles: ${validRoles.join(', ')}` });
  }
 
  try {
    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
 
    const updateData: any = {};
 
    if (name) updateData.name = name;
    if (newRole) updateData.role = newRole;
 
    if (email && email !== user.email) {
      const emailTaken = await prisma.user.findUnique({ where: { email } });
      if (emailTaken) {
        return res.status(409).json({ error: 'Email already in use by another account.' });
      }
      updateData.email = email;
    }
 
    if (phone !== undefined) {
      if (phone !== '' && phone !== user.phone) {
        const phoneTaken = await prisma.user.findFirst({
          where: { phone, NOT: { id: Number(id) } },
        });
        if (phoneTaken) {
          return res.status(409).json({ error: 'Phone number already in use by another account.' });
        }
      }
      updateData.phone = phone || null;
    }
 
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
 
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        phone: true,
        createdAt: true,
      },
    });
 
    return res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error('adminUpdateUser Error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

// ─────────────────────────────────────────
// DELETE /users/:id
// ─────────────────────────────────────────
export const deleteUserHandler = async (req: AuthRequest, res: Response): Promise<any> => {
  const { id } = req.params;
 
  if (Number(req.user?.userId) === Number(id)) {
    return res.status(400).json({ error: 'You cannot delete your own account.' });
  }
 
  try {
    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
 
    await prisma.user.delete({ where: { id: Number(id) } });
 
    return res.status(200).json({ message: `User "${user.name}" deleted successfully.` });
  } catch (error) {
    console.error('adminDeleteUser Error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};












export const updateRoleHandler = async (req: AuthRequest, res: Response): Promise<any> => {
      console.log('PATCH HIT', req.params, req.body, req.user); 
  const { id } = req.params;
  const { role: newRole } = req.body; 

  const targetId = Number(id); 

  if (Number(req.user?.userId) === targetId) {
    return res.status(400).json({ error: 'You cannot change your own role' });
  }

  try {
    const updated = await prisma.user.update({
      where: { id: targetId }, 
      data: { role: newRole },
      select: { id: true, name: true, email: true, role: true }
    });
    
    return res.status(200).json({ user: updated });
  } catch (error) {
    console.error("Update Role Error:", error);
    return res.status(500).json({ error: 'Server error' });
  }
};


export const updateProfileHandler = async (req: AuthRequest, res: Response): Promise<any> => {
  const { userId } = req.user!;
  const { name, currentPassword, newPassword, phone } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
    if (!user) {
      return res.status(404).json({ error: 'user not found' });
    }

    const updateData: any = {};

    if (name) updateData.name = name;

    // Validare phone unic — verificăm dacă numărul există la alt user
    if (phone !== undefined) {
      if (phone !== '') {
        const existingPhone = await prisma.user.findFirst({
          where: {
            phone: phone,
            NOT: { id: Number(userId) }, // excludem userul curent
          },
        });

        if (existingPhone) {
          return res.status(400).json({ error: 'Phone number already in use by another account.' });
        }
      }
      updateData.phone = phone;
    }

    if (req.file) {
      updateData.avatar = `http://localhost:3000/uploads/avatars/${req.file.filename}`;
    }

    if (newPassword) {
      if (user.googleId) {
        return res.status(400).json({ error: 'Google accounts cannot change password here!' });
      }
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password is required!' });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password || '');
      if (!isMatch) {
        return res.status(400).json({ error: 'Incorrect current password.' });
      }
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(userId) },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        phone: true,
        googleId: true,
      },
    });

    const newToken = jwt.sign(
      {
        userId: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
        name: updatedUser.name,
        avatar: updatedUser.avatar,
        phone: updatedUser.phone,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '2d' }
    );

    return res.status(200).json({ user: updatedUser, token: newToken });
  } catch (error) {
    console.error('error: ', error);
    return res.status(500).json({ error: 'Server error' });
  }
};
