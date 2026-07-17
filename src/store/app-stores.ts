"use client";

import { create } from "zustand";
import type { VideoQuality } from "@/types";

interface SettingsStore {
  dataSaverMode: boolean;
  preferredQuality: VideoQuality;
  toggleDataSaver: () => void;
  setQuality: (q: VideoQuality) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  dataSaverMode: true,
  preferredQuality: "480P",
  toggleDataSaver: () => set((s) => ({ dataSaverMode: !s.dataSaverMode, preferredQuality: !s.dataSaverMode ? "480P" : s.preferredQuality })),
  setQuality: (q) => set({ preferredQuality: q }),
}));

interface FavoritesStore {
  favorites: Set<string>;
  toggle: (courseId: string) => void;
  isFavorite: (courseId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesStore>((set, get) => ({
  favorites: new Set(["c-3", "c-5"]),
  toggle: (courseId) =>
    set((s) => {
      const next = new Set(s.favorites);
      if (next.has(courseId)) next.delete(courseId);
      else next.add(courseId);
      return { favorites: next };
    }),
  isFavorite: (courseId) => get().favorites.has(courseId),
}));

interface CartStore {
  cart: string[];
  addToCart: (courseId: string) => void;
  removeFromCart: (courseId: string) => void;
  clearCart: () => void;
  isInCart: (courseId: string) => boolean;
}

export const useCartStore = create<CartStore>((set, get) => ({
  cart: [],
  addToCart: (courseId) =>
    set((s) => (s.cart.includes(courseId) ? s : { cart: [...s.cart, courseId] })),
  removeFromCart: (courseId) => set((s) => ({ cart: s.cart.filter((c) => c !== courseId) })),
  clearCart: () => set({ cart: [] }),
  isInCart: (courseId) => get().cart.includes(courseId),
}));

interface EnrolledStore {
  enrolled: Set<string>;
  enroll: (courseId: string) => void;
  isEnrolled: (courseId: string) => boolean;
}

export const useEnrolledStore = create<EnrolledStore>((set, get) => ({
  enrolled: new Set(["c-1", "c-2", "c-4"]),
  enroll: (courseId) =>
    set((s) => {
      const next = new Set(s.enrolled);
      next.add(courseId);
      return { enrolled: next };
    }),
  isEnrolled: (courseId) => get().enrolled.has(courseId),
}));

interface WatchProgressStore {
  progress: Record<string, { position: number; duration: number; completed: boolean; watchedMB: number }>;
  update: (lessonId: string, position: number, duration: number, watchedMB: number) => void;
  markComplete: (lessonId: string) => void;
}

export const useWatchProgressStore = create<WatchProgressStore>((set) => ({
  progress: {
    "l-1-1-1": { position: 540, duration: 1620, completed: true, watchedMB: 95 },
    "l-1-1-2": { position: 720, duration: 1440, completed: false, watchedMB: 84 },
    "l-1-2-1": { position: 0, duration: 1800, completed: false, watchedMB: 0 },
  },
  update: (lessonId, position, duration, watchedMB) =>
    set((s) => ({
      progress: {
        ...s.progress,
        [lessonId]: {
          position,
          duration,
          completed: s.progress[lessonId]?.completed ?? false,
          watchedMB,
        },
      },
    })),
  markComplete: (lessonId) =>
    set((s) => ({
      progress: {
        ...s.progress,
        [lessonId]: { ...(s.progress[lessonId] ?? { position: 0, duration: 0, watchedMB: 0 }), completed: true },
      },
    })),
}));
