export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  acceptTerms: string;
}

export interface VerifyEmailInput {
  userId: string;
  code: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  newPassword: string;
}

export interface AuthPayload {
  token?: string;
  user?: User;
  message?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Context {
  userId?: string;
}