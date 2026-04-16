import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function CreateBoardModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title.trim() || !user) return;
    setLoading(true);

    try {
      // Get first workspace for user
      const { data: memberships } = await supabase
        .from('workspace_members')
        .select('workspace_id')
        .eq('user_id', user.id)
        .limit(1);

      if (!memberships || memberships.length === 0) {
        toast.error("No workspace found. Please complete onboarding first.");
        setLoading(false);
        return;
      }

      const workspaceId = memberships[0].workspace_id;

      const { data: board, error } = await supabase
        .from('boards')
        .insert({
          title: title.trim(),
          description: description.trim() || null,
          workspace_id: workspaceId,
          created_by: user.id,
        })
        .select()
        .single();
      if (error) throw error;

      // Add creator as board member
      await supabase.from('board_members').insert({
        board_id: board.id,
        user_id: user.id,
        role: 'ADMIN',
      });

      // Create default lists
      const defaultLists = ['To Do', 'In Progress', 'Done'];
      for (let i = 0; i < defaultLists.length; i++) {
        await supabase.from('lists').insert({
          board_id: board.id,
          title: defaultLists[i],
          position: i,
        });
      }

      // Create default labels
      const defaultLabels = [
        { name: 'Bug', color: '#EF4444' },
        { name: 'Feature', color: '#3B82F6' },
        { name: 'Enhancement', color: '#8B5CF6' },
      ];
      for (const label of defaultLabels) {
        await supabase.from('labels').insert({ board_id: board.id, ...label });
      }

      queryClient.invalidateQueries({ queryKey: ['boards'] });
      toast.success("Board created!");
      setTitle("");
      setDescription("");
      onClose();
      navigate(`/app/board/${board.id}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to create board");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <h2 className="text-lg font-semibold text-foreground mb-4">Create Board</h2>
        <div className="space-y-4">
          <div>
            <Label className="text-sm">Board name</Label>
            <Input placeholder="e.g. Product Launch Q3" value={title} onChange={e => setTitle(e.target.value)} className="mt-1.5" autoFocus />
          </div>
          <div>
            <Label className="text-sm">Description (optional)</Label>
            <Textarea placeholder="What's this board for?" value={description} onChange={e => setDescription(e.target.value)} className="mt-1.5" rows={3} />
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button onClick={handleCreate} disabled={loading || !title.trim()}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Create Board
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
