"use client";

import { create } from "zustand";
import type { RouteName, RouteState } from "@/types";

interface RouterStore {
  route: RouteState;
  history: RouteState[];
  canGoBack: boolean;
  navigate: (name: RouteName, params?: Record<string, string>) => void;
  goBack: () => void;
  goHome: () => void;
  replace: (name: RouteName, params?: Record<string, string>) => void;
}

const HOME: RouteState = { name: "home" };

export const useRouterStore = create<RouterStore>((set, get) => ({
  route: HOME,
  history: [HOME],
  canGoBack: false,

  navigate: (name, params) => {
    const current = get().route;
    if (current.name === name && JSON.stringify(current.params) === JSON.stringify(params)) {
      return;
    }
    const newRoute: RouteState = { name, params };
    set((state) => ({
      route: newRoute,
      history: [...state.history, newRoute],
      canGoBack: true,
    }));
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  },

  goBack: () => {
    const { history } = get();
    // Only go back if we have more than 1 entry in our internal history
    if (history.length <= 1) {
      // No internal history — go home instead of exiting the site
      get().goHome();
      return;
    }
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

  goHome: () => {
    set({
      route: HOME,
      history: [HOME],
      canGoBack: false,
    });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  },

  replace: (name, params) => {
    // Replace current route without adding to history (used for redirects after login)
    const newRoute: RouteState = { name, params };
    set((state) => {
      const newHistory = [...state.history];
      newHistory[newHistory.length - 1] = newRoute;
      return {
        route: newRoute,
        history: newHistory,
        canGoBack: newHistory.length > 1,
      };
    });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  },
}));
