import { useStore } from "@/store";
import { useBoardData } from "@/hooks/useBoardData";

export function TimelineView({ boardId }: { boardId: string }) {
  const { cards, lists } = useBoardData(boardId);
  const { setCurrentCard } = useStore();
  const boardCards = cards.filter(c => c.due_date).sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime());

  const priorityColors: Record<string, string> = {
    CRITICAL: 'bg-destructive',
    HIGH: 'bg-warning',
    MEDIUM: 'bg-primary',
    LOW: 'bg-muted-foreground',
    NONE: 'bg-muted-foreground/50',
  };

  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const totalDays = endDate.getDate();

  const getPosition = (date: string) => {
    const d = new Date(date);
    const diff = (d.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    return Math.max(0, Math.min(100, (diff / totalDays) * 100));
  };

  return (
    <div className="p-4">
      <h2 className="text-sm font-medium text-foreground mb-4">
        Timeline — {now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
      </h2>

      <div className="flex mb-2">
        <div className="w-48 flex-shrink-0" />
        <div className="flex-1 flex">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex-1 text-[10px] text-muted-foreground text-center">
              {now.toLocaleDateString('en-US', { month: 'short' })} {1 + i * 5}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        {boardCards.map(card => {
          const list = lists.find(l => l.id === card.list_id);
          const pos = getPosition(card.due_date!);
          const createdPos = card.created_at ? getPosition(card.created_at.split('T')[0]) : 0;
          const barWidth = Math.max(8, pos - createdPos);

          return (
            <div key={card.id} className="flex items-center group cursor-pointer" onClick={() => setCurrentCard(card.id)}>
              <div className="w-48 flex-shrink-0 pr-3">
                <p className="text-xs font-medium text-foreground truncate">{card.title}</p>
                <p className="text-[10px] text-muted-foreground">{list?.title}</p>
              </div>
              <div className="flex-1 relative h-7 bg-muted/50 rounded">
                <div
                  className={`absolute top-1 h-5 rounded ${priorityColors[card.priority]} opacity-80 group-hover:opacity-100 transition-opacity`}
                  style={{ left: `${createdPos}%`, width: `${barWidth}%`, minWidth: '20px' }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
