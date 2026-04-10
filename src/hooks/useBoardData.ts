import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

// Enriched card type matching what the UI expects
export interface CardView {
  id: string;
  title: string;
  description: string | null;
  description_text: string | null;
  list_id: string;
  board_id: string;
  position: number;
  priority: string;
  due_date: string | null;
  start_date: string | null;
  story_points: number | null;
  estimated_hours: number | null;
  is_completed: boolean | null;
  is_archived: boolean | null;
  created_by: string;
  created_at: string | null;
  updated_at: string | null;
  sprint_id: string | null;
  // Joined data
  labels: { id: string; name: string | null; color: string }[];
  assignees: { id: string; full_name: string | null; avatar_url: string | null; email: string }[];
  comment_count: number;
  attachment_count: number;
  // Time tracking
  active_time_entry: boolean;
  total_time_seconds: number;
}

export interface ListView {
  id: string;
  title: string;
  board_id: string;
  position: number;
  color: string | null;
  is_archived: boolean | null;
  wip_limit: number | null;
}

export interface LabelView {
  id: string;
  name: string | null;
  color: string;
  board_id: string;
}

export interface MemberView {
  id: string;
  full_name: string | null;
  email: string;
  avatar_url: string | null;
  role: string | null;
}

export function useBoardData(boardId: string | undefined) {
  const { user } = useAuth();

  const listsQuery = useQuery({
    queryKey: ['lists', boardId],
    queryFn: async (): Promise<ListView[]> => {
      const { data, error } = await supabase
        .from('lists')
        .select('*')
        .eq('board_id', boardId!)
        .eq('is_archived', false)
        .order('position');
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!boardId && !!user,
  });

  const labelsQuery = useQuery({
    queryKey: ['labels', boardId],
    queryFn: async (): Promise<LabelView[]> => {
      const { data, error } = await supabase
        .from('labels')
        .select('*')
        .eq('board_id', boardId!);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!boardId && !!user,
  });

  const membersQuery = useQuery({
    queryKey: ['board_members', boardId],
    queryFn: async (): Promise<MemberView[]> => {
      const { data, error } = await supabase
        .from('board_members')
        .select('role, user_id, profiles:profiles(id, full_name, email, avatar_url)')
        .eq('board_id', boardId!);
      if (error) throw error;
      return (data ?? []).map(m => {
        const p = m.profiles as unknown as { id: string; full_name: string | null; email: string; avatar_url: string | null };
        return {
          id: p.id,
          full_name: p.full_name,
          email: p.email,
          avatar_url: p.avatar_url,
          role: m.role,
        };
      });
    },
    enabled: !!boardId && !!user,
  });

  const cardsQuery = useQuery({
    queryKey: ['cards', boardId],
    queryFn: async (): Promise<CardView[]> => {
      // Fetch cards
      const { data: rawCards, error: cardsError } = await supabase
        .from('cards')
        .select('*')
        .eq('board_id', boardId!)
        .eq('is_archived', false)
        .order('position');
      if (cardsError) throw cardsError;
      if (!rawCards || rawCards.length === 0) return [];

      const cardIds = rawCards.map(c => c.id);

      // Fetch related data in parallel
      const [labelsRes, assignmentsRes, commentsRes, attachmentsRes, timeRes] = await Promise.all([
        supabase.from('card_labels').select('card_id, labels(id, name, color)').in('card_id', cardIds),
        supabase.from('card_assignments').select('card_id, profiles:profiles(id, full_name, email, avatar_url)').in('card_id', cardIds),
        supabase.from('comments').select('card_id').in('card_id', cardIds),
        supabase.from('attachments').select('card_id').in('card_id', cardIds),
        supabase.from('time_entries').select('card_id, duration_seconds, ended_at').in('card_id', cardIds),
      ]);

      // Build lookup maps
      const cardLabels: Record<string, { id: string; name: string | null; color: string }[]> = {};
      (labelsRes.data ?? []).forEach(cl => {
        const label = cl.labels as unknown as { id: string; name: string | null; color: string };
        if (!label) return;
        if (!cardLabels[cl.card_id]) cardLabels[cl.card_id] = [];
        cardLabels[cl.card_id].push(label);
      });

      const cardAssignees: Record<string, { id: string; full_name: string | null; avatar_url: string | null; email: string }[]> = {};
      (assignmentsRes.data ?? []).forEach(ca => {
        const profile = ca.profiles as unknown as { id: string; full_name: string | null; avatar_url: string | null; email: string };
        if (!profile) return;
        if (!cardAssignees[ca.card_id]) cardAssignees[ca.card_id] = [];
        cardAssignees[ca.card_id].push(profile);
      });

      const commentCounts: Record<string, number> = {};
      (commentsRes.data ?? []).forEach(c => {
        commentCounts[c.card_id] = (commentCounts[c.card_id] || 0) + 1;
      });

      const attachmentCounts: Record<string, number> = {};
      (attachmentsRes.data ?? []).forEach(a => {
        attachmentCounts[a.card_id] = (attachmentCounts[a.card_id] || 0) + 1;
      });

      const timeData: Record<string, { total: number; active: boolean }> = {};
      (timeRes.data ?? []).forEach(t => {
        if (!timeData[t.card_id]) timeData[t.card_id] = { total: 0, active: false };
        timeData[t.card_id].total += t.duration_seconds || 0;
        if (!t.ended_at) timeData[t.card_id].active = true;
      });

      return rawCards.map(c => ({
        id: c.id,
        title: c.title,
        description: c.description as string | null,
        description_text: c.description_text,
        list_id: c.list_id,
        board_id: c.board_id,
        position: c.position,
        priority: c.priority ?? 'NONE',
        due_date: c.due_date,
        start_date: c.start_date,
        story_points: c.story_points,
        estimated_hours: c.estimated_hours,
        is_completed: c.is_completed,
        is_archived: c.is_archived,
        created_by: c.created_by,
        created_at: c.created_at,
        updated_at: c.updated_at,
        sprint_id: c.sprint_id,
        labels: cardLabels[c.id] || [],
        assignees: cardAssignees[c.id] || [],
        comment_count: commentCounts[c.id] || 0,
        attachment_count: attachmentCounts[c.id] || 0,
        active_time_entry: timeData[c.id]?.active || false,
        total_time_seconds: timeData[c.id]?.total || 0,
      }));
    },
    enabled: !!boardId && !!user,
  });

  return {
    lists: listsQuery.data ?? [],
    cards: cardsQuery.data ?? [],
    labels: labelsQuery.data ?? [],
    members: membersQuery.data ?? [],
    isLoading: listsQuery.isLoading || cardsQuery.isLoading,
    refetch: () => {
      listsQuery.refetch();
      cardsQuery.refetch();
      labelsQuery.refetch();
      membersQuery.refetch();
    },
  };
}

// Mutations
export function useMoveCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ cardId, listId, position }: { cardId: string; listId: string; position: number }) => {
      const { error } = await supabase.from('cards').update({ list_id: listId, position }).eq('id', cardId);
      if (error) throw error;
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['cards'] }),
  });
}

export function useAddCard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ listId, boardId, title, position }: { listId: string; boardId: string; title: string; position: number }) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase.from('cards').insert({
        list_id: listId,
        board_id: boardId,
        title,
        position,
        created_by: user.id,
      });
      if (error) throw error;
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['cards'] }),
  });
}

export function useUpdateCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ cardId, updates }: { cardId: string; updates: Record<string, unknown> }) => {
      const { error } = await supabase.from('cards').update(updates).eq('id', cardId);
      if (error) throw error;
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['cards'] }),
  });
}

export function useCardDetail(cardId: string | null) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['card_detail', cardId],
    queryFn: async () => {
      if (!cardId) return null;

      const [cardRes, commentsRes, attachmentsRes, depsRes] = await Promise.all([
        supabase.from('cards').select('*').eq('id', cardId).single(),
        supabase.from('comments').select('*, profiles:author_id(id, full_name, avatar_url)').eq('card_id', cardId).order('created_at'),
        supabase.from('attachments').select('*').eq('card_id', cardId),
        supabase.from('card_dependencies').select('*, blocking:blocking_card_id(id, title), blocked:blocked_card_id(id, title)').or(`blocking_card_id.eq.${cardId},blocked_card_id.eq.${cardId}`),
      ]);

      if (cardRes.error) throw cardRes.error;

      return {
        card: cardRes.data,
        comments: (commentsRes.data ?? []).map(c => ({
          id: c.id,
          content: c.content_text || (typeof c.content === 'string' ? c.content : ''),
          created_at: c.created_at,
          is_edited: c.is_edited,
          parent_id: c.parent_id,
          reactions: c.reactions as Record<string, string[]> | null,
          author: c.profiles as unknown as { id: string; full_name: string | null; avatar_url: string | null },
        })),
        attachments: attachmentsRes.data ?? [],
        dependencies: (depsRes.data ?? []).map(d => ({
          id: d.id,
          type: d.type,
          blocking_card: d.blocking as unknown as { id: string; title: string },
          blocked_card: d.blocked as unknown as { id: string; title: string },
          is_blocking: d.blocking_card_id === cardId,
        })),
      };
    },
    enabled: !!cardId && !!user,
  });
}

export function useNotifications() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(20);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase.from('notifications').update({ is_read: true }).eq('id', notificationId);
      if (error) throw error;
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });
}

export function useSprints(boardId: string | undefined) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['sprints', boardId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sprints')
        .select('*')
        .eq('board_id', boardId!)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!boardId && !!user,
  });
}
