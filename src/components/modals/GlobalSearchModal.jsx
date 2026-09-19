import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, Users, Package, FileText, Film, Camera, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export default function GlobalSearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { clients, orders, scripts, videos, shoots, creators } = useApp();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // toggle search
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const matchedClients = clients
      .filter(c => (c.companyName?.toLowerCase().includes(q) || c.clientName?.toLowerCase().includes(q) || c.brandName?.toLowerCase().includes(q)))
      .slice(0, 3)
      .map(c => ({
        type: 'Client',
        title: c.companyName || c.clientName,
        subtitle: `${c.brandName || c.industry} • ${c.status}`,
        route: `/clients/${c.id}`,
        icon: Users
      }));

    const matchedOrders = orders
      .filter(o => (o.packageName?.toLowerCase().includes(q) || o.companyName?.toLowerCase().includes(q) || o.id?.toLowerCase().includes(q)))
      .slice(0, 3)
      .map(o => ({
        type: 'Order',
        title: o.packageName,
        subtitle: `${o.companyName} • ${o.contractedVideoCount} videos • ${o.orderStatus}`,
        route: `/orders/${o.id}`,
        icon: Package
      }));

    const matchedScripts = scripts
      .filter(s => (s.title?.toLowerCase().includes(q) || s.videoNumber?.toLowerCase().includes(q) || s.scriptText?.toLowerCase().includes(q)))
      .slice(0, 3)
      .map(s => ({
        type: 'Script',
        title: `${s.videoNumber} - ${s.title}`,
        subtitle: `${s.clientName} • ${s.creatorName} • ${s.status}`,
        route: `/scripts`,
        icon: FileText
      }));

    const matchedVideos = videos
      .filter(v => (v.title?.toLowerCase().includes(q) || v.videoNumber?.toLowerCase().includes(q)))
      .slice(0, 3)
      .map(v => ({
        type: 'Video',
        title: `${v.videoNumber} - ${v.title}`,
        subtitle: `${v.clientName} • Stage: ${v.stage}`,
        route: `/videos`,
        icon: Film
      }));

    const matchedShoots = shoots
      .filter(sh => (sh.title?.toLowerCase().includes(q) || sh.location?.toLowerCase().includes(q)))
      .slice(0, 3)
      .map(sh => ({
        type: 'Shoot',
        title: sh.title,
        subtitle: `${sh.date} • ${sh.location} • ${sh.shootStatus}`,
        route: `/shoots`,
        icon: Camera
      }));

    return [
      ...matchedClients,
      ...matchedOrders,
      ...matchedScripts,
      ...matchedVideos,
      ...matchedShoots
    ];
  }, [query, clients, orders, scripts, videos, shoots, creators]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative mx-auto max-w-xl transform rounded-2xl bg-white shadow-2xl border border-stone-200 overflow-hidden">
        {/* Search Input */}
        <div className="relative flex items-center border-b border-stone-200 px-4 py-3">
          <Search className="w-5 h-5 text-stone-400 shrink-0 mr-3" />
          <input
            type="text"
            autoFocus
            placeholder="Search clients, orders, scripts, videos, shoots..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-stone-900 placeholder-stone-400 focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-stone-400 hover:text-stone-600 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2">
          {query.trim() === '' ? (
            <div className="p-6 text-center text-xs text-stone-400">
              Type keywords like "Zing", "Protein", "Shoot", "Script", or "BoldFit"
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-500">
              No matching records found for "{query}"
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      navigate(item.route);
                      onClose();
                    }}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-amber-50/70 border border-transparent hover:border-amber-200/60 cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-stone-100 group-hover:bg-amber-100 text-stone-600 group-hover:text-amber-800 transition-colors shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-stone-900 truncate">
                            {item.title}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 bg-stone-100 text-stone-600 font-semibold rounded-md uppercase">
                            {item.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-amber-600 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
