import {
  loginWithCredentials,
  registerWithCredentials,
  forgotPasswordWithCredentials,
  verifyEmailCodeWithCredentials,
  resetPasswordWithToken,
} from "../controllers/auth.controller";
import type {
  AuthPayload,
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  VerifyEmailInput,
} from "../types/auth.types";

export const resolvers = {
  Mutation: {
    login: async (_: any, args: LoginInput): Promise<AuthPayload> => {
      return await loginWithCredentials(args.email, args.password);
    },
    register: async (_: any, args: RegisterInput): Promise<AuthPayload> => {
      return await registerWithCredentials(
        args.name,
        args.email,
        args.password,
        args.acceptTerms
      );
    },
    verify: async (_: any, args: VerifyEmailInput): Promise<AuthPayload> => {
      return await verifyEmailCodeWithCredentials(args.userId, args.code);
    },
    forgotPassword: async (
      _: any,
      args: ForgotPasswordInput
    ): Promise<AuthPayload> => {
      return await forgotPasswordWithCredentials(args.email);
    },
    resetPassword: async (
      _: any,
      args: ResetPasswordInput
    ): Promise<AuthPayload> => {
      return await resetPasswordWithToken(args.token, args.newPassword);
    },
  },
};
