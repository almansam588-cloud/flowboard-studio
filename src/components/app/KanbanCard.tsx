import { CardView } from "@/hooks/useBoardData";
import { useStore } from "@/store";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MessageCircle, Paperclip, Clock } from "lucide-react";

const priorityStyles: Record<string, string> = {
  CRITICAL: 'bg-destructive',
  HIGH: 'bg-warning',
  MEDIUM: 'bg-primary',
  LOW: 'bg-muted-foreground',
  NONE: 'bg-muted-foreground/50',
};

export function KanbanCard({ card, isDragging }: { card: CardView; isDragging?: boolean }) {
  const { setCurrentCard } = useStore();
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
  };

  const getInitials = (name: string | null) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-3 rounded-lg border bg-card hover:shadow-sm transition-shadow cursor-pointer ${isDragging ? 'shadow-lg ring-1 ring-primary/20' : ''}`}
      onClick={() => setCurrentCard(card.id)}
    >
      {card.labels.length > 0 && (
        <div className="flex gap-1 mb-2">
          {card.labels.map(label => (
            <span key={label.id} className="h-1.5 w-8 rounded-full" style={{ backgroundColor: label.color }} />
          ))}
        </div>
      )}

      <p className="text-sm font-medium text-foreground mb-2">{card.title}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${priorityStyles[card.priority]}`} />
          <span className="text-[10px] text-muted-foreground capitalize">{card.priority.toLowerCase()}</span>
          {card.story_points && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{card.story_points}pt</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {card.comment_count > 0 && (
            <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
              <MessageCircle className="w-3 h-3" /> {card.comment_count}
            </span>
          )}
          {card.attachment_count > 0 && (
            <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
              <Paperclip className="w-3 h-3" /> {card.attachment_count}
            </span>
          )}
          {card.active_time_entry && <Clock className="w-3 h-3 text-green-500 animate-pulse" />}
        </div>
      </div>

      {(card.assignees.length > 0 || card.due_date) && (
        <div className="flex items-center justify-between mt-2 pt-2 border-t">
          <div className="flex -space-x-1">
            {card.assignees.slice(0, 3).map(user => (
              <div key={user.id} className="w-5 h-5 rounded-full bg-muted border border-card flex items-center justify-center text-[8px] font-medium text-muted-foreground">
                {getInitials(user.full_name)}
              </div>
            ))}
          </div>
          {card.due_date && (
            <span className="text-[10px] text-muted-foreground">
              {new Date(card.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
