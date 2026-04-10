import { Kanban, Star, Layout, Settings, Plus } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useBoards } from "@/hooks/useBoards";

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { data: boards = [] } = useBoards();
  const starredBoards = boards.filter(b => b.starred);

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className={`p-3 flex items-center gap-2 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <Kanban className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          {!collapsed && <span className="font-semibold text-foreground text-sm">Flowboard</span>}
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/app" end activeClassName="bg-accent text-accent-foreground font-medium">
                    <Layout className="mr-2 h-4 w-4" />
                    {!collapsed && <span>Dashboard</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {starredBoards.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs">
              <Star className="w-3 h-3 mr-1" /> {!collapsed && 'Starred'}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {starredBoards.map(board => (
                  <SidebarMenuItem key={board.id}>
                    <SidebarMenuButton asChild>
                      <NavLink to={`/app/board/${board.id}`} activeClassName="bg-accent text-accent-foreground font-medium">
                        <span className="w-4 h-4 rounded bg-primary/10 flex items-center justify-center text-[9px] font-bold text-primary mr-2 flex-shrink-0">
                          {board.title[0]}
                        </span>
                        {!collapsed && <span className="truncate">{board.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs flex items-center justify-between">
            {!collapsed && 'Boards'}
            <button className="hover:text-foreground transition-colors">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {boards.map(board => (
                <SidebarMenuItem key={board.id}>
                  <SidebarMenuButton asChild>
                    <NavLink to={`/app/board/${board.id}`} activeClassName="bg-accent text-accent-foreground font-medium">
                      <span className="w-4 h-4 rounded bg-muted flex items-center justify-center text-[9px] font-medium text-muted-foreground mr-2 flex-shrink-0">
                        {board.title[0]}
                      </span>
                      {!collapsed && <span className="truncate">{board.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/app/settings" activeClassName="bg-accent text-accent-foreground font-medium">
                    <Settings className="mr-2 h-4 w-4" />
                    {!collapsed && <span>Settings</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
