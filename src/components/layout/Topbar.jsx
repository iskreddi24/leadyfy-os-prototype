import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Bell,
  Search,
  Plus,
  Shield,
  UserCheck,
  Briefcase,
  ExternalLink,
  ChevronDown,
  Check,
  X,
  FileText,
  Video,
  Camera,
  Film,
  Package,
  CheckSquare,
  Users
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function Topbar({
  setMobileOpen,
  onOpenQuickAdd,
  onOpenGlobalSearch
}) {
  const {
    role,
    setRole,
    activeClientId,
    setActiveClientId,
    clients,
    notifications,
    markNotificationRead,
    markAllNotificationsRead
  } = useApp();

  const navigate = useNavigate();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showQuickAddDropdown, setShowQuickAddDropdown] = useState(false);

  const roleRef = useRef(null);
  const notifRef = useRef(null);
  const quickAddRef = useRef(null);

  const unreadNotificationsCount = notifications.filter(n => n.unread).length;

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (roleRef.current && !roleRef.current.contains(e.target)) {
        setShowRoleDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifDropdown(false);
      }
      if (quickAddRef.current && !quickAddRef.current.contains(e.target)) {
        setShowQuickAddDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roles = [
    {
      id: 'owner',
      label: 'Owner (Super Admin)',
      desc: 'Unrestricted access, executive financials, net profit, RBAC governance',
      badge: 'Full Access',
      icon: Shield
    },
    {
      id: 'admin',
      label: 'Admin (Operations Head)',
      desc: 'Daily operations, shoot schedules, editor assignments, client tickets',
      badge: 'Operations',
      icon: Briefcase
    },
    {
      id: 'employee',
      label: 'Employee (Editor/Writer)',
      desc: 'Assigned scripts, video rendering queue, urgent task board',
      badge: 'Internal',
      icon: UserCheck
    },
    {
      id: 'client',
      label: 'Client (External Portal)',
      desc: 'Simplified client view for script approvals, video reviews, revisions',
      badge: 'External Portal',
      icon: ExternalLink
    }
  ];

  const quickActions = [
    { label: 'New Client', icon: Users, action: () => onOpenQuickAdd('client') },
    { label: 'New Order', icon: Package, action: () => onOpenQuickAdd('order') },
    { label: 'New Script', icon: FileText, action: () => onOpenQuickAdd('script') },
    { label: 'Schedule Shoot', icon: Camera, action: () => onOpenQuickAdd('shoot') },
    { label: 'Add Video to Pipeline', icon: Film, action: () => onOpenQuickAdd('video') },
    { label: 'Create Task', icon: CheckSquare, action: () => onOpenQuickAdd('task') }
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile Toggle & Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div
          onClick={onOpenGlobalSearch}
          className="w-full max-w-xs sm:max-w-sm flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-stone-100/80 hover:bg-stone-100 border border-stone-200/70 text-stone-500 text-xs font-medium cursor-pointer transition-colors shadow-2xs"
        >
          <Search className="w-4 h-4 text-stone-400 shrink-0" />
          <span className="truncate">Search clients, orders, scripts, videos...</span>
          <kbd className="hidden sm:inline-block ml-auto px-1.5 py-0.5 text-[10px] font-mono font-semibold text-stone-400 bg-white border border-stone-200 rounded-md">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Role Switcher, Quick Add, Notifications */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Fixed Client Context - strictly locked to NovaFit Nutrition Pvt Ltd with NO dropdown */}
        {role === 'client' && (
          <div className="flex items-center gap-2 bg-amber-50/90 border border-amber-200/80 px-3 py-1.5 rounded-xl text-xs shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="font-bold text-stone-900 tracking-tight">NovaFit Nutrition Pvt Ltd</span>
            <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-200/70 px-1.5 py-0.5 rounded-md">
              Client Portal
            </span>
          </div>
        )}

        {/* Role Selector Trigger */}
        <div className="relative" ref={roleRef}>
          <button
            onClick={() => setShowRoleDropdown(prev => !prev)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-stone-300/80 bg-stone-900 text-white hover:bg-black transition-all shadow-xs text-xs font-semibold cursor-pointer"
            title="Switch demo role perspective"
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span className="capitalize">{role} View</span>
            <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
          </button>

          {/* Role Switcher Menu */}
          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-stone-200 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-stone-100 mb-1">
                <p className="text-xs font-bold text-stone-900">Prototype Role Switcher</p>
                <p className="text-[11px] text-stone-500">
                  Switch perspectives to test role-specific RBAC UI & workflows
                </p>
              </div>

              <div className="space-y-1">
                {roles.map((r) => {
                  const Icon = r.icon;
                  const isSelected = role === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => {
                        setRole(r.id);
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all ${
                        isSelected
                          ? 'bg-amber-50/80 border border-amber-200/80'
                          : 'hover:bg-stone-50'
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg shrink-0 ${
                          isSelected
                            ? 'bg-amber-500 text-black font-bold'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-stone-900">
                            {r.label}
                          </span>
                          {isSelected && <Check className="w-4 h-4 text-amber-600" />}
                        </div>
                        <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                          {r.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Quick Add Action Menu (Internal Team) or Ticket Button (Client) */}
        {role === 'client' ? (
          <button
            onClick={() => onOpenQuickAdd('ticket')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs shadow-xs transition-colors cursor-pointer"
            title="Open support ticket"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">Open Ticket</span>
          </button>
        ) : (
          <div className="relative" ref={quickAddRef}>
            <button
              onClick={() => setShowQuickAddDropdown(prev => !prev)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="hidden sm:inline">New</span>
            </button>

            {showQuickAddDropdown && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-stone-200 shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1.5 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                  Create New Entry
                </div>
                <div className="space-y-0.5">
                  {quickActions.map((qa, i) => {
                    const Icon = qa.icon;
                    return (
                      <button
                        key={i}
                        onClick={() => {
                          setShowQuickAddDropdown(false);
                          qa.action();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors text-left cursor-pointer"
                      >
                        <Icon className="w-4 h-4 text-amber-600" />
                        <span>{qa.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifDropdown(prev => !prev)}
            className="relative p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200 transition-colors cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-black text-[10px] font-extrabold flex items-center justify-center border-2 border-white animate-pulse">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-stone-200 shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-stone-900">Notifications</h4>
                  {unreadNotificationsCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-800">
                      {unreadNotificationsCount} new
                    </span>
                  )}
                </div>
                <button
                  onClick={markAllNotificationsRead}
                  className="text-xs text-amber-600 hover:text-amber-700 font-semibold cursor-pointer"
                >
                  Mark all read
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-stone-100">
                {notifications.slice(0, 8).map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => {
                      markNotificationRead(notif.id);
                      if (notif.link) navigate(notif.link);
                      setShowNotifDropdown(false);
                    }}
                    className={`p-3.5 text-left transition-colors cursor-pointer flex items-start gap-3 ${
                      notif.unread ? 'bg-amber-50/40 hover:bg-amber-50/80' : 'hover:bg-stone-50'
                    }`}
                  >
                    <div className="mt-1">
                      {notif.unread ? (
                        <span className="block w-2 h-2 rounded-full bg-amber-500" />
                      ) : (
                        <span className="block w-2 h-2 rounded-full bg-stone-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-stone-900 truncate">
                        {notif.title}
                      </p>
                      <p className="mt-0.5 text-xs text-stone-600 leading-snug">
                        {notif.message}
                      </p>
                      <span className="mt-1 block text-[10px] text-stone-400 font-medium">
                        {notif.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
