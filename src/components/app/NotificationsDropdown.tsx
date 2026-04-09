import { useStore } from "@/store";
import { Bell, MessageCircle, UserPlus, Clock, AlertCircle } from "lucide-react";
import { useEffect, useRef } from "react";

const typeIcons = {
  comment: MessageCircle,
  assignment: UserPlus,
  due: Clock,
  mention: Bell,
  update: AlertCircle,
};

export function NotificationsDropdown({ onClose }: { onClose: () => void }) {
  const { notifications, markNotificationRead } = useStore();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <div ref={ref} className="absolute right-0 top-10 w-80 rounded-xl border bg-card shadow-lg z-50 animate-fade-in">
      <div className="p-3 border-b flex items-center justify-between">
        <span className="font-medium text-sm text-foreground">Notifications</span>
        <span className="text-xs text-muted-foreground">{notifications.filter(n => !n.read).length} unread</span>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {notifications.map(n => {
          const Icon = typeIcons[n.type];
          return (
            <button
              key={n.id}
              className={`w-full p-3 flex gap-3 text-left hover:bg-accent/50 transition-colors ${!n.read ? 'bg-primary/5' : ''}`}
              onClick={() => markNotificationRead(n.id)}
            >
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <Icon className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{n.title}</p>
                <p className="text-xs text-muted-foreground truncate">{n.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
