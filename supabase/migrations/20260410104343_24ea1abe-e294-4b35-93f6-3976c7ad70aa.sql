
-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm";

-- Enums
create type workspace_plan as enum ('FREE', 'PRO', 'BUSINESS', 'ENTERPRISE');
create type workspace_member_role as enum ('OWNER', 'ADMIN', 'MEMBER', 'GUEST', 'CLIENT');
create type board_visibility as enum ('WORKSPACE', 'PRIVATE', 'PUBLIC');
create type background_type as enum ('COLOR', 'IMAGE', 'GRADIENT');
create type board_member_role as enum ('ADMIN', 'MEMBER', 'OBSERVER');
create type card_priority as enum ('NONE', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
create type dependency_type as enum ('FINISH_TO_START', 'START_TO_START', 'FINISH_TO_FINISH', 'START_TO_FINISH');
create type custom_field_type as enum ('TEXT', 'NUMBER', 'DATE', 'DROPDOWN', 'CHECKBOX', 'URL', 'MEMBER', 'RATING');
create type notification_type as enum ('CARD_ASSIGNED', 'CARD_DUE_SOON', 'CARD_OVERDUE', 'COMMENT_ADDED', 'MENTION', 'BOARD_INVITATION', 'CHECKLIST_COMPLETED', 'DEPENDENCY_UNBLOCKED', 'AUTOMATION_TRIGGERED', 'WEEKLY_DIGEST', 'SPRINT_STARTED', 'SPRINT_COMPLETED', 'MEMBER_ADDED');
create type sprint_status as enum ('PLANNED', 'ACTIVE', 'COMPLETED');
create type automation_trigger_type as enum ('CARD_CREATED', 'CARD_MOVED_TO_LIST', 'CARD_MOVED_FROM_LIST', 'CARD_DUE_DATE_SET', 'CARD_DUE_DATE_PASSES', 'CARD_DUE_IN_N_DAYS', 'CHECKLIST_COMPLETED', 'LABEL_ADDED', 'LABEL_REMOVED', 'MEMBER_ASSIGNED', 'MEMBER_REMOVED', 'COMMENT_ADDED', 'CUSTOM_FIELD_CHANGED', 'CARD_ARCHIVED', 'SCHEDULE_DAILY', 'SCHEDULE_WEEKLY', 'DEPENDENCY_RESOLVED');
create type cover_type as enum ('NONE', 'COLOR', 'IMAGE');

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- PROFILES
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  avatar_url text,
  timezone text default 'UTC',
  notification_preferences jsonb default '{"card_assigned":{"in_app":true,"email":true},"card_due_soon":{"in_app":true,"email":true},"comment_added":{"in_app":true,"email":false},"mention":{"in_app":true,"email":true}}'::jsonb,
  onboarding_completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger to auto-create profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- WORKSPACES
create table workspaces (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text,
  logo_url text,
  owner_id uuid not null references profiles(id) on delete restrict,
  plan workspace_plan default 'FREE',
  settings jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON workspaces FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- WORKSPACE_MEMBERS
create table workspace_members (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  role workspace_member_role default 'MEMBER',
  joined_at timestamptz default now(),
  unique(workspace_id, user_id)
);
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;

-- Helper function: check workspace membership
CREATE OR REPLACE FUNCTION public.is_workspace_member(_workspace_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM workspace_members WHERE workspace_id = _workspace_id AND user_id = _user_id);
$$;

-- Workspace RLS
CREATE POLICY "Workspace members can view workspace" ON workspaces FOR SELECT USING (public.is_workspace_member(id, auth.uid()));
CREATE POLICY "Owners can update workspace" ON workspaces FOR UPDATE USING (owner_id = auth.uid());
CREATE POLICY "Authenticated users can create workspace" ON workspaces FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners can delete workspace" ON workspaces FOR DELETE USING (owner_id = auth.uid());

-- Workspace members RLS
CREATE POLICY "Members can view workspace members" ON workspace_members FOR SELECT USING (public.is_workspace_member(workspace_id, auth.uid()));
CREATE POLICY "Admins can manage workspace members" ON workspace_members FOR INSERT WITH CHECK (public.is_workspace_member(workspace_id, auth.uid()));
CREATE POLICY "Admins can update workspace members" ON workspace_members FOR UPDATE USING (public.is_workspace_member(workspace_id, auth.uid()));
CREATE POLICY "Admins can delete workspace members" ON workspace_members FOR DELETE USING (public.is_workspace_member(workspace_id, auth.uid()));

-- WORKSPACE_INVITATIONS
create table workspace_invitations (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  email text not null,
  role workspace_member_role default 'MEMBER',
  token text unique not null default encode(gen_random_bytes(32), 'hex'),
  invited_by uuid not null references profiles(id),
  expires_at timestamptz default now() + interval '7 days',
  accepted_at timestamptz,
  created_at timestamptz default now()
);
ALTER TABLE workspace_invitations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Workspace members can view invitations" ON workspace_invitations FOR SELECT USING (public.is_workspace_member(workspace_id, auth.uid()));
CREATE POLICY "Workspace members can create invitations" ON workspace_invitations FOR INSERT WITH CHECK (public.is_workspace_member(workspace_id, auth.uid()));

-- BOARDS
create table boards (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  created_by uuid not null references profiles(id),
  title text not null,
  description text,
  background_type background_type default 'COLOR',
  background_value text default '#0052CC',
  visibility board_visibility default 'WORKSPACE',
  is_archived boolean default false,
  settings jsonb default '{"card_covers":true,"voting":false,"aging":false,"calendar_feed":false}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_boards_updated_at BEFORE UPDATE ON boards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- BOARD_MEMBERS
create table board_members (
  id uuid primary key default uuid_generate_v4(),
  board_id uuid not null references boards(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  role board_member_role default 'MEMBER',
  unique(board_id, user_id)
);
ALTER TABLE board_members ENABLE ROW LEVEL SECURITY;

-- Helper: check board membership
CREATE OR REPLACE FUNCTION public.is_board_member(_board_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM board_members WHERE board_id = _board_id AND user_id = _user_id);
$$;

-- Board RLS
CREATE POLICY "Board members can view boards" ON boards FOR SELECT USING (
  public.is_board_member(id, auth.uid()) OR
  (visibility = 'WORKSPACE' AND public.is_workspace_member(workspace_id, auth.uid())) OR
  visibility = 'PUBLIC'
);
CREATE POLICY "Workspace members can create boards" ON boards FOR INSERT WITH CHECK (public.is_workspace_member(workspace_id, auth.uid()));
CREATE POLICY "Board admins can update boards" ON boards FOR UPDATE USING (public.is_board_member(id, auth.uid()));
CREATE POLICY "Board admins can delete boards" ON boards FOR DELETE USING (created_by = auth.uid());

-- Board members RLS
CREATE POLICY "Board members can view board members" ON board_members FOR SELECT USING (public.is_board_member(board_id, auth.uid()));
CREATE POLICY "Board members can manage members" ON board_members FOR INSERT WITH CHECK (public.is_board_member(board_id, auth.uid()));
CREATE POLICY "Board members can update members" ON board_members FOR UPDATE USING (public.is_board_member(board_id, auth.uid()));
CREATE POLICY "Board members can remove members" ON board_members FOR DELETE USING (public.is_board_member(board_id, auth.uid()));

-- BOARD_STARS
create table board_stars (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  board_id uuid not null references boards(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, board_id)
);
ALTER TABLE board_stars ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own stars" ON board_stars FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can star boards" ON board_stars FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unstar boards" ON board_stars FOR DELETE USING (auth.uid() = user_id);

-- LABELS
create table labels (
  id uuid primary key default uuid_generate_v4(),
  board_id uuid not null references boards(id) on delete cascade,
  name text,
  color text not null default '#61BD4F'
);
ALTER TABLE labels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Board members can view labels" ON labels FOR SELECT USING (public.is_board_member(board_id, auth.uid()));
CREATE POLICY "Board members can manage labels" ON labels FOR ALL USING (public.is_board_member(board_id, auth.uid()));

-- LISTS
create table lists (
  id uuid primary key default uuid_generate_v4(),
  board_id uuid not null references boards(id) on delete cascade,
  title text not null,
  position float8 not null default 0,
  color text,
  is_archived boolean default false,
  wip_limit int,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
ALTER TABLE lists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Board members can view lists" ON lists FOR SELECT USING (public.is_board_member(board_id, auth.uid()));
CREATE POLICY "Board members can manage lists" ON lists FOR ALL USING (public.is_board_member(board_id, auth.uid()));
CREATE TRIGGER update_lists_updated_at BEFORE UPDATE ON lists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- CARDS
create table cards (
  id uuid primary key default uuid_generate_v4(),
  list_id uuid not null references lists(id) on delete cascade,
  board_id uuid not null references boards(id) on delete cascade,
  created_by uuid not null references profiles(id),
  title text not null,
  description jsonb,
  description_text text,
  position float8 not null default 0,
  due_date timestamptz,
  start_date timestamptz,
  due_date_reminder text default 'NONE',
  is_completed boolean default false,
  is_archived boolean default false,
  cover_type cover_type default 'NONE',
  cover_value text,
  priority card_priority default 'NONE',
  estimated_hours float4,
  story_points int,
  parent_card_id uuid references cards(id) on delete set null,
  sprint_id uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Board members can view cards" ON cards FOR SELECT USING (public.is_board_member(board_id, auth.uid()));
CREATE POLICY "Board members can manage cards" ON cards FOR ALL USING (public.is_board_member(board_id, auth.uid()));
CREATE TRIGGER update_cards_updated_at BEFORE UPDATE ON cards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- CARD_ASSIGNMENTS
create table card_assignments (
  id uuid primary key default uuid_generate_v4(),
  card_id uuid not null references cards(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  assigned_at timestamptz default now(),
  assigned_by uuid references profiles(id),
  unique(card_id, user_id)
);
ALTER TABLE card_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Board members can view assignments" ON card_assignments FOR SELECT USING (
  EXISTS (SELECT 1 FROM cards c WHERE c.id = card_id AND public.is_board_member(c.board_id, auth.uid()))
);
CREATE POLICY "Board members can manage assignments" ON card_assignments FOR ALL USING (
  EXISTS (SELECT 1 FROM cards c WHERE c.id = card_id AND public.is_board_member(c.board_id, auth.uid()))
);

-- CARD_LABELS
create table card_labels (
  card_id uuid not null references cards(id) on delete cascade,
  label_id uuid not null references labels(id) on delete cascade,
  primary key (card_id, label_id)
);
ALTER TABLE card_labels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Board members can view card labels" ON card_labels FOR SELECT USING (
  EXISTS (SELECT 1 FROM cards c WHERE c.id = card_id AND public.is_board_member(c.board_id, auth.uid()))
);
CREATE POLICY "Board members can manage card labels" ON card_labels FOR ALL USING (
  EXISTS (SELECT 1 FROM cards c WHERE c.id = card_id AND public.is_board_member(c.board_id, auth.uid()))
);

-- CARD_WATCHERS
create table card_watchers (
  card_id uuid not null references cards(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  primary key (card_id, user_id)
);
ALTER TABLE card_watchers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Board members can view watchers" ON card_watchers FOR SELECT USING (
  EXISTS (SELECT 1 FROM cards c WHERE c.id = card_id AND public.is_board_member(c.board_id, auth.uid()))
);
CREATE POLICY "Users can manage own watch" ON card_watchers FOR ALL USING (auth.uid() = user_id);

-- CARD_DEPENDENCIES
create table card_dependencies (
  id uuid primary key default uuid_generate_v4(),
  blocking_card_id uuid not null references cards(id) on delete cascade,
  blocked_card_id uuid not null references cards(id) on delete cascade,
  type dependency_type default 'FINISH_TO_START',
  created_at timestamptz default now(),
  created_by uuid references profiles(id),
  unique(blocking_card_id, blocked_card_id),
  check(blocking_card_id != blocked_card_id)
);
ALTER TABLE card_dependencies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Board members can view dependencies" ON card_dependencies FOR SELECT USING (
  EXISTS (SELECT 1 FROM cards c WHERE c.id = blocking_card_id AND public.is_board_member(c.board_id, auth.uid()))
);
CREATE POLICY "Board members can manage dependencies" ON card_dependencies FOR ALL USING (
  EXISTS (SELECT 1 FROM cards c WHERE c.id = blocking_card_id AND public.is_board_member(c.board_id, auth.uid()))
);

-- CHECKLISTS
create table checklists (
  id uuid primary key default uuid_generate_v4(),
  card_id uuid not null references cards(id) on delete cascade,
  title text not null default 'Checklist',
  position float8 default 0,
  created_at timestamptz default now()
);
ALTER TABLE checklists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Board members can view checklists" ON checklists FOR SELECT USING (
  EXISTS (SELECT 1 FROM cards c WHERE c.id = card_id AND public.is_board_member(c.board_id, auth.uid()))
);
CREATE POLICY "Board members can manage checklists" ON checklists FOR ALL USING (
  EXISTS (SELECT 1 FROM cards c WHERE c.id = card_id AND public.is_board_member(c.board_id, auth.uid()))
);

-- CHECKLIST_ITEMS
create table checklist_items (
  id uuid primary key default uuid_generate_v4(),
  checklist_id uuid not null references checklists(id) on delete cascade,
  title text not null,
  position float8 default 0,
  is_completed boolean default false,
  due_date timestamptz,
  assignee_id uuid references profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Board members can view checklist items" ON checklist_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM checklists cl JOIN cards c ON c.id = cl.card_id WHERE cl.id = checklist_id AND public.is_board_member(c.board_id, auth.uid()))
);
CREATE POLICY "Board members can manage checklist items" ON checklist_items FOR ALL USING (
  EXISTS (SELECT 1 FROM checklists cl JOIN cards c ON c.id = cl.card_id WHERE cl.id = checklist_id AND public.is_board_member(c.board_id, auth.uid()))
);
CREATE TRIGGER update_checklist_items_updated_at BEFORE UPDATE ON checklist_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ATTACHMENTS
create table attachments (
  id uuid primary key default uuid_generate_v4(),
  card_id uuid not null references cards(id) on delete cascade,
  uploaded_by uuid not null references profiles(id),
  name text not null,
  url text not null,
  storage_path text,
  mime_type text,
  size_bytes bigint,
  is_cover boolean default false,
  created_at timestamptz default now()
);
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Board members can view attachments" ON attachments FOR SELECT USING (
  EXISTS (SELECT 1 FROM cards c WHERE c.id = card_id AND public.is_board_member(c.board_id, auth.uid()))
);
CREATE POLICY "Board members can manage attachments" ON attachments FOR ALL USING (
  EXISTS (SELECT 1 FROM cards c WHERE c.id = card_id AND public.is_board_member(c.board_id, auth.uid()))
);

-- COMMENTS
create table comments (
  id uuid primary key default uuid_generate_v4(),
  card_id uuid not null references cards(id) on delete cascade,
  author_id uuid not null references profiles(id) on delete cascade,
  content jsonb not null,
  content_text text,
  is_edited boolean default false,
  parent_id uuid references comments(id) on delete cascade,
  reactions jsonb default '{}'::jsonb,
  client_visible boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Board members can view comments" ON comments FOR SELECT USING (
  EXISTS (SELECT 1 FROM cards c WHERE c.id = card_id AND public.is_board_member(c.board_id, auth.uid()))
);
CREATE POLICY "Board members can create comments" ON comments FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM cards c WHERE c.id = card_id AND public.is_board_member(c.board_id, auth.uid()))
);
CREATE POLICY "Authors can update own comments" ON comments FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Authors can delete own comments" ON comments FOR DELETE USING (auth.uid() = author_id);
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- CUSTOM_FIELDS
create table custom_fields (
  id uuid primary key default uuid_generate_v4(),
  board_id uuid not null references boards(id) on delete cascade,
  name text not null,
  type custom_field_type not null,
  options jsonb,
  position float8 default 0,
  created_at timestamptz default now()
);
ALTER TABLE custom_fields ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Board members can view custom fields" ON custom_fields FOR SELECT USING (public.is_board_member(board_id, auth.uid()));
CREATE POLICY "Board members can manage custom fields" ON custom_fields FOR ALL USING (public.is_board_member(board_id, auth.uid()));

-- CUSTOM_FIELD_VALUES
create table custom_field_values (
  id uuid primary key default uuid_generate_v4(),
  card_id uuid not null references cards(id) on delete cascade,
  custom_field_id uuid not null references custom_fields(id) on delete cascade,
  text_value text,
  number_value float8,
  date_value timestamptz,
  bool_value boolean,
  unique(card_id, custom_field_id)
);
ALTER TABLE custom_field_values ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Board members can view field values" ON custom_field_values FOR SELECT USING (
  EXISTS (SELECT 1 FROM cards c WHERE c.id = card_id AND public.is_board_member(c.board_id, auth.uid()))
);
CREATE POLICY "Board members can manage field values" ON custom_field_values FOR ALL USING (
  EXISTS (SELECT 1 FROM cards c WHERE c.id = card_id AND public.is_board_member(c.board_id, auth.uid()))
);

-- TIME_ENTRIES
create table time_entries (
  id uuid primary key default uuid_generate_v4(),
  card_id uuid not null references cards(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  duration_seconds int,
  description text,
  is_billable boolean default false,
  created_at timestamptz default now()
);
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Board members can view time entries" ON time_entries FOR SELECT USING (
  EXISTS (SELECT 1 FROM cards c WHERE c.id = card_id AND public.is_board_member(c.board_id, auth.uid()))
);
CREATE POLICY "Users can manage own time entries" ON time_entries FOR ALL USING (auth.uid() = user_id);

-- SPRINTS
create table sprints (
  id uuid primary key default uuid_generate_v4(),
  board_id uuid not null references boards(id) on delete cascade,
  name text not null,
  goal text,
  start_date date,
  end_date date,
  status sprint_status default 'PLANNED',
  created_at timestamptz default now()
);
ALTER TABLE sprints ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Board members can view sprints" ON sprints FOR SELECT USING (public.is_board_member(board_id, auth.uid()));
CREATE POLICY "Board members can manage sprints" ON sprints FOR ALL USING (public.is_board_member(board_id, auth.uid()));

-- Add sprint FK to cards
ALTER TABLE cards ADD CONSTRAINT fk_sprint FOREIGN KEY (sprint_id) REFERENCES sprints(id) ON DELETE SET NULL;

-- AUTOMATIONS
create table automations (
  id uuid primary key default uuid_generate_v4(),
  board_id uuid not null references boards(id) on delete cascade,
  created_by uuid not null references profiles(id),
  name text not null,
  is_enabled boolean default true,
  trigger_type automation_trigger_type not null,
  trigger_config jsonb default '{}'::jsonb,
  conditions jsonb default '[]'::jsonb,
  actions jsonb default '[]'::jsonb,
  run_count int default 0,
  last_run_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
ALTER TABLE automations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Board members can view automations" ON automations FOR SELECT USING (public.is_board_member(board_id, auth.uid()));
CREATE POLICY "Board members can manage automations" ON automations FOR ALL USING (public.is_board_member(board_id, auth.uid()));
CREATE TRIGGER update_automations_updated_at BEFORE UPDATE ON automations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- AUTOMATION_LOGS
create table automation_logs (
  id uuid primary key default uuid_generate_v4(),
  automation_id uuid not null references automations(id) on delete cascade,
  card_id uuid references cards(id) on delete set null,
  triggered_at timestamptz default now(),
  success boolean not null,
  actions_taken jsonb,
  error_message text
);
ALTER TABLE automation_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Board members can view automation logs" ON automation_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM automations a WHERE a.id = automation_id AND public.is_board_member(a.board_id, auth.uid()))
);

-- NOTIFICATIONS
create table notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  type notification_type not null,
  title text not null,
  body text,
  entity_type text,
  entity_id uuid,
  action_url text,
  is_read boolean default false,
  created_at timestamptz default now()
);
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- ACTIVITY_LOGS
create table activity_logs (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid references workspaces(id) on delete cascade,
  board_id uuid references boards(id) on delete cascade,
  card_id uuid references cards(id) on delete cascade,
  user_id uuid references profiles(id) on delete set null,
  action text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Board members can view activity logs" ON activity_logs FOR SELECT USING (
  (board_id IS NOT NULL AND public.is_board_member(board_id, auth.uid())) OR
  (workspace_id IS NOT NULL AND public.is_workspace_member(workspace_id, auth.uid()))
);

-- TEMPLATES
create table templates (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid references workspaces(id) on delete cascade,
  created_by uuid not null references profiles(id),
  name text not null,
  description text,
  category text,
  structure jsonb not null,
  is_public boolean default false,
  usage_count int default 0,
  created_at timestamptz default now()
);
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view public templates" ON templates FOR SELECT USING (is_public = true OR public.is_workspace_member(workspace_id, auth.uid()));
CREATE POLICY "Workspace members can manage templates" ON templates FOR ALL USING (public.is_workspace_member(workspace_id, auth.uid()));

-- CLIENT_PORTALS
create table client_portals (
  id uuid primary key default uuid_generate_v4(),
  board_id uuid unique not null references boards(id) on delete cascade,
  slug text unique not null,
  password_hash text,
  allow_comments boolean default false,
  allow_attachments boolean default false,
  custom_branding jsonb default '{}'::jsonb,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
ALTER TABLE client_portals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Board members can view client portals" ON client_portals FOR SELECT USING (public.is_board_member(board_id, auth.uid()));
CREATE POLICY "Board members can manage client portals" ON client_portals FOR ALL USING (public.is_board_member(board_id, auth.uid()));
CREATE TRIGGER update_client_portals_updated_at BEFORE UPDATE ON client_portals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- INDEXES
create index idx_cards_list_id on cards(list_id);
create index idx_cards_board_id on cards(board_id);
create index idx_cards_sprint_id on cards(sprint_id) where sprint_id is not null;
create index idx_cards_due_date on cards(due_date) where due_date is not null;
create index idx_cards_is_archived on cards(is_archived);
create index idx_cards_position on cards(list_id, position);
create index idx_cards_parent on cards(parent_card_id) where parent_card_id is not null;
create index idx_cards_fts on cards using gin(to_tsvector('english', title || ' ' || coalesce(description_text, '')));
create index idx_lists_board_id on lists(board_id);
create index idx_lists_position on lists(board_id, position);
create index idx_comments_card_id on comments(card_id);
create index idx_comments_parent_id on comments(parent_id) where parent_id is not null;
create index idx_activity_board on activity_logs(board_id, created_at desc);
create index idx_activity_card on activity_logs(card_id, created_at desc);
create index idx_activity_ws on activity_logs(workspace_id, created_at desc);
create index idx_notifications_user on notifications(user_id, created_at desc);
create index idx_notifications_unread on notifications(user_id, is_read) where is_read = false;
create index idx_time_entries_card on time_entries(card_id);
create index idx_time_entries_user on time_entries(user_id);
create index idx_board_members_user on board_members(user_id);
create index idx_board_members_board on board_members(board_id);
create index idx_workspace_members_user on workspace_members(user_id);
create index idx_workspace_members_ws on workspace_members(workspace_id);
create index idx_deps_blocking on card_dependencies(blocking_card_id);
create index idx_deps_blocked on card_dependencies(blocked_card_id);
create index idx_automation_logs_automation on automation_logs(automation_id, triggered_at desc);
