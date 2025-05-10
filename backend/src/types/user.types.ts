export interface GetUserInput {
  userId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  authProvider?: string;
  acceptTerms?: boolean;
  hasPassword?: boolean;
  twoFactorEnabled?: boolean;
}

export interface UserResponse {
  success?: boolean;
  message?: string;
  user?: User;
  token?: string;
  deletedUser?: User;
}

export interface SetPasswordInput {
  password: string;
};

export interface SetPresignedUrlInput {
  fileName: string;
  fileType: string;
}

export interface SetUpdateAvatarInput {
  avatarUrl: string;
}

export interface PresignedUrlResponse {
  uploadUrl: string;
  fileUrl: string;
}

export interface UpdateUserParams {
  name?: string;
  email?: string;
  password?: string;
  oldPassword?: string;
  avatarUrl?: string;
  twoFactorEnabled?: boolean;
}