import { motion } from "framer-motion";
import { Bell, CheckCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNotifications } from "@/context/NotificationsContext";

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h1 className="page-header">Notifications</h1>
          <p className="page-subheader">
            Stay on top of hiring, interviews, payroll, and employee updates in one feed.
          </p>
        </div>

        <Button onClick={markAllAsRead} className="gap-2 self-start">
          <CheckCheck className="h-4 w-4" />
          Mark all as read
        </Button>
      </div>

      <Card className="glass-card border-primary/10">
        <CardHeader className="flex flex-col gap-3 border-b border-border/60 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-xl">Activity Feed</CardTitle>
            <CardDescription>{unreadCount} unread notifications need your attention.</CardDescription>
          </div>
          <div className="rounded-full border border-border bg-muted/20 px-3 py-1 text-sm text-muted-foreground">
            {notifications.length} total updates
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          {notifications.map((notification) => (
            <button
              key={notification.id}
              type="button"
              onClick={() => markAsRead(notification.id)}
              className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-all ${
                notification.read
                  ? "border-border bg-muted/15 hover:bg-muted/25"
                  : "border-primary/20 bg-primary/8 shadow-sm hover:border-primary/35 hover:bg-primary/12"
              }`}
            >
              <div
                className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  notification.read ? "bg-muted text-muted-foreground" : "bg-primary/15 text-primary"
                }`}
              >
                <Bell className="h-4 w-4" />
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{notification.title}</h3>
                    {!notification.read && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
                  </div>
                  <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{notification.time}</span>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">{notification.description}</p>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
