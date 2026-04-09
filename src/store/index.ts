import { create } from 'zustand';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type ViewMode = 'kanban' | 'table' | 'calendar' | 'timeline' | 'dashboard';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
  reactions: { emoji: string; userIds: string[] }[];
  replies?: Comment[];
}

export interface Card {
  id: string;
  title: string;
  description: string;
  listId: string;
  boardId: string;
  order: number;
  priority: Priority;
  labels: string[];
  assignees: string[];
  dueDate?: string;
  storyPoints?: number;
  timeTracked: number; // minutes
  isTracking: boolean;
  comments: Comment[];
  attachments: { id: string; name: string; url: string }[];
  dependencies: { cardId: string; type: 'blocked' | 'blocking' | 'related' | 'duplicate' }[];
  customFields: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface List {
  id: string;
  title: string;
  boardId: string;
  order: number;
  wipLimit?: number;
}

export interface Board {
  id: string;
  title: string;
  description: string;
  workspaceId: string;
  starred: boolean;
  viewMode: ViewMode;
  lists: string[];
  members: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  boards: string[];
  members: string[];
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  read: boolean;
  createdAt: string;
  type: 'mention' | 'assignment' | 'due' | 'comment' | 'update';
}

export interface Sprint {
  id: string;
  name: string;
  boardId: string;
  startDate: string;
  endDate: string;
  totalPoints: number;
  completedPoints: number;
}

// Mock data
const mockUsers: User[] = [
  { id: 'u1', name: 'Alex Chen', email: 'alex@flowboard.io', avatar: '', role: 'owner' },
  { id: 'u2', name: 'Sarah Miller', email: 'sarah@flowboard.io', avatar: '', role: 'admin' },
  { id: 'u3', name: 'James Wilson', email: 'james@flowboard.io', avatar: '', role: 'member' },
  { id: 'u4', name: 'Emily Davis', email: 'emily@flowboard.io', avatar: '', role: 'member' },
];

const mockLabels: Label[] = [
  { id: 'l1', name: 'Bug', color: '#EF4444' },
  { id: 'l2', name: 'Feature', color: '#2563EB' },
  { id: 'l3', name: 'Design', color: '#8B5CF6' },
  { id: 'l4', name: 'Documentation', color: '#10B981' },
  { id: 'l5', name: 'Performance', color: '#F59E0B' },
];

const mockLists: List[] = [
  { id: 'list1', title: 'Backlog', boardId: 'b1', order: 0 },
  { id: 'list2', title: 'To Do', boardId: 'b1', order: 1, wipLimit: 5 },
  { id: 'list3', title: 'In Progress', boardId: 'b1', order: 2, wipLimit: 3 },
  { id: 'list4', title: 'Review', boardId: 'b1', order: 3, wipLimit: 2 },
  { id: 'list5', title: 'Done', boardId: 'b1', order: 4 },
];

const mockCards: Card[] = [
  {
    id: 'c1', title: 'Design new dashboard layout', description: 'Create wireframes and mockups for the analytics dashboard redesign.',
    listId: 'list3', boardId: 'b1', order: 0, priority: 'high', labels: ['l3'], assignees: ['u1', 'u2'],
    dueDate: '2026-04-15', storyPoints: 5, timeTracked: 120, isTracking: false,
    comments: [
      { id: 'cm1', userId: 'u2', content: 'Looking great! Can we add a dark mode toggle?', createdAt: '2026-04-08T10:00:00Z', reactions: [{ emoji: '👍', userIds: ['u1'] }] }
    ],
    attachments: [{ id: 'a1', name: 'dashboard-v2.fig', url: '#' }],
    dependencies: [], customFields: {}, createdAt: '2026-04-01T08:00:00Z', updatedAt: '2026-04-08T14:00:00Z'
  },
  {
    id: 'c2', title: 'Implement authentication flow', description: 'Set up login, signup, and password reset with Supabase Auth.',
    listId: 'list2', boardId: 'b1', order: 0, priority: 'urgent', labels: ['l2'], assignees: ['u3'],
    dueDate: '2026-04-12', storyPoints: 8, timeTracked: 45, isTracking: false,
    comments: [], attachments: [], dependencies: [], customFields: {},
    createdAt: '2026-04-02T08:00:00Z', updatedAt: '2026-04-07T10:00:00Z'
  },
  {
    id: 'c3', title: 'Fix card drag animation', description: 'Cards stutter when dragged between lists on mobile.',
    listId: 'list2', boardId: 'b1', order: 1, priority: 'medium', labels: ['l1'], assignees: ['u1'],
    dueDate: '2026-04-14', storyPoints: 3, timeTracked: 0, isTracking: false,
    comments: [], attachments: [], dependencies: [{ cardId: 'c1', type: 'related' }], customFields: {},
    createdAt: '2026-04-03T08:00:00Z', updatedAt: '2026-04-06T12:00:00Z'
  },
  {
    id: 'c4', title: 'Write API documentation', description: 'Document all REST endpoints for the public API.',
    listId: 'list1', boardId: 'b1', order: 0, priority: 'low', labels: ['l4'], assignees: ['u4'],
    storyPoints: 5, timeTracked: 30, isTracking: false,
    comments: [], attachments: [], dependencies: [], customFields: {},
    createdAt: '2026-04-04T08:00:00Z', updatedAt: '2026-04-05T09:00:00Z'
  },
  {
    id: 'c5', title: 'Optimize database queries', description: 'Reduce query time for board loading by 50%.',
    listId: 'list4', boardId: 'b1', order: 0, priority: 'high', labels: ['l5'], assignees: ['u3', 'u1'],
    dueDate: '2026-04-11', storyPoints: 8, timeTracked: 200, isTracking: true,
    comments: [], attachments: [], dependencies: [{ cardId: 'c2', type: 'blocked' }], customFields: {},
    createdAt: '2026-04-01T08:00:00Z', updatedAt: '2026-04-09T08:00:00Z'
  },
  {
    id: 'c6', title: 'Add email notifications', description: 'Send email when assigned to a card or mentioned.',
    listId: 'list1', boardId: 'b1', order: 1, priority: 'medium', labels: ['l2'], assignees: ['u2'],
    storyPoints: 5, timeTracked: 0, isTracking: false,
    comments: [], attachments: [], dependencies: [], customFields: {},
    createdAt: '2026-04-05T08:00:00Z', updatedAt: '2026-04-05T08:00:00Z'
  },
  {
    id: 'c7', title: 'User onboarding tutorial', description: 'Create interactive walkthrough for new users.',
    listId: 'list5', boardId: 'b1', order: 0, priority: 'medium', labels: ['l3', 'l2'], assignees: ['u4', 'u2'],
    storyPoints: 3, timeTracked: 180, isTracking: false,
    comments: [
      { id: 'cm2', userId: 'u1', content: 'Shipped! 🚀', createdAt: '2026-04-07T16:00:00Z', reactions: [{ emoji: '🎉', userIds: ['u2', 'u3', 'u4'] }] }
    ],
    attachments: [], dependencies: [], customFields: {},
    createdAt: '2026-03-28T08:00:00Z', updatedAt: '2026-04-07T16:00:00Z'
  },
];

const mockBoards: Board[] = [
  { id: 'b1', title: 'Product Launch Q2', description: 'All tasks for the Q2 product launch.', workspaceId: 'w1', starred: true, viewMode: 'kanban', lists: ['list1', 'list2', 'list3', 'list4', 'list5'], members: ['u1', 'u2', 'u3', 'u4'], createdAt: '2026-03-15T08:00:00Z', updatedAt: '2026-04-09T08:00:00Z' },
  { id: 'b2', title: 'Marketing Campaigns', description: 'Campaign planning and tracking.', workspaceId: 'w1', starred: false, viewMode: 'kanban', lists: [], members: ['u1', 'u2'], createdAt: '2026-03-20T08:00:00Z', updatedAt: '2026-04-05T08:00:00Z' },
  { id: 'b3', title: 'Bug Tracker', description: 'Track and fix bugs.', workspaceId: 'w1', starred: true, viewMode: 'kanban', lists: [], members: ['u1', 'u3'], createdAt: '2026-04-01T08:00:00Z', updatedAt: '2026-04-08T08:00:00Z' },
];

const mockNotifications: Notification[] = [
  { id: 'n1', title: 'New comment', description: 'Sarah commented on "Design new dashboard layout"', read: false, createdAt: '2026-04-09T08:00:00Z', type: 'comment' },
  { id: 'n2', title: 'Due soon', description: '"Implement authentication flow" is due tomorrow', read: false, createdAt: '2026-04-09T07:00:00Z', type: 'due' },
  { id: 'n3', title: 'Assigned to you', description: 'You were assigned to "Fix card drag animation"', read: true, createdAt: '2026-04-08T14:00:00Z', type: 'assignment' },
];

const mockSprint: Sprint = {
  id: 's1', name: 'Sprint 4', boardId: 'b1',
  startDate: '2026-04-07', endDate: '2026-04-21',
  totalPoints: 32, completedPoints: 11
};

interface AppState {
  // Data
  users: User[];
  labels: Label[];
  boards: Board[];
  lists: List[];
  cards: Card[];
  notifications: Notification[];
  currentSprint: Sprint;
  workspaces: Workspace[];

  // UI State
  currentBoardId: string | null;
  currentCardId: string | null;
  selectedCards: string[];
  searchOpen: boolean;
  searchQuery: string;

  // Actions
  setCurrentBoard: (id: string | null) => void;
  setCurrentCard: (id: string | null) => void;
  toggleCardSelection: (id: string) => void;
  clearSelection: () => void;
  setSearchOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  moveCard: (cardId: string, toListId: string, toIndex: number) => void;
  updateCard: (cardId: string, updates: Partial<Card>) => void;
  addCard: (listId: string, title: string) => void;
  toggleStar: (boardId: string) => void;
  setBoardView: (boardId: string, view: ViewMode) => void;
  markNotificationRead: (id: string) => void;
  toggleTimeTracking: (cardId: string) => void;
  getUserById: (id: string) => User | undefined;
  getLabelById: (id: string) => Label | undefined;
}

export const useStore = create<AppState>((set, get) => ({
  users: mockUsers,
  labels: mockLabels,
  boards: mockBoards,
  lists: mockLists,
  cards: mockCards,
  notifications: mockNotifications,
  currentSprint: mockSprint,
  workspaces: [{ id: 'w1', name: 'Flowboard Team', boards: ['b1', 'b2', 'b3'], members: ['u1', 'u2', 'u3', 'u4'] }],

  currentBoardId: null,
  currentCardId: null,
  selectedCards: [],
  searchOpen: false,
  searchQuery: '',

  setCurrentBoard: (id) => set({ currentBoardId: id }),
  setCurrentCard: (id) => set({ currentCardId: id }),
  toggleCardSelection: (id) => set((s) => ({
    selectedCards: s.selectedCards.includes(id) ? s.selectedCards.filter(c => c !== id) : [...s.selectedCards, id]
  })),
  clearSelection: () => set({ selectedCards: [] }),
  setSearchOpen: (open) => set({ searchOpen: open }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  moveCard: (cardId, toListId, toIndex) => set((s) => ({
    cards: s.cards.map(c => c.id === cardId ? { ...c, listId: toListId, order: toIndex } : c)
  })),
  updateCard: (cardId, updates) => set((s) => ({
    cards: s.cards.map(c => c.id === cardId ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c)
  })),
  addCard: (listId, title) => set((s) => {
    const list = s.lists.find(l => l.id === listId);
    if (!list) return s;
    const newCard: Card = {
      id: `c${Date.now()}`, title, description: '', listId, boardId: list.boardId,
      order: s.cards.filter(c => c.listId === listId).length,
      priority: 'medium', labels: [], assignees: [], timeTracked: 0, isTracking: false,
      comments: [], attachments: [], dependencies: [], customFields: {},
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    };
    return { cards: [...s.cards, newCard] };
  }),
  toggleStar: (boardId) => set((s) => ({
    boards: s.boards.map(b => b.id === boardId ? { ...b, starred: !b.starred } : b)
  })),
  setBoardView: (boardId, view) => set((s) => ({
    boards: s.boards.map(b => b.id === boardId ? { ...b, viewMode: view } : b)
  })),
  markNotificationRead: (id) => set((s) => ({
    notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n)
  })),
  toggleTimeTracking: (cardId) => set((s) => ({
    cards: s.cards.map(c => c.id === cardId ? { ...c, isTracking: !c.isTracking } : c)
  })),
  getUserById: (id) => get().users.find(u => u.id === id),
  getLabelById: (id) => get().labels.find(l => l.id === id),
}));
