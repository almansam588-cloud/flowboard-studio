CREATE OR REPLACE FUNCTION public.is_workspace_owner(_workspace_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.workspaces
    WHERE id = _workspace_id
      AND owner_id = _user_id
  );
$$;

CREATE OR REPLACE FUNCTION public.is_board_creator(_board_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.boards
    WHERE id = _board_id
      AND created_by = _user_id
  );
$$;

DROP POLICY IF EXISTS "Admins can manage workspace members" ON public.workspace_members;
CREATE POLICY "Workspace members can add members"
ON public.workspace_members
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_workspace_member(workspace_id, auth.uid())
  OR (
    public.is_workspace_owner(workspace_id, auth.uid())
    AND user_id = auth.uid()
    AND role = 'OWNER'
  )
);

DROP POLICY IF EXISTS "Board members can manage members" ON public.board_members;
CREATE POLICY "Board members can add members"
ON public.board_members
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_board_member(board_id, auth.uid())
  OR (
    public.is_board_creator(board_id, auth.uid())
    AND user_id = auth.uid()
    AND role = 'ADMIN'
  )
);