import { useStore } from "@/store";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Search, Kanban, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBoards } from "@/hooks/useBoards";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function SearchModal() {
  const { searchOpen, setSearchOpen, searchQuery, setSearchQuery } = useStore();
  const navigate = useNavigate();
  const { data: boards = [] } = useBoards();
  const { user } = useAuth();

  const { data: searchCards = [] } = useQuery({
    queryKey: ['search_cards', searchQuery],
    queryFn: async () => {
      if (!searchQuery || searchQuery.length < 2) return [];
      const { data, error } = await supabase
        .from('cards')
        .select('id, title, board_id')
        .ilike('title', `%${searchQuery}%`)
        .eq('is_archived', false)
        .limit(5);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user && searchQuery.length >= 2,
  });

  const filteredBoards = boards.filter(b => b.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
      <DialogContent className="sm:max-w-lg p-0 gap-0">
        <div className="flex items-center gap-2 px-4 border-b">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            className="flex-1 py-3 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
            placeholder="Search boards, cards..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {searchQuery && (
            <>
              {filteredBoards.length > 0 && (
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-2 py-1.5">Boards</p>
                  {filteredBoards.map(b => (
                    <button
                      key={b.id}
                      className="w-full flex items-center gap-2 px-2 py-2 rounded-md hover:bg-accent text-left text-sm"
                      onClick={() => { navigate(`/app/board/${b.id}`); setSearchOpen(false); setSearchQuery(''); }}
                    >
                      <Kanban className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">{b.title}</span>
                    </button>
                  ))}
                </div>
              )}
              {searchCards.length > 0 && (
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-2 py-1.5 mt-2">Cards</p>
                  {searchCards.map(c => (
                    <button
                      key={c.id}
                      className="w-full flex items-center gap-2 px-2 py-2 rounded-md hover:bg-accent text-left text-sm"
                      onClick={() => { navigate(`/app/board/${c.board_id}`); setSearchOpen(false); setSearchQuery(''); }}
                    >
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">{c.title}</span>
                    </button>
                  ))}
                </div>
              )}
              {filteredBoards.length === 0 && searchCards.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">No results found</p>
              )}
            </>
          )}
          {!searchQuery && (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">Start typing to search...</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
