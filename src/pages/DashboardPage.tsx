import { useStore } from "@/store";
import { useNavigate } from "react-router-dom";
import { Star, Clock, Plus, BarChart3, Users, Kanban } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { boards, cards, currentSprint, toggleStar } = useStore();
  const navigate = useNavigate();
  const starredBoards = boards.filter(b => b.starred);
  const recentBoards = [...boards].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const totalCards = cards.length;
  const doneCards = cards.filter(c => c.listId === 'list5').length;
  const inProgress = cards.filter(c => c.listId === 'list3').length;

  return (
    <div className="p-6 max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back, Alex</p>
        </div>
        <Button size="sm"><Plus className="w-4 h-4 mr-1" /> New Board</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Cards', value: totalCards, icon: Kanban },
          { label: 'In Progress', value: inProgress, icon: Clock },
          { label: 'Completed', value: doneCards, icon: BarChart3 },
          { label: 'Sprint Progress', value: `${Math.round(currentSprint.completedPoints / currentSprint.totalPoints * 100)}%`, icon: Users },
        ].map(stat => (
          <div key={stat.label} className="p-4 rounded-xl border bg-card">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Sprint */}
      <div className="p-4 rounded-xl border bg-card mb-8">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-medium text-foreground text-sm">{currentSprint.name}</h3>
            <p className="text-xs text-muted-foreground">{currentSprint.startDate} → {currentSprint.endDate}</p>
          </div>
          <span className="text-sm font-medium text-foreground">{currentSprint.completedPoints}/{currentSprint.totalPoints} pts</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(currentSprint.completedPoints / currentSprint.totalPoints) * 100}%` }} />
        </div>
      </div>

      {/* Starred */}
      {starredBoards.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-medium text-foreground mb-3 flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5" /> Starred Boards
          </h2>
          <div className="grid md:grid-cols-3 gap-3">
            {starredBoards.map(board => (
              <button
                key={board.id}
                className="p-4 rounded-xl border bg-card text-left hover:shadow-sm transition-shadow group"
                onClick={() => navigate(`/app/board/${board.id}`)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{board.title}</span>
                  <Star className="w-3.5 h-3.5 text-warning fill-warning" onClick={e => { e.stopPropagation(); toggleStar(board.id); }} />
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1">{board.description}</p>
                <p className="text-[10px] text-muted-foreground mt-2">{board.members.length} members</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recent */}
      <div>
        <h2 className="text-sm font-medium text-foreground mb-3 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" /> Recent Boards
        </h2>
        <div className="grid md:grid-cols-3 gap-3">
          {recentBoards.map(board => (
            <button
              key={board.id}
              className="p-4 rounded-xl border bg-card text-left hover:shadow-sm transition-shadow"
              onClick={() => navigate(`/app/board/${board.id}`)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{board.title}</span>
                <button onClick={e => { e.stopPropagation(); toggleStar(board.id); }}>
                  <Star className={`w-3.5 h-3.5 ${board.starred ? 'text-warning fill-warning' : 'text-muted-foreground'}`} />
                </button>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-1">{board.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
