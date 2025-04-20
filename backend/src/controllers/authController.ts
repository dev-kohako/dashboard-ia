import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { generateToken } from "../utils/jwt";
import type { AuthenticatedRequest } from "../middlewares/authenticateToken";

const prisma = new PrismaClient();

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token ausente ou inválido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido" });
  }
};

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ error: "Campos obrigatórios" });
    return;
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: "Email já cadastrado" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, passwordHash },
    });

    const token = generateToken(user.id);
    res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(400).json({ error: "Usuário não encontrado" });
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Senha incorreta" });
      return;
    }

    const token = generateToken(user.id);
    res.json({
      user: { id: user.id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};
