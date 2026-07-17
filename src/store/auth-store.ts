"use client";

import { create } from "zustand";
import type { User, UserRole } from "@/types";

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  login: (email: string, _password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loginAs: (role: UserRole) => void;
}

const DEMO_ACCOUNTS: Record<string, { user: User; password: string }> = {
  "admin@bakaloriaa-bey.test": {
    password: "demo123",
    user: {
      id: "u-admin-1",
      email: "admin@bakaloriaa-bey.test",
      name: "مدير المنصة",
      role: "ADMIN",
      status: "ACTIVE",
      createdAt: new Date("2025-09-01").toISOString(),
      avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Admin&backgroundColor=0055A4",
    },
  },
  "teacher@bakaloriaa-bey.test": {
    password: "demo123",
    user: {
      id: "u-teacher-1",
      email: "teacher@bakaloriaa-bey.test",
      name: "أ. محمد عبد الله",
      role: "TEACHER",
      status: "ACTIVE",
      createdAt: new Date("2025-08-15").toISOString(),
      avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Mo&backgroundColor=D7232E",
    },
  },
  "student@bakaloriaa-bey.test": {
    password: "demo123",
    user: {
      id: "u-student-1",
      email: "student@bakaloriaa-bey.test",
      name: "أحمد محمود",
      role: "STUDENT",
      status: "ACTIVE",
      createdAt: new Date("2025-09-10").toISOString(),
      avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Ah&backgroundColor=FFD700",
    },
  },
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: false,
  login: async (email, password) => {
    await new Promise((r) => setTimeout(r, 600));
    const account = DEMO_ACCOUNTS[email.toLowerCase()];
    if (!account) {
      return { success: false, error: "البريد الإلكتروني غير مسجل" };
    }
    if (account.password !== password) {
      return { success: false, error: "كلمة المرور غير صحيحة" };
    }
    set({ user: account.user });
    return { success: true };
  },
  register: async (data) => {
    await new Promise((r) => setTimeout(r, 800));
    const newUser: User = {
      id: `u-${Date.now()}`,
      email: data.email,
      name: data.name,
      role: data.role,
      status: data.role === "TEACHER" ? "PENDING" : "ACTIVE",
      createdAt: new Date().toISOString(),
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.name)}`,
    };
    set({ user: newUser });
    return { success: true };
  },
  logout: () => set({ user: null }),
  loginAs: (role) => {
    const account = Object.values(DEMO_ACCOUNTS).find((a) => a.user.role === role);
    if (account) set({ user: account.user });
  },
}));

export const DEMO_LOGIN_ACCOUNTS = DEMO_ACCOUNTS;
