import { create } from 'zustand';

export type ViewMode = 'kanban' | 'table' | 'calendar' | 'timeline' | 'dashboard';

interface AppState {
  // UI State
  currentBoardId: string | null;
  currentCardId: string | null;
  selectedCards: string[];
  searchOpen: boolean;
  searchQuery: string;
  boardViewModes: Record<string, ViewMode>;

  // Actions
  setCurrentBoard: (id: string | null) => void;
  setCurrentCard: (id: string | null) => void;
  toggleCardSelection: (id: string) => void;
  clearSelection: () => void;
  setSearchOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setBoardView: (boardId: string, view: ViewMode) => void;
  getBoardView: (boardId: string) => ViewMode;
}

export const useStore = create<AppState>((set, get) => ({
  currentBoardId: null,
  currentCardId: null,
  selectedCards: [],
  searchOpen: false,
  searchQuery: '',
  boardViewModes: {},

  setCurrentBoard: (id) => set({ currentBoardId: id }),
  setCurrentCard: (id) => set({ currentCardId: id }),
  toggleCardSelection: (id) => set((s) => ({
    selectedCards: s.selectedCards.includes(id) ? s.selectedCards.filter(c => c !== id) : [...s.selectedCards, id]
  })),
  clearSelection: () => set({ selectedCards: [] }),
  setSearchOpen: (open) => set({ searchOpen: open }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setBoardView: (boardId, view) => set((s) => ({
    boardViewModes: { ...s.boardViewModes, [boardId]: view }
  })),
  getBoardView: (boardId) => get().boardViewModes[boardId] || 'kanban',
}));
