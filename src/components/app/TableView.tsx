import { useStore } from "@/store";
import { useBoardData } from "@/hooks/useBoardData";

export function TableView({ boardId }: { boardId: string }) {
  const { lists, cards } = useBoardData(boardId);
  const { setCurrentCard } = useStore();

  const priorityStyles: Record<string, string> = {
    CRITICAL: 'bg-destructive/10 text-destructive',
    HIGH: 'bg-warning/10 text-warning',
    MEDIUM: 'bg-primary/10 text-primary',
    LOW: 'bg-muted text-muted-foreground',
    NONE: 'bg-muted text-muted-foreground',
  };

  const getInitials = (name: string | null) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="p-4 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Title</th>
            <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Status</th>
            <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Priority</th>
            <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Assignees</th>
            <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Due Date</th>
            <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Points</th>
          </tr>
        </thead>
        <tbody>
          {cards.map(card => {
            const list = lists.find(l => l.id === card.list_id);
            return (
              <tr key={card.id} className="border-b hover:bg-accent/50 cursor-pointer transition-colors" onClick={() => setCurrentCard(card.id)}>
                <td className="py-2.5 px-3 font-medium text-foreground">{card.title}</td>
                <td className="py-2.5 px-3 text-muted-foreground text-xs">{list?.title}</td>
                <td className="py-2.5 px-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize ${priorityStyles[card.priority]}`}>{card.priority.toLowerCase()}</span>
                </td>
                <td className="py-2.5 px-3">
                  <div className="flex -space-x-1">
                    {card.assignees.slice(0, 3).map(user => (
                      <div key={user.id} className="w-5 h-5 rounded-full bg-muted border border-card flex items-center justify-center text-[8px] font-medium text-muted-foreground">
                        {getInitials(user.full_name)}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="py-2.5 px-3 text-xs text-muted-foreground">
                  {card.due_date ? new Date(card.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                </td>
                <td className="py-2.5 px-3 text-xs text-muted-foreground">{card.story_points || '—'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
