import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface BoardWithStar {
  id: string;
  title: string;
  description: string | null;
  workspace_id: string;
  created_by: string;
  background_type: string | null;
  background_value: string | null;
  visibility: string | null;
  is_archived: boolean | null;
  settings: unknown;
  created_at: string | null;
  updated_at: string | null;
  starred: boolean;
  member_count: number;
}

export function useBoards() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['boards', user?.id],
    queryFn: async (): Promise<BoardWithStar[]> => {
      if (!user) return [];

      const [boardsRes, starsRes, membersRes] = await Promise.all([
        supabase.from('boards').select('*').eq('is_archived', false),
        supabase.from('board_stars').select('board_id').eq('user_id', user.id),
        supabase.from('board_members').select('board_id'),
      ]);

      if (boardsRes.error) throw boardsRes.error;

      const starredIds = new Set((starsRes.data ?? []).map(s => s.board_id));

      // Count members per board
      const memberCounts: Record<string, number> = {};
      (membersRes.data ?? []).forEach(m => {
        memberCounts[m.board_id] = (memberCounts[m.board_id] || 0) + 1;
      });

      return (boardsRes.data ?? []).map(b => ({
        ...b,
        starred: starredIds.has(b.id),
        member_count: memberCounts[b.id] || 0,
      }));
    },
    enabled: !!user,
  });
}

export function useToggleStar() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ boardId, starred }: { boardId: string; starred: boolean }) => {
      if (!user) throw new Error('Not authenticated');
      if (starred) {
        const { error } = await supabase.from('board_stars').delete().eq('board_id', boardId).eq('user_id', user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('board_stars').insert({ board_id: boardId, user_id: user.id });
        if (error) throw error;
      }
    },
    onMutate: async ({ boardId, starred }) => {
      await queryClient.cancelQueries({ queryKey: ['boards'] });
      const prev = queryClient.getQueryData(['boards', user?.id]);
      queryClient.setQueryData(['boards', user?.id], (old: BoardWithStar[] | undefined) =>
        (old ?? []).map(b => b.id === boardId ? { ...b, starred: !starred } : b)
      );
      return { prev };
    },
    onError: (_err, _vars, context) => {
      if (context?.prev) queryClient.setQueryData(['boards', user?.id], context.prev);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['boards'] }),
  });
}
