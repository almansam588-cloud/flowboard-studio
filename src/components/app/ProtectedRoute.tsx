import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  const { data: hasWorkspace, isLoading: wsLoading } = useQuery({
    queryKey: ['user_has_workspace', user?.id],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('workspace_members')
        .select('workspace_id', { count: 'exact', head: true })
        .eq('user_id', user!.id);
      if (error) throw error;
      return (count ?? 0) > 0;
    },
    enabled: !!user,
    staleTime: 30_000,
  });

  if (loading || (user && wsLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (hasWorkspace === false) return <Navigate to="/onboarding" replace />;

  return <>{children}</>;
}
