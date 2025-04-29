import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { generateToken } from "../utils/jwt";
import { sendVerificationEmail } from "../emails/sendVerificationEmail";
import { sendResetPasswordEmail } from "../emails/sendResetPasswordEmail";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET as string;

const generateResetToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "30m" });
};

export const registerWithCredentials = async (
  name: string,
  email: string,
  password: string,
  acceptTerms: string
) => {
  if (!name || !email || !password || !acceptTerms) {
    throw new Error("Todos os campos são obrigatórios.");
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("Email já cadastrado.");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();
  const codeExpiresAt = new Date(Date.now() + 3 * 60 * 1000);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      acceptTerms,
      verificationCode,
      codeExpiresAt,
      isVerified: false,
    },
  });

  await sendVerificationEmail(email, verificationCode);

  const token = generateToken(user.id);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      acceptTerms: user.acceptTerms,
    },
  };
};

export const loginWithCredentials = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new Error("Senha incorreta");
  }

  const token = generateToken(user.id);

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email },
  };
};

export const forgotPasswordWithCredentials = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  const token = generateResetToken(user.id);

  await sendResetPasswordEmail(user.email, token);

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email },
  };
};

export const resetPasswordWithToken = async (
  token: string,
  newPassword: string
) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    const newToken = generateToken(user.id);

    return {
      message: "Senha redefinida com sucesso!",
      token: newToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  } catch (err) {
    console.error("Erro ao redefinir senha:", err);
    throw new Error("Token inválido ou expirado");
  }
};

export const verifyEmailCodeWithCredentials = async (
  userId: string,
  code: string
) => {
  if (!userId || !code) {
    throw new Error("ID do usuário e código são obrigatórios.");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (
    !user ||
    user.verificationCode !== code ||
    !user.codeExpiresAt ||
    new Date() > user.codeExpiresAt
  ) {
    throw new Error("Código inválido ou expirado.");
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      isVerified: true,
      verificationCode: null,
      codeExpiresAt: null,
    },
  });

  const token = generateToken(user.id);

  return {
    message: "Conta verificada com sucesso!",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      acceptTerms: user.acceptTerms,
    },
  };
};
