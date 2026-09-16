export const USER_ROLES = [
  "STUDENT",
  "STAFF",
  "MANAGER",
  "ADMIN",
  "SUPER_ADMIN",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  department?: {
    id: string;
    name: string;
    code: string;
  } | null;
};

export type AuthResponse = {
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
};
