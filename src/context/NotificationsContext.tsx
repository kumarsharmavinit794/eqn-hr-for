import { createContext, type ReactNode, useContext, useMemo, useState } from "react";

type NotificationItem = {
  id: number;
  title: string;
  description: string;
  time: string;
  read: boolean;
};

type NotificationsContextValue = {
  notifications: NotificationItem[];
  unreadCount: number;
  recentNotifications: NotificationItem[];
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
};

const initialNotifications: NotificationItem[] = [
  {
    id: 1,
    title: "New Candidate Applied",
    description: "A new frontend engineer application was submitted for review.",
    time: "2 min ago",
    read: false,
  },
  {
    id: 2,
    title: "Interview Scheduled",
    description: "Interview slot confirmed with Priya Singh for tomorrow at 11:30 AM.",
    time: "18 min ago",
    read: false,
  },
  {
    id: 3,
    title: "Payroll Approval Pending",
    description: "March payroll batch is waiting for final HR approval.",
    time: "1 hour ago",
    read: true,
  },
  {
    id: 4,
    title: "Document Verification Completed",
    description: "Employee onboarding documents for Aisha Patel have been verified.",
    time: "3 hours ago",
    read: false,
  },
  {
    id: 5,
    title: "Attendance Alert",
    description: "Two attendance anomalies were detected in today's check-ins.",
    time: "Today",
    read: true,
  },
];

const NotificationsContext = createContext<NotificationsContextValue | undefined>(undefined);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  const value = useMemo(
    () => ({
      notifications,
      unreadCount: notifications.filter((item) => !item.read).length,
      recentNotifications: notifications.slice(0, 5),
      markAsRead,
      markAllAsRead,
    }),
    [notifications],
  );

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotifications() {
  const context = useContext(NotificationsContext);

  if (!context) {
    throw new Error("useNotifications must be used inside NotificationsProvider");
  }

  return context;
}
