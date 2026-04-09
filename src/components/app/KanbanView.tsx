import { useStore } from "@/store";
import { Plus, MoreHorizontal, AlertCircle } from "lucide-react";
import { useState } from "react";
import { DndContext, closestCorners, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { KanbanCard } from "./KanbanCard";

export function KanbanView({ boardId }: { boardId: string }) {
  const { lists, cards, moveCard, addCard } = useStore();
  const boardLists = lists.filter(l => l.boardId === boardId).sort((a, b) => a.order - b.order);
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragStart = (e: DragStartEvent) => setActiveId(e.active.id as string);

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = e;
    if (!over) return;

    const cardId = active.id as string;
    const overId = over.id as string;

    // Check if dropped on a list
    const targetList = boardLists.find(l => l.id === overId);
    if (targetList) {
      moveCard(cardId, targetList.id, 0);
      return;
    }

    // Dropped on another card
    const targetCard = cards.find(c => c.id === overId);
    if (targetCard) {
      moveCard(cardId, targetCard.listId, targetCard.order);
    }
  };

  const handleAddCard = (listId: string) => {
    if (newTitle.trim()) {
      addCard(listId, newTitle.trim());
      setNewTitle("");
      setAddingTo(null);
    }
  };

  const activeCard = activeId ? cards.find(c => c.id === activeId) : null;

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 p-4 h-full overflow-x-auto">
        {boardLists.map(list => {
          const listCards = cards.filter(c => c.listId === list.id).sort((a, b) => a.order - b.order);
          const overWip = list.wipLimit && listCards.length > list.wipLimit;

          return (
            <div key={list.id} className="w-[280px] flex-shrink-0 flex flex-col">
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-foreground">{list.title}</h3>
                  <span className="text-xs text-muted-foreground">{listCards.length}</span>
                  {list.wipLimit && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${overWip ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground'}`}>
                      {overWip && <AlertCircle className="w-2.5 h-2.5 inline mr-0.5" />}
                      max {list.wipLimit}
                    </span>
                  )}
                </div>
                <button className="text-muted-foreground hover:text-foreground">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              <SortableContext items={listCards.map(c => c.id)} strategy={verticalListSortingStrategy} id={list.id}>
                <div className="flex-1 space-y-2 min-h-[100px]" id={list.id}>
                  {listCards.map(card => (
                    <KanbanCard key={card.id} card={card} />
                  ))}
                </div>
              </SortableContext>

              {addingTo === list.id ? (
                <div className="mt-2">
                  <input
                    className="w-full p-2 rounded-lg border bg-card text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Card title..."
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddCard(list.id)}
                    onBlur={() => { if (!newTitle) setAddingTo(null); }}
                    autoFocus
                  />
                  <div className="flex gap-2 mt-1.5">
                    <button className="px-3 py-1 rounded-md bg-primary text-primary-foreground text-xs font-medium" onClick={() => handleAddCard(list.id)}>Add</button>
                    <button className="px-3 py-1 rounded-md text-xs text-muted-foreground hover:text-foreground" onClick={() => setAddingTo(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <button
                  className="mt-2 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors w-full px-2 py-1.5 rounded-md hover:bg-accent"
                  onClick={() => setAddingTo(list.id)}
                >
                  <Plus className="w-4 h-4" /> Add card
                </button>
              )}
            </div>
          );
        })}
      </div>

      <DragOverlay>
        {activeCard && <KanbanCard card={activeCard} isDragging />}
      </DragOverlay>
    </DndContext>
  );
}
