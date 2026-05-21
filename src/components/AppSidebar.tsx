import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ChevronLeft, ChevronRight,
  LogOut, Settings, HelpCircle, Search, X,
} from 'lucide-react';

import { cn }            from '@/lib/utils';
import { Skeleton }      from '@/components/ui/skeleton';
import { useAuth }       from '@/hooks/useAuth';
import { useEntityList } from '@/modules/dynamic/hooks/useEntitySchema';
import type { EntityDefinition } from '@/modules/dynamic/types';

// ── Helpers ───────────────────────────────────────────────────────────────────

const ENTITY_COLORS = [
  'bg-indigo-500', 'bg-emerald-500', 'bg-amber-500',
  'bg-rose-500',   'bg-cyan-500',    'bg-violet-500',
  'bg-orange-500', 'bg-teal-500',
] as const;

function entityColorClass(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) % ENTITY_COLORS.length;
  }
  return ENTITY_COLORS[h] ?? 'bg-indigo-500';
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0] ?? '')
    .join('')
    .toUpperCase();
}

// ── Entity icon ───────────────────────────────────────────────────────────────

function EntityIcon({ entity, collapsed }: { entity: EntityDefinition; collapsed: boolean }) {
  const base = 'flex items-center justify-center shrink-0 h-5 w-5 leading-none';

  if (entity.icon) {
    return (
      <span className={cn(base, 'text-base')} aria-hidden>
        {entity.icon}
      </span>
    );
  }

  return (
    <span
      className={cn(base, 'rounded text-[10px] font-bold text-white', entityColorClass(entity.name))}
      aria-hidden
    >
      {entity.name[0]?.toUpperCase() ?? '?'}
    </span>
  );

  // suppress unused warning — collapsed is read by parent but icon is always the same size
  void collapsed;
}

// ── Nav item shared class builder ─────────────────────────────────────────────

function navCls(isActive: boolean, collapsed: boolean) {
  return cn(
    'flex items-center gap-2.5 rounded-md px-2 py-2 text-sm transition-colors select-none',
    collapsed && 'justify-center',
    isActive
      ? 'bg-sidebar-primary text-sidebar font-medium'
      : 'text-slate-400 hover:text-slate-100 hover:bg-white/10',
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────

export interface AppSidebarProps {
  collapsed: boolean;
  onToggle:  () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const { user, tenant, logout } = useAuth();
  const { data, isLoading }      = useEntityList();
  const navigate                 = useNavigate();
  const [search, setSearch]      = useState('');

  const entities = data?.entities ?? [];
  const filtered = search.trim()
    ? entities.filter((e) =>
        e.name.toLowerCase().includes(search.trim().toLowerCase()),
      )
    : entities;

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const workspaceLetter = (tenant?.name ?? 'S')[0]?.toUpperCase() ?? 'S';
  const userInitials    = getInitials(user?.display_name ?? user?.email ?? '?');

  return (
    <aside
      className={cn(
        'flex flex-col border-r border-sidebar-border bg-sidebar shrink-0',
        'transition-[width] duration-200 ease-in-out overflow-hidden',
        collapsed ? 'w-16' : 'w-64',
      )}
    >
      {/* ── Brand header ──────────────────────────────────────────────────── */}
      <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-3 shrink-0">
        {/* Workspace avatar */}
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-sidebar-primary shrink-0">
          <span className="text-xs font-bold text-sidebar leading-none">
            {workspaceLetter}
          </span>
        </div>

        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="truncate text-xs font-semibold text-slate-100 leading-none">
              {tenant?.name ?? 'ShopSmart ERP'}
            </p>
            <p className="font-mono text-[10px] text-slate-500 mt-0.5">ERP Platform</p>
          </div>
        )}

        {/* Collapse toggle */}
        <button
          type="button"
          onClick={onToggle}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={cn(
            'flex h-6 w-6 items-center justify-center rounded transition-colors shrink-0',
            'text-slate-500 hover:text-slate-200 hover:bg-white/10',
          )}
        >
          {collapsed
            ? <ChevronRight className="h-3.5 w-3.5" />
            : <ChevronLeft  className="h-3.5 w-3.5" />
          }
        </button>
      </div>

      {/* ── Scrollable nav body ────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden py-3 gap-1">

        {/* Overview link */}
        <div className="px-2">
          <NavLink
            to="/dashboard"
            end
            title={collapsed ? 'Overview' : undefined}
            className={({ isActive }) => navCls(isActive, collapsed)}
          >
            <LayoutDashboard className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="truncate">Overview</span>}
          </NavLink>
        </div>

        {/* Divider + section label */}
        <div className="mx-3 my-1 border-t border-sidebar-border/50" />

        {!collapsed && (
          <p className="mx-4 mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600">
            Modules
          </p>
        )}

        {/* Search — only when expanded and list is long */}
        {!collapsed && entities.length > 5 && (
          <div className="relative mx-2 mb-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-600 pointer-events-none" />
            <input
              type="text"
              placeholder="Filter modules…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={cn(
                'w-full rounded-md border border-sidebar-border/80',
                'bg-white/5 pl-7 py-1.5 text-xs text-slate-200',
                'placeholder:text-slate-600',
                'focus:outline-none focus:ring-1 focus:ring-white/20',
                search ? 'pr-7' : 'pr-2.5',
              )}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        )}

        {/* Entity list */}
        <div className="px-2 overflow-y-auto flex-1 space-y-0.5">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={cn('flex items-center gap-2.5 px-2 py-2', collapsed && 'justify-center')}
                >
                  <Skeleton className="h-5 w-5 rounded shrink-0 bg-white/10" />
                  {!collapsed && <Skeleton className="h-3 flex-1 bg-white/10" />}
                </div>
              ))
            : filtered.map((entity) => (
                <NavLink
                  key={entity.id}
                  to={`/dashboard/${entity.slug}`}
                  title={collapsed ? entity.name : undefined}
                  className={({ isActive }) => navCls(isActive, collapsed)}
                >
                  <EntityIcon entity={entity} collapsed={collapsed} />
                  {!collapsed && (
                    <span className="truncate leading-none">{entity.name}</span>
                  )}
                </NavLink>
              ))
          }

          {/* No results */}
          {!isLoading && !collapsed && search && filtered.length === 0 && (
            <p className="py-4 text-center text-xs text-slate-600">
              No modules match &ldquo;{search}&rdquo;
            </p>
          )}
        </div>
      </div>

      {/* ── Bottom: settings + user ────────────────────────────────────────── */}
      <div className="shrink-0 border-t border-sidebar-border">

        {/* Settings / Help */}
        <div className="px-2 py-2 space-y-0.5">
          {([
            { icon: Settings,   label: 'Settings' },
            { icon: HelpCircle, label: 'Help & docs' },
          ] as const).map(({ icon: Icon, label }) => (
            <button
              key={label}
              type="button"
              title={collapsed ? label : undefined}
              aria-label={label}
              className={cn(
                'w-full flex items-center gap-2.5 rounded-md px-2 py-2 text-sm transition-colors',
                collapsed && 'justify-center',
                'text-slate-500 hover:text-slate-200 hover:bg-white/10',
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="truncate text-left">{label}</span>}
            </button>
          ))}
        </div>

        {/* User profile row */}
        <div className="border-t border-sidebar-border px-3 py-3">
          <div
            className={cn(
              'flex items-center gap-2.5',
              collapsed && 'justify-center',
            )}
          >
            {/* Avatar — acts as logout trigger when collapsed */}
            <button
              type="button"
              onClick={collapsed ? handleLogout : undefined}
              title={collapsed ? 'Sign out' : undefined}
              aria-label={collapsed ? 'Sign out' : undefined}
              className={cn(
                'h-7 w-7 rounded-full bg-indigo-600 flex items-center justify-center shrink-0',
                'text-xs font-semibold text-white leading-none select-none',
                collapsed && 'cursor-pointer hover:bg-indigo-500 transition-colors',
                !collapsed && 'cursor-default',
              )}
            >
              {userInitials}
            </button>

            {!collapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-xs font-medium text-slate-200 leading-none">
                    {user?.display_name ?? user?.email}
                  </p>
                  <p className="truncate font-mono text-[10px] text-slate-600 mt-0.5">
                    {user?.email}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  title="Sign out"
                  aria-label="Sign out"
                  className="text-slate-600 hover:text-slate-200 transition-colors shrink-0"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
