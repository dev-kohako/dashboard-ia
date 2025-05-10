import {
  loginWithCredentials,
  registerWithCredentials,
  forgotPasswordWithCredentials,
  verifyEmailCodeWithCredentials,
  resetPasswordWithToken,
  loginWithGoogle,
} from "../controllers/auth.controller";
import type {
  AuthPayload,
  ForgotPasswordInput,
  LoginInput,
  LoginWithGoogleInput,
  RegisterInput,
  ResetPasswordInput,
  VerifyEmailInput,
} from "../types/auth.types";

export const authResolvers = {
  Mutation: {
    registerUser: async (
      _: any,
      args: { input: RegisterInput }
    ): Promise<AuthPayload> => {
      return await registerWithCredentials(args.input);
    },
    loginUser: async (
      _: any,
      args: { input: LoginInput }
    ): Promise<AuthPayload> => {
      return await loginWithCredentials(args.input);
    },
    verifyUserEmail: async (
      _: any,
      args: { input: VerifyEmailInput }
    ): Promise<AuthPayload> => {
      return await verifyEmailCodeWithCredentials(args.input);
    },
    forgotUserPassword: async (
      _: any,
      args: { input: ForgotPasswordInput }
    ): Promise<AuthPayload> => {
      return await forgotPasswordWithCredentials(args.input);
    },
    resetUserPassword: async (
      _: any,
      args: { input: ResetPasswordInput }
    ): Promise<AuthPayload> => {
      return await resetPasswordWithToken(args.input);
    },
    loginWithGoogle: async (
      _: any,
      args: { input: LoginWithGoogleInput }
    ): Promise<AuthPayload> => {
      return await loginWithGoogle(args.input);
    },
  },
};
