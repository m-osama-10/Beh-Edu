"use client";

import { useRouterStore } from "@/store/router-store";
import { useNotifications } from "@/store/notifications-store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { Bell, CheckCheck, BookOpen, Award, CreditCard, Megaphone, CheckCircle2, Info, AlertCircle } from "lucide-react";
import { formatRelativeTime } from "@/data/mock-data";

const TYPE_ICON = {
  INFO: Info,
  SUCCESS: CheckCircle2,
  WARNING: AlertCircle,
  ERROR: AlertCircle,
  ANNOUNCEMENT: Megaphone,
  LESSON: BookOpen,
  PAYMENT: CreditCard,
  CERTIFICATE: Award,
};

const TYPE_COLOR = {
  INFO: "text-primary bg-primary/10",
  SUCCESS: "text-emerald-600 bg-emerald-100 dark:bg-emerald-950",
  WARNING: "text-amber-600 bg-amber-100 dark:bg-amber-950",
  ERROR: "text-red-600 bg-red-100 dark:bg-red-950",
  ANNOUNCEMENT: "text-purple-600 bg-purple-100 dark:bg-purple-950",
  LESSON: "text-primary bg-primary/10",
  PAYMENT: "text-emerald-600 bg-emerald-100 dark:bg-emerald-950",
  CERTIFICATE: "text-amber-600 bg-amber-100 dark:bg-amber-950",
};

export function NotificationsPage() {
  const navigate = useRouterStore((s) => s.navigate);
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="mb-1 text-2xl font-bold text-foreground sm:text-3xl">الإشعارات</h1>
          <p className="text-sm text-muted-foreground">
            {unreadCount > 0 ? `لديك ${unreadCount} إشعار غير مقروء` : "لا توجد إشعارات جديدة"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            <CheckCheck className="ms-1 h-4 w-4" />
            تعليم الكل كمقروء
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="لا توجد إشعارات"
          description="ستظهر هنا جميع إشعاراتك مثل الدروس الجديدة، الإعلانات، الشهادات، والمدفوعات."
        />
      ) : (
        <div className="space-y-2">
          {notifications.map((notif) => {
            const Icon = TYPE_ICON[notif.type];
            const colorClass = TYPE_COLOR[notif.type];
            return (
              <Card
                key={notif.id}
                className={`cursor-pointer transition hover:shadow-md ${!notif.isRead ? "border-primary/50 bg-primary/5" : ""}`}
                onClick={() => markAsRead(notif.id)}
              >
                <CardContent className="flex items-start gap-3 p-4">
                  <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${colorClass}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-foreground">{notif.title}</h3>
                      {!notif.isRead && (
                        <span className="h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{notif.message}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground">
                        {formatRelativeTime(notif.createdAt)}
                      </span>
                      {notif.link && (
                        <Button
                          size="sm"
                          variant="link"
                          className="h-auto p-0 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            const [name, query] = notif.link!.split("?");
                            const params: Record<string, string> = {};
                            if (query) {
                              new URLSearchParams(query).forEach((v, k) => { params[k] = v; });
                            }
                            navigate(name as "courses" | "watch" | "student-dashboard" | "certificates", params);
                          }}
                        >
                          عرض التفاصيل
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
