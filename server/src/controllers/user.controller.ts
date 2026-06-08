import { Request, Response } from "express";
import prisma from "../config/prisma";
import { AuthRequest } from '../middleware/auth.middleware';
import { role } from "@prisma/client";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { uploadAvatar } from "../middleware/upload.middleware";
import { logActivity } from "../utils/logger";

const validRoles = Object.values(role);

// ─────────────────────────────────────────
// GET /api/users
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
      orderBy: { createdAt: 'asc' },
    });

    return res.status(200).json({ users });
  } catch (error) {
    console.error('getUsersHandler Error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

// ─────────────────────────────────────────
// GET /api/users/:id
// ─────────────────────────────────────────
export const getUserByIdHandler = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: { id: true, name: true, email: true, role: true, avatar: true, phone: true },
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    return res.status(200).json(user);
  } catch (error) {
    console.error('getUserByIdHandler Error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

// ─────────────────────────────────────────
// POST /api/users
// ─────────────────────────────────────────
export const createUserHandler = async (req: AuthRequest, res: Response): Promise<any> => {
  const { name, email, password, phone, role: userRole } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required.' });
  }

  if (userRole && !validRoles.includes(userRole)) {
    return res.status(400).json({ error: `Invalid role. Valid roles: ${validRoles.join(', ')}` });
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: 'A user with this email already exists.' });

    if (phone) {
      const existingPhone = await prisma.user.findFirst({ where: { phone } });
      if (existingPhone) return res.status(409).json({ error: 'Phone number already in use.' });
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
        id: true, name: true, email: true,
        avatar: true, role: true, phone: true, createdAt: true,
      },
    });

    await logActivity({
      performedById: req.user?.userId ? Number(req.user.userId) : null,
      action: 'created', 
      entityType: 'User',
      entityId: newUser.id,
      before: null,
      after: newUser,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      note: `User nou creat: ${newUser.name} (${newUser.email}) cu rolul ${newUser.role}.`
    });

    return res.status(201).json({ user: newUser });
  } catch (error) {
    console.error('createUserHandler Error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

// ─────────────────────────────────────────
// PATCH /api/users/:id
// Acoperă și schimbarea rolului — nu mai e nevoie de updateRoleHandler
// ─────────────────────────────────────────
export const updateUserHandler = async (req: AuthRequest, res: Response): Promise<any> => {
  const { id } = req.params;
  const { name, email, phone, role: newRole, password } = req.body;

  if (newRole && !validRoles.includes(newRole)) {
    return res.status(400).json({ error: `Invalid role. Valid roles: ${validRoles.join(', ')}` });
  }

  // Adminul nu își poate schimba propriul rol
  if (newRole && Number(req.user?.userId) === Number(id)) {
    return res.status(400).json({ error: 'You cannot change your own role.' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const updateData: any = {};

    if (name) updateData.name = name;
    if (newRole) updateData.role = newRole;

    if (email && email !== user.email) {
      const emailTaken = await prisma.user.findUnique({ where: { email } });
      if (emailTaken) return res.status(409).json({ error: 'Email already in use by another account.' });
      updateData.email = email;
    }

    if (phone !== undefined) {
      if (phone !== '' && phone !== user.phone) {
        const phoneTaken = await prisma.user.findFirst({
          where: { phone, NOT: { id: Number(id) } },
        });
        if (phoneTaken) return res.status(409).json({ error: 'Phone number already in use by another account.' });
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
        id: true, name: true, email: true,
        avatar: true, role: true, phone: true, createdAt: true,
      },
    });

    const isRoleChanged = newRole && newRole !== user.role;

    await logActivity({
      performedById: req.user?.userId ? Number(req.user.userId) : null,
      action: isRoleChanged ? 'role_changed' : 'updated', 
      entityType: 'User',
      entityId: updatedUser.id,
      before: user,
      after: updatedUser,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      note: isRoleChanged 
        ? `Rolul utilizatorului ${user.name} a fost schimbat din "${user.role}" în "${newRole}".`
        : `User-ul ${user.name} a fost modificat de către un administrator.`
    });

    return res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error('updateUserHandler Error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

// ─────────────────────────────────────────
// DELETE /api/users/:id
// ─────────────────────────────────────────
export const deleteUserHandler = async (req: AuthRequest, res: Response): Promise<any> => {
  const { id } = req.params;

  if (Number(req.user?.userId) === Number(id)) {
    return res.status(400).json({ error: 'You cannot delete your own account.' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    await prisma.user.delete({ where: { id: Number(id) } });


    await logActivity({
      performedById: req.user?.userId ? Number(req.user.userId) : null,
      action: 'deleted', // 🟢 Modificat conform enum-ului tău
      entityType: 'User',
      entityId: Number(id),
      before: user,
      after: null,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      note: `User-ul "${user.name}" (${user.email}) a fost șters definitiv.`
    });

    return res.status(200).json({ message: `User "${user.name}" deleted successfully.` });
  } catch (error) {
    console.error('deleteUserHandler Error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

// ─────────────────────────────────────────
// PATCH /api/users/profile/update
// Editare profil propriu — accesibil oricărui user logat
// ─────────────────────────────────────────
export const updateProfileHandler = async (req: AuthRequest, res: Response): Promise<any> => {
  const { userId } = req.user!;
  const { name, currentPassword, newPassword, phone } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const updateData: any = {};

    if (name) updateData.name = name;

    if (phone !== undefined) {
      if (phone !== '') {
        const existingPhone = await prisma.user.findFirst({
          where: { phone, NOT: { id: Number(userId) } },
        });
        if (existingPhone) return res.status(400).json({ error: 'Phone number already in use by another account.' });
      }
      updateData.phone = phone;
    }

    if (req.file) {
      updateData.avatar = `http://localhost:3000/uploads/avatars/${req.file.filename}`;
    }

    if (newPassword) {
      if (user.googleId) return res.status(400).json({ error: 'Google accounts cannot change password here!' });
      if (!currentPassword) return res.status(400).json({ error: 'Current password is required!' });

      const isMatch = await bcrypt.compare(currentPassword, user.password || '');
      if (!isMatch) return res.status(400).json({ error: 'Incorrect current password.' });

      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(userId) },
      data: updateData,
      select: {
        id: true, name: true, email: true,
        avatar: true, role: true, phone: true, googleId: true,
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
    console.error('updateProfileHandler Error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};