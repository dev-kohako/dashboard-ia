import jwt from 'jsonwebtoken'

interface DecodedToken {
  id: string
}

export interface Context {
  userId: string | null
}

export const createContext = ({ req }: { req: { headers: Record<string, string> } }): Context => {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : null

  if (!token) {
    return { userId: null }
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken
    return { userId: decoded.id }
  } catch (err) {
    console.error('Error verifying token:', err)
    return { userId: null }
  }
}