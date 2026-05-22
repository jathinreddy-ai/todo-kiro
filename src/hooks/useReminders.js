// Due-date browser notification scheduler.
// Fires a notification for tasks due within 24 hours (once per task per session).
import { useEffect, useRef } from "react";
import { isDueSoon } from "../utils/taskHelpers";

export function useReminders(tasks) {
  const notifiedIds = useRef(new Set());

  useEffect(() => {
    const check = () => {
      if (!("Notification" in window)) return;

      const pending = tasks.filter(
        (t) => !t.completed && isDueSoon(t) && !notifiedIds.current.has(t.id),
      );

      if (pending.length === 0) return;

      if (Notification.permission === "granted") {
        pending.forEach((t) => {
          new Notification("Task due soon", {
            body: t.title,
            icon: "/favicon.svg",
          });
          notifiedIds.current.add(t.id);
        });
      } else if (Notification.permission === "default") {
        Notification.requestPermission().then((perm) => {
          if (perm === "granted") {
            pending.forEach((t) => {
              new Notification("Task due soon", {
                body: t.title,
                icon: "/favicon.svg",
              });
              notifiedIds.current.add(t.id);
            });
          }
        });
      }
    };

    check();
    const interval = setInterval(check, 60_000);
    return () => clearInterval(interval);
  }, [tasks]);
}
