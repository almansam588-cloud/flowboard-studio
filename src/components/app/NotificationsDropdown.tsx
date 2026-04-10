import { Bell, MessageCircle, UserPlus, Clock, AlertCircle } from "lucide-react";
import { useEffect, useRef } from "react";
import { useNotifications, useMarkNotificationRead } from "@/hooks/useBoardData";

const typeIcons: Record<string, typeof Bell> = {
  COMMENT_ADDED: MessageCircle,
  CARD_ASSIGNED: UserPlus,
  CARD_DUE_SOON: Clock,
  CARD_OVERDUE: Clock,
  MENTION: Bell,
  MEMBER_ADDED: UserPlus,
  BOARD_INVITATION: Bell,
  CHECKLIST_COMPLETED: AlertCircle,
  DEPENDENCY_UNBLOCKED: AlertCircle,
  AUTOMATION_TRIGGERED: AlertCircle,
  WEEKLY_DIGEST: Bell,
  SPRINT_STARTED: AlertCircle,
  SPRINT_COMPLETED: AlertCircle,
};

export function NotificationsDropdown({ onClose }: { onClose: () => void }) {
  const { data: notifications = [] } = useNotifications();
  const markRead = useMarkNotificationRead();
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
        <span className="text-xs text-muted-foreground">{notifications.filter(n => !n.is_read).length} unread</span>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">No notifications</p>
        )}
        {notifications.map(n => {
          const Icon = typeIcons[n.type] || Bell;
          return (
            <button
              key={n.id}
              className={`w-full p-3 flex gap-3 text-left hover:bg-accent/50 transition-colors ${!n.is_read ? 'bg-primary/5' : ''}`}
              onClick={() => markRead.mutate(n.id)}
            >
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <Icon className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{n.title}</p>
                <p className="text-xs text-muted-foreground truncate">{n.body}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
