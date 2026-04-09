import { useStore } from "@/store";
import { BarChart3, CheckCircle, Clock, Users, TrendingUp } from "lucide-react";

export function DashboardView({ boardId }: { boardId: string }) {
  const { cards, lists, users, currentSprint } = useStore();
  const boardCards = cards.filter(c => c.boardId === boardId);
  const boardLists = lists.filter(l => l.boardId === boardId);

  const listCounts = boardLists.map(l => ({
    name: l.title,
    count: boardCards.filter(c => c.listId === l.id).length,
  }));

  const maxCount = Math.max(...listCounts.map(l => l.count), 1);

  const totalPoints = boardCards.reduce((sum, c) => sum + (c.storyPoints || 0), 0);
  const totalTime = boardCards.reduce((sum, c) => sum + c.timeTracked, 0);

  // Workload by user
  const workload = users.map(u => ({
    name: u.name,
    cards: boardCards.filter(c => c.assignees.includes(u.id)).length,
  })).filter(w => w.cards > 0);
  const maxWorkload = Math.max(...workload.map(w => w.cards), 1);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Tasks', value: boardCards.length, icon: BarChart3 },
          { label: 'Completed', value: boardCards.filter(c => c.listId === 'list5').length, icon: CheckCircle },
          { label: 'Total Points', value: totalPoints, icon: TrendingUp },
          { label: 'Time Logged', value: `${Math.round(totalTime / 60)}h`, icon: Clock },
        ].map(stat => (
          <div key={stat.label} className="p-4 rounded-xl border bg-card">
            <div className="flex items-center gap-2 mb-1.5">
              <stat.icon className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Tasks by status */}
        <div className="p-5 rounded-xl border bg-card">
          <h3 className="text-sm font-medium text-foreground mb-4">Tasks by Status</h3>
          <div className="space-y-3">
            {listCounts.map(l => (
              <div key={l.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">{l.name}</span>
                  <span className="text-xs font-medium text-foreground">{l.count}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(l.count / maxCount) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Workload */}
        <div className="p-5 rounded-xl border bg-card">
          <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" /> Workload Distribution
          </h3>
          <div className="space-y-3">
            {workload.map(w => (
              <div key={w.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">{w.name}</span>
                  <span className="text-xs font-medium text-foreground">{w.cards} tasks</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(w.cards / maxWorkload) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sprint progress */}
      <div className="p-5 rounded-xl border bg-card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-foreground">{currentSprint.name}</h3>
          <span className="text-xs text-muted-foreground">
            {currentSprint.completedPoints}/{currentSprint.totalPoints} points
          </span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-success rounded-full transition-all" style={{ width: `${(currentSprint.completedPoints / currentSprint.totalPoints) * 100}%` }} />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[10px] text-muted-foreground">{currentSprint.startDate}</span>
          <span className="text-[10px] text-muted-foreground">{currentSprint.endDate}</span>
        </div>
      </div>
    </div>
  );
}
