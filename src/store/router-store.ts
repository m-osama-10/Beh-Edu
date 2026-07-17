"use client";

import { create } from "zustand";
import type { RouteName, RouteState } from "@/types";

interface RouterStore {
  route: RouteState;
  history: RouteState[];
  navigate: (name: RouteName, params?: Record<string, string>) => void;
  goBack: () => void;
  canGoBack: boolean;
}

export const useRouterStore = create<RouterStore>((set, get) => ({
  route: { name: "home" },
  history: [{ name: "home" }],
  canGoBack: false,
  navigate: (name, params) => {
    const current = get().route;
    if (current.name === name && !params) return;
    const newRoute = { name, params };
    set((state) => ({
      route: newRoute,
      history: [...state.history, newRoute],
      canGoBack: true,
    }));
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" });
      if (window.history.replaceState) {
        window.history.replaceState(
          null,
          "",
          `#${name}${params ? "?" + new URLSearchParams(params).toString() : ""}`,
        );
      }
    }
  },
  goBack: () => {
    const { history } = get();
    if (history.length <= 1) return;
    const newHistory = history.slice(0, -1);
    const prev = newHistory[newHistory.length - 1];
    set({
      route: prev,
      history: newHistory,
      canGoBack: newHistory.length > 1,
    });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  },
}));
