import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Kanban, ArrowRight, Users, Layout, Sparkles, Loader2 } from "lucide-react";
import { useNavigate, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const templates = [
  { id: 'blank', name: 'Blank Board', desc: 'Start from scratch', lists: ['To Do', 'In Progress', 'Done'] },
  { id: 'scrum', name: 'Scrum Sprint', desc: 'Backlog → Done workflow', lists: ['Backlog', 'Sprint Backlog', 'In Progress', 'Review', 'Done'] },
  { id: 'marketing', name: 'Marketing', desc: 'Campaign planning', lists: ['Ideas', 'Planning', 'In Progress', 'Published'] },
  { id: 'bugs', name: 'Bug Tracker', desc: 'Track & fix issues', lists: ['Reported', 'Confirmed', 'Fixing', 'Testing', 'Resolved'] },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [step, setStep] = useState(0);
  const [workspace, setWorkspace] = useState("");
  const [invites, setInvites] = useState("");
  const [template, setTemplate] = useState("blank");
  const [loading, setLoading] = useState(false);

  if (authLoading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const handleFinish = async () => {
    if (!workspace.trim()) {
      toast.error("Please enter a workspace name");
      return;
    }
    setLoading(true);

    try {
      const slug = workspace.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

      // Create workspace (don't .select() — RLS SELECT requires membership which doesn't exist yet)
      const wsId = crypto.randomUUID();
      const { error: wsError } = await supabase
        .from('workspaces')
        .insert({ id: wsId, name: workspace.trim(), slug: slug || 'workspace', owner_id: user.id });
      if (wsError) throw wsError;

      // Add self as workspace member (OWNER) — this enables SELECT on the workspace going forward
      const { error: memberError } = await supabase.from('workspace_members').insert({
        workspace_id: wsId,
        user_id: user.id,
        role: 'OWNER',
      });
      if (memberError) throw memberError;

      const ws = { id: wsId };

      // Create board
      const { data: board, error: boardError } = await supabase
        .from('boards')
        .insert({
          title: `${workspace.trim()} Board`,
          workspace_id: ws.id,
          created_by: user.id,
        })
        .select()
        .single();
      if (boardError) throw boardError;

      // Add self as board member (ADMIN)
      await supabase.from('board_members').insert({
        board_id: board.id,
        user_id: user.id,
        role: 'ADMIN',
      });

      // Create lists from template
      const selectedTemplate = templates.find(t => t.id === template) || templates[0];
      for (let i = 0; i < selectedTemplate.lists.length; i++) {
        await supabase.from('lists').insert({
          board_id: board.id,
          title: selectedTemplate.lists[i],
          position: i,
        });
      }

      // Create default labels
      const defaultLabels = [
        { name: 'Bug', color: '#EF4444' },
        { name: 'Feature', color: '#3B82F6' },
        { name: 'Enhancement', color: '#8B5CF6' },
        { name: 'Urgent', color: '#F97316' },
        { name: 'Design', color: '#EC4899' },
        { name: 'Documentation', color: '#10B981' },
      ];
      for (const label of defaultLabels) {
        await supabase.from('labels').insert({ board_id: board.id, ...label });
      }

      // Send invites if any
      if (invites.trim()) {
        const emails = invites.split(',').map(e => e.trim()).filter(Boolean);
        for (const email of emails) {
          await supabase.from('workspace_invitations').insert({
            workspace_id: ws.id,
            email,
            invited_by: user.id,
          });
        }
      }

      // Mark onboarding as completed
      await supabase.from('profiles').update({ onboarding_completed: true }).eq('id', user.id);

      toast.success("Workspace created! 🎉");
      navigate('/app');
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: "Set up your workspace",
      icon: Layout,
      content: (
        <div className="space-y-4">
          <div>
            <Label className="text-sm">Workspace name</Label>
            <Input placeholder="e.g. Acme Inc." value={workspace} onChange={e => setWorkspace(e.target.value)} className="mt-1.5" />
          </div>
        </div>
      ),
    },
    {
      title: "Invite your team",
      icon: Users,
      content: (
        <div className="space-y-4">
          <div>
            <Label className="text-sm">Email addresses (comma separated)</Label>
            <Input placeholder="sarah@acme.com, james@acme.com" value={invites} onChange={e => setInvites(e.target.value)} className="mt-1.5" />
          </div>
          <p className="text-xs text-muted-foreground">You can always invite more people later.</p>
        </div>
      ),
    },
    {
      title: "Choose a template",
      icon: Sparkles,
      content: (
        <div className="grid grid-cols-2 gap-3">
          {templates.map(t => (
            <button
              key={t.id}
              onClick={() => setTemplate(t.id)}
              className={`p-3 rounded-lg border text-left transition-colors ${template === t.id ? 'border-primary bg-primary/5' : 'hover:border-muted-foreground/30'}`}
            >
              <p className="text-sm font-medium text-foreground">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.desc}</p>
            </button>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Kanban className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl text-foreground">Flowboard</span>
        </div>

        <div className="flex items-center gap-2 mb-6 justify-center">
          {steps.map((_, i) => (
            <div key={i} className={`h-1.5 w-12 rounded-full transition-colors ${i <= step ? 'bg-primary' : 'bg-muted'}`} />
          ))}
        </div>

        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            {(() => { const Icon = steps[step].icon; return <Icon className="w-5 h-5 text-primary" />; })()}
            <h1 className="text-lg font-semibold text-foreground">{steps[step].title}</h1>
          </div>
          {steps[step].content}
          <div className="flex gap-3 mt-6">
            {step > 0 && <Button variant="outline" onClick={() => setStep(s => s - 1)} className="flex-1" disabled={loading}>Back</Button>}
            <Button
              onClick={() => step < 2 ? setStep(s => s + 1) : handleFinish()}
              className="flex-1"
              disabled={loading || (step === 0 && !workspace.trim())}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {step < 2 ? 'Continue' : 'Get Started'} <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
