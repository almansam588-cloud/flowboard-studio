import { useBoardData, useSprints } from "@/hooks/useBoardData";
import { BarChart3, CheckCircle, Clock, Users, TrendingUp } from "lucide-react";

export function DashboardView({ boardId }: { boardId: string }) {
  const { cards, lists, members } = useBoardData(boardId);
  const { data: sprints = [] } = useSprints(boardId);
  const activeSprint = sprints.find(s => s.status === 'ACTIVE');

  const listCounts = lists.map(l => ({
    name: l.title,
    count: cards.filter(c => c.list_id === l.id).length,
  }));
  const maxCount = Math.max(...listCounts.map(l => l.count), 1);

  const totalPoints = cards.reduce((sum, c) => sum + (c.story_points || 0), 0);
  const totalTime = cards.reduce((sum, c) => sum + c.total_time_seconds, 0);
  const completedCards = cards.filter(c => c.is_completed).length;

  const workload = members.map(u => ({
    name: u.full_name || u.email,
    cards: cards.filter(c => c.assignees.some(a => a.id === u.id)).length,
  })).filter(w => w.cards > 0);
  const maxWorkload = Math.max(...workload.map(w => w.cards), 1);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Tasks', value: cards.length, icon: BarChart3 },
          { label: 'Completed', value: completedCards, icon: CheckCircle },
          { label: 'Total Points', value: totalPoints, icon: TrendingUp },
          { label: 'Time Logged', value: `${Math.round(totalTime / 3600)}h`, icon: Clock },
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
            {workload.length === 0 && <p className="text-xs text-muted-foreground">No assignments yet</p>}
          </div>
        </div>
      </div>

      {activeSprint && (
        <div className="p-5 rounded-xl border bg-card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-foreground">{activeSprint.name}</h3>
            <span className="text-xs text-muted-foreground">
              {activeSprint.start_date} → {activeSprint.end_date}
            </span>
          </div>
          {activeSprint.goal && (
            <p className="text-xs text-muted-foreground mb-3">{activeSprint.goal}</p>
          )}
        </div>
      )}
    </div>
  );
}
