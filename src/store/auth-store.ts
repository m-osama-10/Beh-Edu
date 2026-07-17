"use client";

import { create } from "zustand";
import type { User, UserRole } from "@/types";

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ success: boolean; redirectTo?: string; error?: string }>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    phone?: string;
    gradeId?: string;
  }) => Promise<{ success: boolean; redirectTo?: string; error?: string }>;
  logout: () => Promise<void>;
  loginAs: (role: UserRole) => Promise<void>;
}

function mapUser(u: {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: string;
  avatarUrl: string | null;
  phone?: string | null;
  createdAt: string;
}): User {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    status: u.status as "ACTIVE" | "PENDING" | "SUSPENDED" | "BANNED",
    avatarUrl: u.avatarUrl ?? undefined,
    phone: u.phone ?? undefined,
    createdAt: u.createdAt,
  };
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isLoading: false,
  isHydrated: false,

  hydrate: async () => {
    try {
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      if (data.user) {
        set({ user: mapUser(data.user), isHydrated: true });
      } else {
        set({ user: null, isHydrated: true });
      }
    } catch {
      set({ user: null, isHydrated: true });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      set({ isLoading: false });
      if (!res.ok) {
        return { success: false, error: data.error ?? "فشل تسجيل الدخول" };
      }
      set({ user: mapUser(data.user) });
      return { success: true, redirectTo: data.redirectTo };
    } catch (err) {
      set({ isLoading: false });
      return { success: false, error: "حدث خطأ في الاتصال" };
    }
  },

  register: async (data) => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      set({ isLoading: false });
      if (!res.ok) {
        return { success: false, error: resData.error ?? "فشل إنشاء الحساب" };
      }
      // Auto-login after register
      const loginResult = await get().login(data.email, data.password);
      if (!loginResult.success) {
        // Even if auto-login fails, registration succeeded
        return { success: true, redirectTo: resData.redirectTo };
      }
      return { success: true, redirectTo: resData.redirectTo ?? loginResult.redirectTo };
    } catch (err) {
      set({ isLoading: false });
      return { success: false, error: "حدث خطأ في الاتصال" };
    }
  },

  logout: async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    set({ user: null });
  },

  loginAs: async (role) => {
    // Demo quick-login: uses the .test demo accounts
    const email =
      role === "ADMIN"
        ? "admin@bakaloriaa-bey.test"
        : role === "TEACHER"
          ? "teacher@bakaloriaa-bey.test"
          : "student@bakaloriaa-bey.test";
    return get().login(email, "demo123").then((r) => {
      if (!r.success) {
        // Fallback: old mock login if DB doesn't have the user
        const mockUser: User = {
          id: `u-${role.toLowerCase()}-demo`,
          email,
          name:
            role === "ADMIN"
              ? "مدير المنصة"
              : role === "TEACHER"
                ? "أ. محمد عبد الله"
                : "أحمد محمود",
          role,
          status: "ACTIVE",
          createdAt: new Date().toISOString(),
          avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${role}&backgroundColor=1A5F7A`,
        };
        set({ user: mockUser });
      }
    });
  },
}));
