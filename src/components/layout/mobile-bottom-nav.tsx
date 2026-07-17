"use client";

import { useRouterStore } from "@/store/router-store";
import { useAuthStore } from "@/store/auth-store";
import { Home, BookOpen, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "الرئيسية", route: "home" as const, icon: Home },
  { label: "الكورسات", route: "courses" as const, icon: BookOpen },
  { label: "المفضلة", route: "favorites" as const, icon: Heart },
  { label: "حسابي", route: "student-dashboard" as const, icon: User },
];

export function MobileBottomNav() {
  const route = useRouterStore((s) => s.route);
  const navigate = useRouterStore((s) => s.navigate);
  const { user } = useAuthStore();

  if (route.name === "watch") return null; // Hide during video playback

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 safe-bottom md:hidden">
      <div className="grid grid-cols-4">
        {NAV_ITEMS.map((item) => {
          const isActive =
            route.name === item.route ||
            (item.route === "student-dashboard" && (route.name === "teacher-dashboard" || route.name === "admin-dashboard"));
          return (
            <button
              key={item.label}
              onClick={() => {
                if (item.route === "student-dashboard" && user) {
                  const target = user.role === "ADMIN" ? "admin-dashboard" : user.role === "TEACHER" ? "teacher-dashboard" : "student-dashboard";
                  navigate(target);
                } else if (item.route === "student-dashboard" && !user) {
                  navigate("login");
                } else {
                  navigate(item.route);
                }
              }}
              className={cn(
                "flex flex-col items-center gap-1 py-2 transition",
                isActive ? "text-primary" : "text-muted-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
