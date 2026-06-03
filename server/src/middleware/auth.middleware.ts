import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: { userId: number | string; email: string; role: string };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): any => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided or invalid format' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as any;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction): any => {
  if (!req.user || req.user.role?.toLowerCase() !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};