import { useStore } from "@/store";

export function TimelineView({ boardId }: { boardId: string }) {
  const { cards, lists, setCurrentCard } = useStore();
  const boardCards = cards.filter(c => c.boardId === boardId && c.dueDate).sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());

  const priorityColors: Record<string, string> = {
    urgent: 'bg-destructive',
    high: 'bg-warning',
    medium: 'bg-primary',
    low: 'bg-muted-foreground',
  };

  // Simple Gantt-like view
  const startDate = new Date('2026-04-01');
  const endDate = new Date('2026-04-30');
  const totalDays = 30;

  const getPosition = (date: string) => {
    const d = new Date(date);
    const diff = (d.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    return Math.max(0, Math.min(100, (diff / totalDays) * 100));
  };

  return (
    <div className="p-4">
      <h2 className="text-sm font-medium text-foreground mb-4">Timeline — April 2026</h2>

      {/* Date header */}
      <div className="flex mb-2">
        <div className="w-48 flex-shrink-0" />
        <div className="flex-1 flex">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex-1 text-[10px] text-muted-foreground text-center">
              Apr {1 + i * 5}
            </div>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-1.5">
        {boardCards.map(card => {
          const list = lists.find(l => l.id === card.listId);
          const pos = getPosition(card.dueDate!);
          const createdPos = getPosition(card.createdAt.split('T')[0]);
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
