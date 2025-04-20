import { type Request, type Response, type NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface JwtPayload {
  userId: string
}

export interface AuthenticatedRequest extends Request {
  userId?: string
}

export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    res.status(401).json({ error: 'Token ausente ou inválido' })
    return
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
    req.userId = decoded.userId
    next()
  } catch (err) {
    console.error('Erro ao verificar token:', err)
    res.status(403).json({ error: 'Token inválido' })
  }
}
