import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app/AppSidebar";
import { Button } from "@/components/ui/button";
import { Bell, Search, Command } from "lucide-react";
import { useStore } from "@/store";
import { NotificationsDropdown } from "@/components/app/NotificationsDropdown";
import { SearchModal } from "@/components/app/SearchModal";
import { useState, useEffect } from "react";

export default function AppLayout() {
  const { notifications, setSearchOpen } = useStore();
  const unreadCount = notifications.filter(n => !n.read).length;
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setSearchOpen]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 border-b flex items-center justify-between px-3 bg-card flex-shrink-0">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground" onClick={() => setSearchOpen(true)}>
                <Search className="w-4 h-4" />
                <span className="hidden md:inline text-xs">Search</span>
                <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-muted text-[10px] text-muted-foreground">
                  <Command className="w-2.5 h-2.5" />K
                </kbd>
              </Button>
              <div className="relative">
                <Button variant="ghost" size="icon" className="relative" onClick={() => setNotifOpen(!notifOpen)}>
                  <Bell className="w-4 h-4 text-muted-foreground" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive" />
                  )}
                </Button>
                {notifOpen && <NotificationsDropdown onClose={() => setNotifOpen(false)} />}
              </div>
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-[11px] font-medium text-primary-foreground ml-1">
                AC
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
      <SearchModal />
    </SidebarProvider>
  );
}
