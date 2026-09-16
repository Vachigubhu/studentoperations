import type { UserRole } from "../types/auth";

export type NavigationItem = {
  label: string;
  path: string;
  roles: UserRole[];
};

export const navigationItems: NavigationItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    roles: ["STUDENT", "STAFF", "MANAGER", "ADMIN", "SUPER_ADMIN"],
  },

  {
    label: "My Requests",
    path: "/requests",
    roles: ["STUDENT"],
  },

  {
    label: "Staff Requests",
    path: "/staff/requests",
    roles: ["STAFF"],
  },

  {
    label: "Manager Requests",
    path: "/manager/requests",
    roles: ["MANAGER"],
  },

  {
    label: "Users",
    path: "/admin/users",
    roles: ["ADMIN", "SUPER_ADMIN"],
  },

  {
    label: "Departments",
    path: "/admin/departments",
    roles: ["ADMIN", "SUPER_ADMIN"],
  },

  {
    label: "Request Types",
    path: "/admin/request-types",
    roles: ["ADMIN", "SUPER_ADMIN"],
  },

  {
    label: "Audit Logs",
    path: "/admin/audit-logs",
    roles: ["ADMIN", "SUPER_ADMIN"],
  },

  {
    label: "Messages",
    path: "/messages",
    roles: ["STUDENT", "STAFF", "MANAGER", "ADMIN", "SUPER_ADMIN"],
  },

  {
    label: "Notifications",
    path: "/notifications",
    roles: ["STUDENT", "STAFF", "MANAGER", "ADMIN", "SUPER_ADMIN"],
  },

  {
    label: "Profile",
    path: "/profile",
    roles: ["STUDENT", "STAFF", "MANAGER", "ADMIN", "SUPER_ADMIN"],
  },
];
