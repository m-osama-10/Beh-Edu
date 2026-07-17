"use client";

import { useState } from "react";
import { useRouterStore } from "@/store/router-store";
import { useAuthStore } from "@/store/auth-store";
import { useFavoritesStore } from "@/store/app-stores";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Menu,
  Moon,
  Sun,
  Bell,
  User,
  LogOut,
  LayoutDashboard,
  Heart,
  ShoppingBag,
  Settings,
  Home,
  GraduationCap,
  BookOpen,
  ChevronDown,
} from "lucide-react";
import { useTheme } from "next-themes";
import { NOTIFICATIONS } from "@/data/mock-data";
import { useNotifications } from "@/store/notifications-store";
import Link from "next/link";

const NAV_LINKS = [
  { label: "الرئيسية", route: "home" as const, icon: Home },
  { label: "الكورسات", route: "courses" as const, icon: BookOpen },
  { label: "المدرسون", route: "courses" as const, icon: GraduationCap, params: { view: "teachers" } },
];

export function Header() {
  const navigate = useRouterStore((s) => s.navigate);
  const route = useRouterStore((s) => s.route);
  const { user, logout } = useAuthStore();
  const favoritesCount = useFavoritesStore((s) => s.favorites.size);
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const unreadCount = useNotifications((s) => s.unreadCount);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate("courses", { q: searchQuery });
      setMobileOpen(false);
    }
  };

  const handleNavigate = (target: Parameters<typeof navigate>[0], params?: Record<string, string>) => {
    navigate(target, params);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 items-center gap-2 px-4 sm:gap-4">
        {/* Mobile menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="القائمة">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetHeader>
              <SheetTitle className="text-right">
                <div className="flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logo.png" alt="بكالوريا بيه" className="h-10 w-10 rounded-lg" />
                  <span className="font-bold">بكالوريا بيه</span>
                </div>
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Button
                  key={link.label}
                  variant={route.name === link.route ? "secondary" : "ghost"}
                  className="justify-start"
                  onClick={() => handleNavigate(link.route, link.params)}
                >
                  <link.icon className="ms-2 h-4 w-4" />
                  {link.label}
                </Button>
              ))}
              <Button variant="ghost" className="justify-start" onClick={() => handleNavigate("about")}>
                <User className="ms-2 h-4 w-4" />
                من نحن
              </Button>
            </div>
            <div className="mt-6 border-t pt-4">
              {user ? (
                <Button className="w-full" onClick={() => handleNavigate(getDashboardRoute(user.role))}>
                  <LayoutDashboard className="ms-2 h-4 w-4" />
                  لوحة التحكم
                </Button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button className="w-full" onClick={() => handleNavigate("login")}>
                    تسجيل الدخول
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => handleNavigate("register")}>
                    إنشاء حساب
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <button
          onClick={() => navigate("home")}
          className="flex items-center gap-2 transition hover:opacity-80"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="بكالوريا بيه" className="h-10 w-10 rounded-lg sm:h-11 sm:w-11" />
          <div className="hidden text-right sm:block">
            <div className="text-base font-extrabold leading-tight text-foreground">
              بكالوريا <span className="text-accent">بيه</span>
            </div>
            <div className="text-[10px] text-muted-foreground">منصة التعليم المصرية</div>
          </div>
        </button>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Button
              key={link.label}
              variant={route.name === link.route ? "secondary" : "ghost"}
              size="sm"
              onClick={() => navigate(link.route, link.params)}
              className="text-sm"
            >
              {link.label}
            </Button>
          ))}
        </nav>

        {/* Search */}
        <form onSubmit={handleSearch} className="hidden flex-1 max-w-md lg:block">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن كورس، مادة، أو مدرس..."
              className="bg-muted/50 pr-9"
            />
          </div>
        </form>

        <div className="flex flex-1 items-center justify-end gap-1 sm:gap-2 lg:flex-none">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="تبديل الوضع"
            className="h-9 w-9"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">تبديل الوضع</span>
          </Button>

          {/* Favorites */}
          {user && (
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9"
              onClick={() => navigate("favorites")}
              aria-label="المفضلة"
            >
              <Heart className="h-4 w-4" />
              {favoritesCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
                  {favoritesCount}
                </span>
              )}
            </Button>
          )}

          {/* Notifications */}
          {user && (
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9"
              onClick={() => navigate("notifications")}
              aria-label="الإشعارات"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
                  {unreadCount}
                </span>
              )}
            </Button>
          )}

          {/* User menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-1 sm:px-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {user.name.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm font-medium sm:inline">{user.name.split(" ").slice(0, 2).join(" ")}</span>
                  <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:inline" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                    <Badge variant="secondary" className="mt-1 w-fit text-[10px]">
                      {user.role === "ADMIN" ? "مدير" : user.role === "TEACHER" ? "مدرس" : "طالب"}
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate(getDashboardRoute(user.role))}>
                  <LayoutDashboard className="ms-2 h-4 w-4" />
                  لوحة التحكم
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("favorites")}>
                  <Heart className="ms-2 h-4 w-4" />
                  المفضلة
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("notifications")}>
                  <Bell className="ms-2 h-4 w-4" />
                  الإشعارات
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("certificates")}>
                  <GraduationCap className="ms-2 h-4 w-4" />
                  الشهادات
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { logout(); navigate("home"); }} className="text-destructive focus:text-destructive">
                  <LogOut className="ms-2 h-4 w-4" />
                  تسجيل الخروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={() => navigate("login")} className="text-sm">
                دخول
              </Button>
              <Button size="sm" onClick={() => navigate("register")} className="bg-brand-gradient text-sm">
                حساب جديد
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile search */}
      <div className="border-t bg-background/95 px-4 py-2 lg:hidden">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن كورس..."
              className="bg-muted/50 pr-9"
            />
          </div>
        </form>
      </div>
    </header>
  );
}

function getDashboardRoute(role: string): "admin-dashboard" | "teacher-dashboard" | "student-dashboard" {
  if (role === "ADMIN") return "admin-dashboard";
  if (role === "TEACHER") return "teacher-dashboard";
  return "student-dashboard";
}
