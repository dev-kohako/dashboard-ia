import {
  deleteUserData,
  getPresignedUrl,
  getUserData,
  setUserPassword,
  updateUserAvatar,
  updateUserData,
} from "../controllers/user.controller";
import type { Context } from "../types/auth.types";
import type {
  PresignedUrlResponse,
  SetPasswordInput,
  SetPresignedUrlInput,
  SetUpdateAvatarInput,
  UpdateUserParams,
  UserResponse,
} from "../types/user.types";

export const userResolvers = {
  Mutation: {
    updateUserData: async (
      _: any,
      args: { input: UpdateUserParams },
      context: Context
    ): Promise<UserResponse> => {
      return await updateUserData(args.input, context);
    },
    deleteUserData: async (
      _: any,
      __: any,
      context: Context
    ): Promise<UserResponse> => {
      return await deleteUserData(context);
    },
    setUserPassword: async (
      _: any,
      args: { input: SetPasswordInput },
      context: Context
    ): Promise<UserResponse> => {
      return await setUserPassword( args.input ,context);
    },
    getPresignedUrl: async (_: any, args: { input: SetPresignedUrlInput }, context: Context): Promise<PresignedUrlResponse> => {
      if (!context.userId) throw new Error("Não autorizado");
      return await getPresignedUrl(args.input);
    },
    updateUserAvatar: async (_: any, args: { input: SetUpdateAvatarInput }, context: Context): Promise<UserResponse> => {
      return await updateUserAvatar( args.input, context );
    },
  },
  Query: {
    getUserData: async (
      _: any,
      __: any,
      context: Context
    ): Promise<UserResponse> => {
      return await getUserData(context);
    },
  },
};
