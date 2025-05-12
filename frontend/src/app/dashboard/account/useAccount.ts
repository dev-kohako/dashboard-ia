"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { notify } from "@/lib/utils/utils";
import { useUserStore } from "@/stores/userStore";
import { useAuthStore } from "@/stores/authStore";
import { convertToWebP } from "@/lib/utils/imageToWebp";
import {
  updateUserSchema,
  UpdateUserSchema,
} from "@/schemas/user/updateUser.schema";
import { SetUserPasswordInput, UpdateUserInput } from "@/graphql/generated";
import { UPDATE_USER_MUTATION } from "@/queries/user/updateUser";
import { GET_PRESIGNED_URL_MUTATION } from "@/queries/user/getPresignedUrl";
import { UPDATE_AVATAR_MUTATION } from "@/queries/user/updateAvatar";
import { GET_USER_QUERY } from "@/queries/user/getUser";
import { SET_USER_PASSWORD_MUTATION } from "@/queries/user/setUserPassword";
import { DELETE_USER_MUTATION } from "@/queries/user/deleteUser";
import { useIsMobile } from "@/hooks/use-mobile";

export function useAccount() {
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState<boolean>(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string>("");
  const isMobile = useIsMobile();

  const { setUser, user } = useUserStore();
  const { login, logout } = useAuthStore();

  const [updateUserMutation] = useMutation(UPDATE_USER_MUTATION);
  const [getPresignedUrl] = useMutation(GET_PRESIGNED_URL_MUTATION);
  const [updateAvatar] = useMutation(UPDATE_AVATAR_MUTATION);
  const [setUserPasswordMutation] = useMutation(SET_USER_PASSWORD_MUTATION);
  const [deleteUser] = useMutation(DELETE_USER_MUTATION);
  
  const {
    data: result,
    loading: loadingQuery,
    error: queryError,
  } = useQuery(GET_USER_QUERY);

  const form = useForm<UpdateUserSchema>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      firstName: user?.name?.trim().split(/\s+/)[0] || "",
      lastName: user?.name?.trim().split(/\s+/).slice(1).join(" ") || "",
      email: user?.email || undefined,
      oldPassword: "",
      password: "",
      twoFactorEnabled: user?.twoFactorEnabled || undefined
    },
  });

  useEffect(() => {
    if (loadingQuery) {
      setIsLoading(true);
    } else if (queryError) {
      console.error("Erro ao recuperar dados do usuario:", queryError);
      setIsLoading(false);
    } else if (result) {
      setUser(result.getUserData.user);
      setIsLoading(false);
    }
  }, [loadingQuery, queryError, result, setUser]);

  const initials = user?.name
    ? user.name
        .split(" ")
        .filter((part: string) => part.length > 0)
        .map((part: string) => part[0].toUpperCase())
        .join("")
        .slice(0, 2)
    : user?.email[0]?.toUpperCase() || "";

  const resetAvatarState = () => {
    setAvatarPreview(null);
    setSelectedFile(null);
    setImageToCrop(null);
  };

  const resetFormState = () => {
    form.reset();
    form.clearErrors();
  };

  const handleEditClick = () => {
    if (isEditing) {
      resetFormState();
    }
    setIsEditing((prev) => !prev);
  };

  const handleAvatarDialogOpenChange = (open: boolean) => {
    if (!open) {
      resetAvatarState();
    }
    setIsAvatarDialogOpen(open);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImageToCrop(previewUrl);
    setSelectedFile(file);
    setIsAvatarDialogOpen(true);
  };

  const handleCropComplete = (croppedImage: File) => {
    setAvatarPreview(URL.createObjectURL(croppedImage));
    setSelectedFile(croppedImage);
  };

  const uploadAvatarToS3 = async (file: File) => {
    const webpFile = await convertToWebP(file);

    const { data } = await getPresignedUrl({
      variables: {
        input: {
          fileName: webpFile.name,
          fileType: webpFile.type,
        },
      },
    });

    const { uploadUrl, fileUrl } = data.getPresignedUrl;

    const uploadResponse = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": webpFile.type,
      },
      body: webpFile,
    });

    if (!uploadResponse.ok) {
      throw new Error("Falha em enviar a imagem para o S3");
    }

    return fileUrl;
  };

  const updateUserAvatar = async (avatarUrl: string) => {
    await updateAvatar({
      variables: {
        input: {
          avatarUrl,
        },
      },
    });

    if (user) {
      setUser({ ...user, avatarUrl });
    }
  };

  const handleSave = async () => {
    if (!selectedFile) {
      notify.error("Nenhuma imagem selecionada.");
      setIsAvatarDialogOpen(false);
      return;
    }

    try {
      setIsLoading(true);
      const fileUrl = await uploadAvatarToS3(selectedFile);
      await updateUserAvatar(fileUrl);

      setAvatarPreview(fileUrl);
      notify.success("Avatar atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar avatar:", error);
      notify.error("Erro ao salvar avatar. Tente novamente mais tarde.");
    } finally {
      resetAvatarState();
      setIsLoading(false);
      setIsAvatarDialogOpen(false);
    }
  };

  const updateUserCredentials = async (input: Partial<UpdateUserInput>) => {
    const { data: result, errors } = await updateUserMutation({
      variables: { input },
    });

    if (errors?.length) {
      throw new Error(errors.map((err) => err.message).join(", "));
    }

    if (result?.updateUserData?.message !== "Dados atualizados com sucesso") {
      throw new Error(result?.updateUserData?.message || "Atualização falhou");
    }

    if (result.updateUserData.token) {
      login(result.updateUserData.token);
    }

    setUser(result.updateUserData.user);
    notify.success("Dados atualizados com sucesso!");
  };

  const setPasswordForGoogleUser = async (input: Partial<SetUserPasswordInput>) => {
    if (!user?.id) throw new Error("ID do usuario não encontrado");
    const { data: passwordResult, errors: passErrors } = await setUserPasswordMutation({
      variables: {
        input,
      },
    });

    if (passErrors?.length) {
      throw new Error(passErrors.map((err) => err.message).join(", "));
    }

    if (!passwordResult?.setUserPassword?.success) {
      throw new Error(passwordResult?.setUserPassword?.message || "Erro ao definir senha");
    }
  };

  const onSubmit = async (data: UpdateUserSchema) => {
    setIsLoading(true);

    try {
      const input: Partial<UpdateUserInput> = {};

      if (`${data.firstName} ${data.lastName}`.trim() !== user?.name?.trim()) {
        input.name = `${data.firstName} ${data.lastName}`;
      }

      if (data.twoFactorEnabled !== user?.twoFactorEnabled) {
        input.twoFactorEnabled = data.twoFactorEnabled;
      }      
      
      if (data.email && data.email.trim() !== (user?.email ?? "").trim()) {
        input.email = data.email;
      }
      
      if (user?.authProvider === "credentials") {
        if (data.oldPassword?.trim()) input.oldPassword = data.oldPassword;
        if (data.password?.trim()) input.password = data.password;
      }

      await updateUserCredentials(input);

      if (user?.authProvider === "google" && data.password) {
        await setPasswordForGoogleUser({ password: data.password });;
        notify.success("Senha definida com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      notify.error(error instanceof Error ? error.message : "Erro desconhecido");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsLoading(true);
      const { data } = await deleteUser();
      const message = data?.deleteUser?.message || "Conta deletada com sucesso!";
      
      notify.success(message, "Redirecionando para o login...");
      setTimeout(logout, 3000);
    } catch (error) {
      console.error("Erro ao deletar conta:", error);
      notify.error(
        "Falha em deletar conta",
        error instanceof Error ? error.message : "Erro desconhecido"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    onSubmit,
    isLoading,
    user,
    initials,
    avatarPreview,
    imageToCrop,
    isAvatarDialogOpen,
    selectedFile,
    deleteConfirmation,
    isMobile,
    setDeleteConfirmation,
    handleAvatarDialogOpenChange,
    isEditing,
    handleEditClick,
    handleImageChange,
    handleCropComplete,
    handleSave,
    handleDeleteAccount,
  };
}