import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";
import { generateToken } from "../utils/jwt";
import type {
  PresignedUrlResponse,
  SetPasswordInput,
  SetPresignedUrlInput,
  SetUpdateAvatarInput,
  UpdateUserParams,
  UserResponse,
} from "../types/user.types";
import type { Context } from "../types/auth.types";
import prisma from "../utils/prisma";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import s3 from "../utils/s3Client";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export const getUserData = async (context: Context): Promise<UserResponse> => {
  try {
    if (!context.userId) {
      throw new Error("Não autorizado");
    }

    const user = await prisma.user.findUnique({
      where: { id: context.userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        isVerified: true,
        authProvider: true,
        hasPassword: true,
        twoFactorEnabled: true,
      },
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    return {
      success: true,
      user: {
        ...user,
        avatarUrl: user.avatarUrl ?? undefined,
      },
      message: "Dados do usuário obtidos com sucesso",
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro inesperado";
    return {
      success: false,
      message,
    };
  }
};

export const updateUserData = async (
  {
    name,
    email,
    password,
    oldPassword,
    avatarUrl,
    twoFactorEnabled,
  }: UpdateUserParams,
  context: Context
): Promise<UserResponse> => {
  try {
    if (!context.userId) {
      throw new Error("Não autorizado");
    }

    const user = await prisma.user.findUnique({
      where: { id: context.userId },
      select: {
        email: true,
        passwordHash: true,
      },
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const updateData: Partial<Prisma.UserUpdateInput> = {};

    if (name?.trim()) updateData.name = name.trim();
    if (email?.trim()) updateData.email = email.trim();
    if (avatarUrl?.trim()) updateData.avatarUrl = avatarUrl.trim();
    if (typeof twoFactorEnabled === "boolean") {
      updateData.twoFactorEnabled = twoFactorEnabled;
    }   

    if (password) {
      if (!oldPassword) {
        throw new Error("Senha antiga é obrigatória para alterar a senha");
      }

      if (!user.passwordHash) {
        throw new Error(
          "Senha atual não definida. Não é possível alterar a senha."
        );
      }

      const isOldPasswordCorrect = await bcrypt.compare(
        oldPassword,
        user.passwordHash
      );
      if (!isOldPasswordCorrect) {
        throw new Error("Senha antiga incorreta");
      }

      const salt = await bcrypt.genSalt(10);
      updateData.passwordHash = await bcrypt.hash(password, salt);
    }

    const updatedUser = await prisma.user.update({
      where: { id: context.userId },
      data: updateData,
    });

    const token = email ? generateToken(updatedUser.id) : undefined;

    return {
      success: true,
      user: {
        ...updatedUser,
        avatarUrl: updatedUser.avatarUrl ?? undefined,
      },
      token,
      message: "Dados atualizados com sucesso",
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro inesperado";
    return {
      success: false,
      message,
    };
  }
};

export const deleteUserData = async (
  context: Context
): Promise<UserResponse> => {
  try {
    if (!context.userId) {
      throw new Error("Não autorizado");
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: context.userId },
    });

    if (!existingUser) {
      throw new Error("Usuário não encontrado");
    }

    await prisma.user.delete({
      where: { id: context.userId },
    });

    return {
      success: true,
      message: "Conta removida com sucesso",
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro inesperado";
    return {
      success: false,
      message,
    };
  }
};

export const setUserPassword = async (
  { password }: SetPasswordInput,
  context: Context
): Promise<{ message: string }> => {
  try {
    if (!context.userId) {
      throw new Error("Não autorizado");
    }

    const user = await prisma.user.findUnique({
      where: { id: context.userId },
    });

    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    if (user.passwordHash) {
      throw new Error("Senha já foi definida para este usuário.");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: context.userId },
      data: { passwordHash },
    });

    return { message: "Senha definida com sucesso." };
  } catch (error: any) {
    throw new Error(error.message || "Erro ao definir senha.");
  }
};

export const getPresignedUrl = async ({
  fileName,
  fileType,
}: SetPresignedUrlInput): Promise<PresignedUrlResponse> => {
  try {
    if (!ALLOWED_IMAGE_TYPES.includes(fileType)) {
      throw new Error(`Tipo de arquivo não permitido: ${fileType}`);
    }

    const fileKey = `avatars/${uuidv4()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: fileKey,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

    return { uploadUrl, fileUrl };
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Erro desconhecido ao gerar URL assinada.";

    throw new Error(message);
  }
};

export const updateUserAvatar = async (
  { avatarUrl }: SetUpdateAvatarInput,
  context: Context
): Promise<UserResponse> => {
  try {
    if (!context.userId) {
      return {
        success: false,
        message: "Não autorizado",
      };
    }

    const user = await prisma.user.findUnique({
      where: { id: context.userId },
      select: { avatarUrl: true },
    });

    if (!user) {
      return {
        success: false,
        message: "Usuário não encontrado",
      };
    }

    if (user.avatarUrl && user.avatarUrl !== avatarUrl) {
      const isFromS3 = user.avatarUrl.includes(process.env.AWS_BUCKET_NAME!);

      if (isFromS3) {
        try {
          const url = new URL(user.avatarUrl);
          const key = url.pathname.slice(1);

          await s3.send(
            new DeleteObjectCommand({
              Bucket: process.env.AWS_BUCKET_NAME!,
              Key: key,
            })
          );
        } catch (deleteErr: any) {
          console.error("Erro ao deletar avatar anterior:", deleteErr);
          throw new Error("Erro ao deletar avatar anterior");
        }
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: context.userId },
      data: { avatarUrl },
    });

    return {
      success: true,
      user: {
        ...updatedUser,
        avatarUrl: updatedUser.avatarUrl ?? undefined,
      },
      message: "Avatar atualizado com sucesso",
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro inesperado";

    return {
      success: false,
      message,
    };
  }
};
