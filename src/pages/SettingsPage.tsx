import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, Building, CreditCard, Palette, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DarkModeToggle } from "@/components/app/DarkModeToggle";

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'workspace', label: 'Workspace', icon: Building },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'theme', label: 'Appearance', icon: Palette },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Profile data
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', user!.id).single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const [fullName, setFullName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setProfileEmail(profile.email || "");
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from('profiles').update({
      full_name: fullName.trim(),
    }).eq('id', user.id);
    setSaving(false);
    if (error) {
      toast.error("Failed to save profile");
      return;
    }
    toast.success("Profile updated");
    queryClient.invalidateQueries({ queryKey: ['profile'] });
  };

  // Workspace data
  const { data: workspaceData } = useQuery({
    queryKey: ['workspace_settings', user?.id],
    queryFn: async () => {
      const { data: memberships } = await supabase
        .from('workspace_members')
        .select('workspace_id, role, workspaces(id, name, slug, plan)')
        .eq('user_id', user!.id);

      if (!memberships || memberships.length === 0) return null;

      const ws = memberships[0].workspaces as unknown as { id: string; name: string; slug: string; plan: string };
      
      const { data: members } = await supabase
        .from('workspace_members')
        .select('role, profiles:user_id(id, full_name, email)')
        .eq('workspace_id', ws.id);

      return {
        workspace: ws,
        members: (members ?? []).map(m => {
          const p = m.profiles as unknown as { id: string; full_name: string | null; email: string };
          return { ...p, role: m.role };
        }),
      };
    },
    enabled: !!user,
  });

  const [wsName, setWsName] = useState("");
  useEffect(() => {
    if (workspaceData?.workspace) setWsName(workspaceData.workspace.name);
  }, [workspaceData]);

  const handleSaveWorkspace = async () => {
    if (!workspaceData?.workspace) return;
    setSaving(true);
    const { error } = await supabase.from('workspaces').update({ name: wsName.trim() }).eq('id', workspaceData.workspace.id);
    setSaving(false);
    if (error) {
      toast.error("Failed to update workspace");
      return;
    }
    toast.success("Workspace updated");
    queryClient.invalidateQueries({ queryKey: ['workspace_settings'] });
  };

  const getInitials = (name: string | null, email?: string) => {
    if (name) return name.split(' ').map(n => n[0]).join('').toUpperCase();
    if (email) return email.substring(0, 2).toUpperCase();
    return '?';
  };

  return (
    <div className="p-6 max-w-3xl mx-auto animate-fade-in">
      <h1 className="text-xl font-bold text-foreground mb-6">Settings</h1>

      <div className="flex gap-6">
        <div className="w-48 flex-shrink-0 space-y-0.5">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${activeTab === tab.id ? 'bg-accent text-foreground font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-sm font-medium text-foreground mb-4">Profile Settings</h2>
              {profileLoading ? (
                <div className="space-y-3">
                  <div className="h-16 bg-muted rounded animate-pulse" />
                  <div className="h-10 bg-muted rounded animate-pulse" />
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-xl font-bold text-primary-foreground">
                      {getInitials(fullName, profileEmail)}
                    </div>
                  </div>
                  <div className="grid gap-4 max-w-sm">
                    <div>
                      <Label className="text-sm">Full name</Label>
                      <Input value={fullName} onChange={e => setFullName(e.target.value)} className="mt-1.5" />
                    </div>
                    <div>
                      <Label className="text-sm">Email</Label>
                      <Input value={profileEmail} disabled className="mt-1.5 opacity-60" />
                    </div>
                    <Button size="sm" className="w-fit" onClick={handleSaveProfile} disabled={saving}>
                      {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Save changes
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'workspace' && (
            <div className="space-y-6">
              <h2 className="text-sm font-medium text-foreground mb-4">Workspace Settings</h2>
              {workspaceData ? (
                <>
                  <div className="grid gap-4 max-w-sm">
                    <div>
                      <Label className="text-sm">Workspace name</Label>
                      <Input value={wsName} onChange={e => setWsName(e.target.value)} className="mt-1.5" />
                    </div>
                    <Button size="sm" className="w-fit" onClick={handleSaveWorkspace} disabled={saving}>
                      {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Update
                    </Button>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-medium text-foreground mb-3">Members</h3>
                    <div className="space-y-2">
                      {workspaceData.members.map(m => (
                        <div key={m.id} className="flex items-center justify-between p-3 rounded-lg border">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium text-muted-foreground">
                              {getInitials(m.full_name, m.email)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{m.full_name || m.email}</p>
                              <p className="text-xs text-muted-foreground">{m.email}</p>
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{m.role}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No workspace found. Complete onboarding to create one.</p>
              )}
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-6">
              <h2 className="text-sm font-medium text-foreground mb-4">Billing</h2>
              <div className="p-4 rounded-xl border bg-card">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{workspaceData?.workspace?.plan || 'Free'} Plan</p>
                    <p className="text-xs text-muted-foreground">
                      {workspaceData?.members?.length || 0} members
                    </p>
                  </div>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'theme' && (
            <div className="space-y-6">
              <h2 className="text-sm font-medium text-foreground mb-4">Appearance</h2>
              <p className="text-sm text-muted-foreground mb-4">Toggle between light and dark modes:</p>
              <DarkModeToggle />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
