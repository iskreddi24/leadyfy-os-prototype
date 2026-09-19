import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  Video,
  Camera,
  Film,
  CheckSquare,
  CreditCard,
  Receipt,
  Wallet,
  LifeBuoy,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const {
    role,
    isSidebarCollapsed,
    toggleSidebar,
    scripts,
    shoots,
    videos,
    tasks,
    supportTickets,
    clientScopedData
  } = useApp();

  const location = useLocation();
  const isClientRole = role === 'client';

  // Badges calculation - scoped to client if role is client
  const activeScripts = isClientRole ? (clientScopedData?.scripts || []) : scripts;
  const activeVideos = isClientRole ? (clientScopedData?.videos || []) : videos;
  const activeTickets = isClientRole ? (clientScopedData?.supportTickets || []) : supportTickets;

  const pendingScriptsCount = activeScripts.filter(s => s.status === 'In Review' || s.status === 'Sent to Client').length;
  const inProgressVideosCount = activeVideos.filter(v => v.stage === 'Client Review' || v.stage === 'Video Editing' || v.stage === 'Revision').length;
  const urgentTasksCount = isClientRole ? 0 : tasks.filter(t => t.priority === 'Urgent' && t.status !== 'Done').length;
  const openTicketsCount = activeTickets.filter(t => t.status === 'Open').length;

  // Agency Staff Navigation
  const agencyNavItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/clients', label: 'Clients', icon: Users },
    { path: '/orders', label: 'Orders', icon: Package },
    { path: '/scripts', label: 'Scripts', icon: FileText, badge: pendingScriptsCount ? `${pendingScriptsCount}` : null },
    { path: '/creators', label: 'Creators', icon: Video },
    { path: '/shoots', label: 'Shoots', icon: Camera },
    { path: '/videos', label: 'Videos', icon: Film, badge: inProgressVideosCount ? `${inProgressVideosCount}` : null, highlight: true },
    { path: '/tasks', label: 'Tasks', icon: CheckSquare, badge: urgentTasksCount ? `${urgentTasksCount}` : null },
    { path: '/payments', label: 'Payments', icon: CreditCard },
    { path: '/expenses', label: 'Expenses', icon: Receipt },
    { path: '/creator-payouts', label: 'Creator Payouts', icon: Wallet },
    { path: '/support-tickets', label: 'Support Tickets', icon: LifeBuoy, badge: openTicketsCount ? `${openTicketsCount}` : null },
    { path: '/reports', label: 'Reports', icon: BarChart3 }
  ];

  // Dedicated Client Portal Navigation (Strict Isolation)
  const clientNavItems = [
    { path: '/portal', label: 'Client Dashboard', icon: LayoutDashboard },
    { path: '/orders', label: 'My Orders', icon: Package },
    { path: '/scripts', label: 'My Scripts', icon: FileText, badge: pendingScriptsCount ? `${pendingScriptsCount}` : null },
    { path: '/videos', label: 'My Videos', icon: Film, badge: inProgressVideosCount ? `${inProgressVideosCount}` : null, highlight: true },
    { path: '/payments', label: 'My Invoices', icon: CreditCard },
    { path: '/support-tickets', label: 'My Support Tickets', icon: LifeBuoy, badge: openTicketsCount ? `${openTicketsCount}` : null }
  ];

  const navItems = isClientRole ? clientNavItems : agencyNavItems;

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-[#111111] text-stone-300 border-r border-stone-800 transition-all duration-300 ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        } ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4.5 border-b border-stone-800/80 shrink-0">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-black font-extrabold text-base shrink-0 shadow-xs shadow-amber-500/20">
              L
            </div>
            {!isSidebarCollapsed && (
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="font-extrabold text-base tracking-wider text-white font-mono">
                  LEADYFY
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
                  OS
                </span>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Client Portal Quick Switch Notice (if in Client role) */}
        {isClientRole && (
          <div className="m-3 p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              {!isSidebarCollapsed && (
                <div className="text-xs">
                  <p className="font-bold text-amber-300">Client Portal Mode</p>
                  <p className="text-[11px] text-stone-400">Simplified portal view active</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-amber-500 text-black font-bold shadow-xs shadow-amber-500/20'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
                } ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
                title={item.label}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-4.5 h-4.5 shrink-0 transition-colors ${
                      isActive ? 'text-black' : 'text-stone-400 group-hover:text-amber-400'
                    }`}
                  />
                  {!isSidebarCollapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                </div>

                {!isSidebarCollapsed && item.badge && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                      isActive
                        ? 'bg-black text-amber-400'
                        : 'bg-stone-800 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Bottom Section: Settings & User Identity */}
        <div className="p-3 border-t border-stone-800/80 space-y-2 shrink-0">
          {!isClientRole && (
            <NavLink
              to="/settings"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-stone-400 hover:text-white hover:bg-stone-800/80 transition-colors ${
                location.pathname === '/settings' ? 'bg-stone-800 text-white font-bold' : ''
              } ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
              title="Settings & System Config"
            >
              <Settings className="w-4.5 h-4.5 text-stone-400 shrink-0" />
              {!isSidebarCollapsed && <span>Settings & Logs</span>}
            </NavLink>
          )}

          {/* Current Persona Badge */}
          <div
            className={`p-2 rounded-xl bg-stone-900/90 border border-stone-800 flex items-center gap-2.5 ${
              isSidebarCollapsed ? 'justify-center' : ''
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-xs font-bold text-amber-400 shrink-0 uppercase">
              {role === 'client' ? 'NV' : role.slice(0, 2)}
            </div>
            {!isSidebarCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">
                  {role === 'owner'
                    ? 'Vikram Malhotra'
                    : role === 'admin'
                    ? 'Ananya Sharma'
                    : role === 'employee'
                    ? 'Rohan Mehta'
                    : 'Aditya Verma'}
                </p>
                <p className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">
                  {role === 'client' ? 'NovaFit Nutrition' : `Role: ${role}`}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
