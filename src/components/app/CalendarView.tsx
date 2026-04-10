import { useStore } from "@/store";
import { useBoardData } from "@/hooks/useBoardData";

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function CalendarView({ boardId }: { boardId: string }) {
  const { cards } = useBoardData(boardId);
  const { setCurrentCard } = useStore();
  const boardCards = cards.filter(c => c.due_date);

  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const firstDay = (new Date(today.getFullYear(), today.getMonth(), 1).getDay() + 6) % 7;

  return (
    <div className="p-4">
      <h2 className="text-sm font-medium text-foreground mb-4">
        {today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
      </h2>
      <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
        {days.map(d => (
          <div key={d} className="bg-card p-2 text-center text-xs font-medium text-muted-foreground">{d}</div>
        ))}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="bg-card p-2 min-h-[80px]" />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const dayCards = boardCards.filter(c => c.due_date && c.due_date.startsWith(dateStr));
          const isToday = day === today.getDate();

          return (
            <div key={day} className={`bg-card p-2 min-h-[80px] ${isToday ? 'ring-1 ring-inset ring-primary' : ''}`}>
              <span className={`text-xs ${isToday ? 'text-primary font-bold' : 'text-muted-foreground'}`}>{day}</span>
              <div className="mt-1 space-y-0.5">
                {dayCards.map(c => (
                  <button
                    key={c.id}
                    className="w-full text-left text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary truncate hover:bg-primary/20"
                    onClick={() => setCurrentCard(c.id)}
                  >
                    {c.title}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
