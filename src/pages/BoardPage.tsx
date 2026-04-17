import { useParams } from "react-router-dom";
import { useStore, ViewMode } from "@/store";
import { Star, Kanban, Table, Calendar, BarChart3, Timer } from "lucide-react";
import { KanbanView } from "@/components/app/KanbanView";
import { TableView } from "@/components/app/TableView";
import { CalendarView } from "@/components/app/CalendarView";
import { TimelineView } from "@/components/app/TimelineView";
import { DashboardView } from "@/components/app/DashboardView";
import { CardDetailModal } from "@/components/app/CardDetailModal";
import { useBoards, useToggleStar } from "@/hooks/useBoards";
import { useBoardData, useBoardRealtime } from "@/hooks/useBoardData";

const viewOptions: { id: ViewMode; label: string; icon: typeof Kanban }[] = [
  { id: 'kanban', label: 'Kanban', icon: Kanban },
  { id: 'table', label: 'Table', icon: Table },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'timeline', label: 'Timeline', icon: Timer },
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
];

export default function BoardPage() {
  const { boardId } = useParams();
  const { currentCardId, setCurrentCard, setBoardView, getBoardView } = useStore();
  const { data: boards = [] } = useBoards();
  const toggleStar = useToggleStar();
  const { members } = useBoardData(boardId);
  const board = boards.find(b => b.id === boardId);
  const viewMode = boardId ? getBoardView(boardId) : 'kanban';

  if (!board) return <div className="p-6 text-muted-foreground">Board not found</div>;

  const getInitials = (name: string | null) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const ViewComponent = {
    kanban: KanbanView,
    table: TableView,
    calendar: CalendarView,
    timeline: TimelineView,
    dashboard: DashboardView,
  }[viewMode];

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="px-4 py-3 border-b flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="font-semibold text-foreground">{board.title}</h1>
          <button onClick={() => toggleStar.mutate({ boardId: board.id, starred: board.starred })}>
            <Star className={`w-4 h-4 ${board.starred ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground hover:text-foreground'} transition-colors`} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-muted rounded-lg p-0.5">
            {viewOptions.map(v => (
              <button
                key={v.id}
                onClick={() => setBoardView(board.id, v.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${viewMode === v.id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <v.icon className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{v.label}</span>
              </button>
            ))}
          </div>
          <div className="flex -space-x-1.5 ml-2">
            {members.slice(0, 3).map(m => (
              <div key={m.id} className="w-6 h-6 rounded-full bg-muted border-2 border-card flex items-center justify-center text-[9px] font-medium text-muted-foreground">
                {getInitials(m.full_name)}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <ViewComponent boardId={board.id} />
      </div>

      {currentCardId && <CardDetailModal cardId={currentCardId} onClose={() => setCurrentCard(null)} />}
    </div>
  );
}
