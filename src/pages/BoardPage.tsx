import { useParams } from "react-router-dom";
import { useStore, ViewMode } from "@/store";
import { Star, MoreHorizontal, Plus, Users, Kanban, Table, Calendar, BarChart3, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KanbanView } from "@/components/app/KanbanView";
import { TableView } from "@/components/app/TableView";
import { CalendarView } from "@/components/app/CalendarView";
import { TimelineView } from "@/components/app/TimelineView";
import { DashboardView } from "@/components/app/DashboardView";
import { CardDetailModal } from "@/components/app/CardDetailModal";

const viewOptions: { id: ViewMode; label: string; icon: typeof Kanban }[] = [
  { id: 'kanban', label: 'Kanban', icon: Kanban },
  { id: 'table', label: 'Table', icon: Table },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'timeline', label: 'Timeline', icon: Timer },
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
];

export default function BoardPage() {
  const { boardId } = useParams();
  const { boards, toggleStar, setBoardView, currentCardId, setCurrentCard } = useStore();
  const board = boards.find(b => b.id === boardId);

  if (!board) return <div className="p-6 text-muted-foreground">Board not found</div>;

  const ViewComponent = {
    kanban: KanbanView,
    table: TableView,
    calendar: CalendarView,
    timeline: TimelineView,
    dashboard: DashboardView,
  }[board.viewMode];

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Board header */}
      <div className="px-4 py-3 border-b flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="font-semibold text-foreground">{board.title}</h1>
          <button onClick={() => toggleStar(board.id)}>
            <Star className={`w-4 h-4 ${board.starred ? 'text-warning fill-warning' : 'text-muted-foreground hover:text-foreground'} transition-colors`} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          {/* View switcher */}
          <div className="flex items-center bg-muted rounded-lg p-0.5">
            {viewOptions.map(v => (
              <button
                key={v.id}
                onClick={() => setBoardView(board.id, v.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${board.viewMode === v.id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <v.icon className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{v.label}</span>
              </button>
            ))}
          </div>
          <div className="flex -space-x-1.5 ml-2">
            {['AC', 'SM', 'JW'].map(initials => (
              <div key={initials} className="w-6 h-6 rounded-full bg-muted border-2 border-card flex items-center justify-center text-[9px] font-medium text-muted-foreground">
                {initials}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* View content */}
      <div className="flex-1 overflow-auto">
        <ViewComponent boardId={board.id} />
      </div>

      {/* Card detail modal */}
      {currentCardId && <CardDetailModal cardId={currentCardId} onClose={() => setCurrentCard(null)} />}
    </div>
  );
}
