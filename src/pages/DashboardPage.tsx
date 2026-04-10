import { useNavigate } from "react-router-dom";
import { Star, Clock, Plus, BarChart3, Kanban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBoards, useToggleStar } from "@/hooks/useBoards";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: boards = [], isLoading } = useBoards();
  const toggleStar = useToggleStar();
  const { user } = useAuth();

  const starredBoards = boards.filter(b => b.starred);
  const recentBoards = [...boards].sort((a, b) => new Date(b.updated_at || '').getTime() - new Date(a.updated_at || '').getTime());

  if (isLoading) {
    return (
      <div className="p-6 max-w-5xl mx-auto animate-fade-in">
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}</p>
        </div>
        <Button size="sm"><Plus className="w-4 h-4 mr-1" /> New Board</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Boards', value: boards.length, icon: Kanban },
          { label: 'Starred', value: starredBoards.length, icon: Star },
          { label: 'Recent', value: recentBoards.length, icon: Clock },
          { label: 'Active', value: boards.filter(b => !b.is_archived).length, icon: BarChart3 },
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
                  <Star
                    className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500"
                    onClick={e => { e.stopPropagation(); toggleStar.mutate({ boardId: board.id, starred: true }); }}
                  />
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1">{board.description}</p>
                <p className="text-[10px] text-muted-foreground mt-2">{board.member_count} members</p>
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-sm font-medium text-foreground mb-3 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" /> Recent Boards
        </h2>
        {recentBoards.length === 0 ? (
          <div className="p-8 rounded-xl border bg-card text-center">
            <Kanban className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No boards yet. Create your first board to get started!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-3">
            {recentBoards.map(board => (
              <button
                key={board.id}
                className="p-4 rounded-xl border bg-card text-left hover:shadow-sm transition-shadow"
                onClick={() => navigate(`/app/board/${board.id}`)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{board.title}</span>
                  <button onClick={e => { e.stopPropagation(); toggleStar.mutate({ boardId: board.id, starred: board.starred }); }}>
                    <Star className={`w-3.5 h-3.5 ${board.starred ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1">{board.description}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
