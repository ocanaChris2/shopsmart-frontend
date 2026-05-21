import React, { useState } from 'react';
import { Outlet }            from 'react-router-dom';
import { Loader2 }           from 'lucide-react';

import { AppSidebar } from '@/components/AppSidebar';

// Persist collapsed state across page navigations
function readCollapsed(): boolean {
  try { return localStorage.getItem('sidebar-collapsed') === 'true'; }
  catch { return false; }
}

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState<boolean>(readCollapsed);

  const handleToggle = () => {
    setCollapsed((v) => {
      const next = !v;
      try { localStorage.setItem('sidebar-collapsed', String(next)); } catch { /* ignore */ }
      return next;
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar collapsed={collapsed} onToggle={handleToggle} />

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl p-6">
          <React.Suspense
            fallback={
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            }
          >
            <Outlet />
          </React.Suspense>
        </div>
      </main>
    </div>
  );
}
