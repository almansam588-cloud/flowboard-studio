import { useStore } from "@/store";

export function TableView({ boardId }: { boardId: string }) {
  const { lists, cards, getUserById, getLabelById, setCurrentCard } = useStore();
  const boardLists = lists.filter(l => l.boardId === boardId);
  const boardCards = cards.filter(c => c.boardId === boardId);

  const priorityStyles: Record<string, string> = {
    urgent: 'bg-destructive/10 text-destructive',
    high: 'bg-warning/10 text-warning',
    medium: 'bg-primary/10 text-primary',
    low: 'bg-muted text-muted-foreground',
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
          {boardCards.map(card => {
            const list = boardLists.find(l => l.id === card.listId);
            return (
              <tr key={card.id} className="border-b hover:bg-accent/50 cursor-pointer transition-colors" onClick={() => setCurrentCard(card.id)}>
                <td className="py-2.5 px-3 font-medium text-foreground">{card.title}</td>
                <td className="py-2.5 px-3 text-muted-foreground text-xs">{list?.title}</td>
                <td className="py-2.5 px-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize ${priorityStyles[card.priority]}`}>{card.priority}</span>
                </td>
                <td className="py-2.5 px-3">
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
                </td>
                <td className="py-2.5 px-3 text-xs text-muted-foreground">
                  {card.dueDate ? new Date(card.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                </td>
                <td className="py-2.5 px-3 text-xs text-muted-foreground">{card.storyPoints || '—'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
