import bcrypt from "bcrypt";
import { generateResetToken, generateToken } from "../utils/jwt";
import { sendVerificationEmail } from "../emails/sendVerificationEmail";
import { sendResetPasswordEmail } from "../emails/sendResetPasswordEmail";
import jwt from "jsonwebtoken";
import type {
  AuthPayload,
  ForgotPasswordInput,
  LoginInput,
  LoginWithGoogleInput,
  RegisterInput,
  ResetPasswordInput,
  VerifyEmailInput,
} from "../types/auth.types";
import prisma from "../utils/prisma";
import { OAuth2Client } from "google-auth-library";

export const registerWithCredentials = async ({
  name,
  email,
  password,
  acceptTerms,
}: RegisterInput): Promise<AuthPayload> => {
  try {
    if (!name || !email || !password || acceptTerms !== true) {
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
        hasPassword: true,
        twoFactorEnabled: false
      },
    });

    await sendVerificationEmail(email, verificationCode, "register");

    return {
      user,
      message: "Conta criada com sucesso. Verifique seu e-mail.",
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro inesperado";
    return {
      message,
    };
  }
};

export const loginWithCredentials = async ({
  email,
  password,
}: LoginInput): Promise<AuthPayload> => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      throw new Error("Usuário não encontrado ou senha não configurada.");
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new Error("Senha incorreta");
    }

    if (user.twoFactorEnabled) {
      const verificationCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      const codeExpiresAt = new Date(Date.now() + 3 * 60 * 1000);

      await prisma.user.update({
        where: { id: user.id },
        data: {
          verificationCode,
          codeExpiresAt,
        },
      });

      await sendVerificationEmail(user.email, verificationCode, "login");

      return {
        user,
        message: "Código de verificação enviado. Verifique seu e-mail.",
      };
    }

    const token = generateToken(user.id);

    return {
      user,
      token,
      message: "Login realizado com sucesso.",
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro inesperado";
    return {
      message,
    };
  }
};


export const loginWithGoogle = async ({
  idToken,
}: LoginWithGoogleInput): Promise<AuthPayload> => {
  const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID!);
  
  try {
    if (!idToken) {
      throw new Error("Token de autenticação ausente.");
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email_verified || !payload.email || !payload.name) {
      throw new Error("Email não verificado ou ausente.");
    }
    
    const { sub: googleId, email, name, picture } = payload;
    
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
          googleId,
          avatarUrl: picture,
          isVerified: true,
          acceptTerms: true,
          authProvider: "google",
          hasPassword: false,
          twoFactorEnabled: false
        },
      });
    }

    const token = generateToken(user.id);

    return {
      token,
      user,
      message: "Login com Google realizado com sucesso.",
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Erro inesperado ao autenticar.";
    throw new Error(message);
  }
};

export const forgotPasswordWithCredentials = async ({
  email,
}: ForgotPasswordInput): Promise<AuthPayload> => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const token = generateResetToken(user.id);

    await sendResetPasswordEmail(user.email, token);

    return {
      token,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro inesperado";
    return {
      message,
    };
  }
};

export const resetPasswordWithToken = async ({
  token,
  newPassword,
}: ResetPasswordInput): Promise<AuthPayload> => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
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

    return {
      message: "Senha redefinida com sucesso!",
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro inesperado";
    return {
      message,
    };
  }
};

export const verifyEmailCodeWithCredentials = async ({
  userId,
  code,
}: VerifyEmailInput): Promise<AuthPayload> => {
  try {
    if (!userId) {
      throw new Error("Usuário não autenticado.");
    }

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
      token,
      user,
      message: "Conta verificada com sucesso!",
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro inesperado";
    return {
      message,
    };
  }
};
