import jwt from "jsonwebtoken";
import type { Context } from "../types/auth.types";

interface DecodedToken {
  userId: string;
}

export const createContext = ({
  req,
}: {
  req: { headers: Record<string, string> };
}): Context => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.replace("Bearer ", "")
    : null;

  if (!token) {
    return { userId: null };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    return { userId: decoded.userId };
  } catch (err) {
    console.error("Erro ao verificar token:", err);
    return { userId: null };
  }
};