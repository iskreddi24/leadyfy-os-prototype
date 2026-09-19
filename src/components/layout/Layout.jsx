import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import ToastContainer from '../common/Toast';
import ConfirmModal from '../common/ConfirmModal';
import GlobalSearchModal from '../modals/GlobalSearchModal';
import QuickAddModals from '../modals/QuickAddModals';
import { useApp } from '../../context/AppContext';

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickAddModal, setQuickAddModal] = useState(null); // 'client' | 'order' | 'script' | 'shoot' | 'video' | 'task'

  const {
    role,
    setRole,
    isSidebarCollapsed,
    confirmModal,
    closeConfirm
  } = useApp();

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#111111] flex flex-col selection:bg-amber-500 selection:text-black">
      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Topbar */}
        <Topbar
          setMobileOpen={setMobileOpen}
          onOpenQuickAdd={(type) => setQuickAddModal(type)}
          onOpenGlobalSearch={() => setSearchOpen(true)}
        />

        {/* Demo Mode Notice Banner if Role is not Owner */}
        {role !== 'owner' && (
          <div className="bg-stone-900 text-stone-200 px-4 py-2 border-b border-stone-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>
                Simulating <strong>{role.toUpperCase()}</strong> perspective. Role-Based Access Control filters applied.
              </span>
            </div>
            <button
              onClick={() => setRole('owner')}
              className="text-amber-400 hover:underline font-semibold cursor-pointer text-[11px]"
            >
              Back to Owner (Super Admin)
            </button>
          </div>
        )}

        {/* Main Routed Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <ToastContainer />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirm}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        isDanger={confirmModal.isDanger}
      />

      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

      <QuickAddModals
        activeModal={quickAddModal}
        onClose={() => setQuickAddModal(null)}
      />
    </div>
  );
}
