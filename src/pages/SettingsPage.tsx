import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, Building, CreditCard, Palette } from "lucide-react";
import { useState } from "react";

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'workspace', label: 'Workspace', icon: Building },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'theme', label: 'Appearance', icon: Palette },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="p-6 max-w-3xl mx-auto animate-fade-in">
      <h1 className="text-xl font-bold text-foreground mb-6">Settings</h1>

      <div className="flex gap-6">
        {/* Tabs */}
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

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-sm font-medium text-foreground mb-4">Profile Settings</h2>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-xl font-bold text-primary-foreground">AC</div>
                  <Button variant="outline" size="sm">Change photo</Button>
                </div>
                <div className="grid gap-4 max-w-sm">
                  <div>
                    <Label className="text-sm">Full name</Label>
                    <Input defaultValue="Alex Chen" className="mt-1.5" />
                  </div>
                  <div>
                    <Label className="text-sm">Email</Label>
                    <Input defaultValue="alex@flowboard.io" className="mt-1.5" />
                  </div>
                  <Button size="sm" className="w-fit">Save changes</Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'workspace' && (
            <div className="space-y-6">
              <h2 className="text-sm font-medium text-foreground mb-4">Workspace Settings</h2>
              <div className="grid gap-4 max-w-sm">
                <div>
                  <Label className="text-sm">Workspace name</Label>
                  <Input defaultValue="Flowboard Team" className="mt-1.5" />
                </div>
                <Button size="sm" className="w-fit">Update</Button>
              </div>
              <Separator />
              <div>
                <h3 className="text-sm font-medium text-foreground mb-3">Members</h3>
                <div className="space-y-2">
                  {[
                    { name: 'Alex Chen', role: 'Owner', email: 'alex@flowboard.io' },
                    { name: 'Sarah Miller', role: 'Admin', email: 'sarah@flowboard.io' },
                    { name: 'James Wilson', role: 'Member', email: 'james@flowboard.io' },
                    { name: 'Emily Davis', role: 'Member', email: 'emily@flowboard.io' },
                  ].map(m => (
                    <div key={m.email} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium text-muted-foreground">
                          {m.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{m.name}</p>
                          <p className="text-xs text-muted-foreground">{m.email}</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{m.role}</span>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="mt-3">Invite member</Button>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-6">
              <h2 className="text-sm font-medium text-foreground mb-4">Billing</h2>
              <div className="p-4 rounded-xl border bg-card">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">Pro Plan</p>
                    <p className="text-xs text-muted-foreground">$12/user/month • 4 users</p>
                  </div>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
                <p className="text-xs text-muted-foreground">Next billing date: May 1, 2026</p>
              </div>
            </div>
          )}

          {activeTab === 'theme' && (
            <div className="space-y-6">
              <h2 className="text-sm font-medium text-foreground mb-4">Appearance</h2>
              <div className="grid grid-cols-2 gap-3 max-w-xs">
                <button className="p-4 rounded-lg border-2 border-primary bg-card text-center">
                  <div className="w-8 h-8 rounded-md bg-background border mx-auto mb-2" />
                  <span className="text-xs font-medium text-foreground">Light</span>
                </button>
                <button className="p-4 rounded-lg border bg-card text-center hover:border-muted-foreground/50 transition-colors">
                  <div className="w-8 h-8 rounded-md bg-foreground mx-auto mb-2" />
                  <span className="text-xs font-medium text-foreground">Dark</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
