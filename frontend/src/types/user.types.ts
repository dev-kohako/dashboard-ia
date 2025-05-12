export interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
    authProvider: string;
    hasPassword?: boolean;
    twoFactorEnabled?: boolean;
  }
export interface UserState {
  user: User | null;
  setUser: (user: User) => void;
}