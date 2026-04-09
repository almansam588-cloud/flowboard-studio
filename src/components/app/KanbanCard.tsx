import { Card as CardType, useStore } from "@/store";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MessageCircle, Paperclip, Clock } from "lucide-react";

const priorityStyles: Record<string, string> = {
  urgent: 'bg-destructive',
  high: 'bg-warning',
  medium: 'bg-primary',
  low: 'bg-muted-foreground',
};

export function KanbanCard({ card, isDragging }: { card: CardType; isDragging?: boolean }) {
  const { setCurrentCard, getUserById, getLabelById } = useStore();
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
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
      {/* Labels */}
      {card.labels.length > 0 && (
        <div className="flex gap-1 mb-2">
          {card.labels.map(lid => {
            const label = getLabelById(lid);
            return label ? (
              <span key={lid} className="h-1.5 w-8 rounded-full" style={{ backgroundColor: label.color }} />
            ) : null;
          })}
        </div>
      )}

      {/* Title */}
      <p className="text-sm font-medium text-foreground mb-2">{card.title}</p>

      {/* Priority + meta */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${priorityStyles[card.priority]}`} />
          <span className="text-[10px] text-muted-foreground capitalize">{card.priority}</span>
          {card.storyPoints && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{card.storyPoints}pt</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {card.comments.length > 0 && (
            <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
              <MessageCircle className="w-3 h-3" /> {card.comments.length}
            </span>
          )}
          {card.attachments.length > 0 && (
            <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
              <Paperclip className="w-3 h-3" /> {card.attachments.length}
            </span>
          )}
          {card.isTracking && <Clock className="w-3 h-3 text-success animate-pulse" />}
        </div>
      </div>

      {/* Assignees + due date */}
      {(card.assignees.length > 0 || card.dueDate) && (
        <div className="flex items-center justify-between mt-2 pt-2 border-t">
          <div className="flex -space-x-1">
            {card.assignees.slice(0, 3).map(uid => {
              const user = getUserById(uid);
              return (
                <div key={uid} className="w-5 h-5 rounded-full bg-muted border border-card flex items-center justify-center text-[8px] font-medium text-muted-foreground">
                  {user?.name.split(' ').map(n => n[0]).join('')}
                </div>
              );
            })}
          </div>
          {card.dueDate && (
            <span className="text-[10px] text-muted-foreground">
              {new Date(card.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
