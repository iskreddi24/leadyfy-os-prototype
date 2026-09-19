import React, { useState, useMemo } from 'react';
import {
  Camera,
  Plus,
  Search,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  CheckSquare,
  Square,
  CheckCircle2,
  AlertTriangle,
  FolderOpen,
  UserCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';

export default function Shoots() {
  const {
    shoots,
    clients,
    creators,
    addShoot,
    updateShoot,
    updateShootChecklist,
    notify
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'calendar'
  const [selectedShoot, setSelectedShoot] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newShootForm, setNewShootForm] = useState({
    title: '',
    clientId: clients[0]?.id || '',
    date: '2026-03-25',
    time: '10:00 AM - 02:00 PM',
    location: 'Studio 4B, Bandra West, Mumbai',
    creatorId: creators[0]?.id || '',
    cameraman: 'Arjun Das',
    shootManager: 'Sneha Patel',
    shootingAssistant: 'Vikram Joshi',
    shootStatus: 'Scheduled'
  });

  const filteredShoots = useMemo(() => {
    return shoots.filter(sh => {
      const matchesSearch =
        sh.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sh.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sh.creatorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sh.location?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All' || sh.shootStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [shoots, searchQuery, statusFilter]);

  const handleCreateShoot = (e) => {
    e.preventDefault();
    const selClient = clients.find(c => c.id === newShootForm.clientId);
    const selCreator = creators.find(c => c.id === newShootForm.creatorId);

    addShoot({
      ...newShootForm,
      clientName: selClient?.companyName || selClient?.clientName || 'Client',
      creatorName: selCreator?.name || 'Creator'
    });
    setIsAddModalOpen(false);
  };

  const handleStatusChange = (shootId, newStatus) => {
    updateShoot(shootId, { shootStatus: newStatus });
    notify({
      title: 'Shoot Status Updated',
      message: `Shoot transitioned to ${newStatus}`,
      type: 'info'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Field Operations
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-500 font-medium">Studio Logistics</span>
          </div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Shoots & Production Logistics
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Coordinate studio locations, creator arrival, equipment checklists, and raw footage intake.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Schedule Shoot</span>
          </button>
        </div>
      </div>

      {/* Filters & View Mode */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search shoots, location, creator..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 rounded-xl bg-stone-50/70 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
            {['All', 'Scheduled', 'Confirmed', 'In Progress', 'Completed'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  statusFilter === st
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                viewMode === 'calendar' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500'
              }`}
            >
              Calendar
            </button>
          </div>
        </div>
      </div>

      {/* Shoots Content */}
      {viewMode === 'list' ? (
        <div className="space-y-4">
          {filteredShoots.map(shoot => {
            const checklist = shoot.preShootChecklist || {};
            const completedChecks = Object.values(checklist).filter(Boolean).length;
            const totalChecks = 4;

            return (
              <div
                key={shoot.id}
                className="bg-white rounded-2xl p-5 border border-stone-200/80 hover:border-amber-400 hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5"
              >
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-base font-bold text-stone-900">
                      {shoot.title}
                    </h3>
                    <Badge status={shoot.shootStatus} size="xs" />
                  </div>

                  <div className="flex items-center gap-4 text-xs text-stone-600 flex-wrap">
                    <span className="font-semibold text-amber-700">Client: {shoot.clientName}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="w-3.5 h-3.5 text-stone-400" />
                      {shoot.date} ({shoot.time})
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      {shoot.location}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-stone-500 flex-wrap pt-1">
                    <span>Creator: <strong>{shoot.creatorName}</strong></span>
                    <span>Cameraman: <strong>{shoot.cameraman}</strong></span>
                    <span>Shoot Manager: <strong>{shoot.shootManager}</strong></span>
                  </div>

                  {/* Pre-Shoot Checklist Quick Toggles */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-stone-700 mb-1.5">
                      <span>Pre-Shoot Operational Checklist ({completedChecks}/{totalChecks})</span>
                      <span className={completedChecks === 4 ? 'text-emerald-600' : 'text-amber-600'}>
                        {completedChecks === 4 ? 'Ready for Call' : 'Pending Verification'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { key: 'scriptApproved', label: 'Script Printed' },
                        { key: 'productDispatched', label: 'Product Delivered' },
                        { key: 'creatorConfirmed', label: 'Creator Confirmed' },
                        { key: 'locationBooked', label: 'Studio Booked' }
                      ].map(item => {
                        const isChecked = !!checklist[item.key];
                        return (
                          <button
                            key={item.key}
                            type="button"
                            onClick={() => updateShootChecklist(shoot.id, item.key, !isChecked)}
                            className={`flex items-center gap-1.5 p-2 rounded-lg border text-left text-xs transition-colors cursor-pointer ${
                              isChecked
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                            }`}
                          >
                            {isChecked ? (
                              <CheckSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            ) : (
                              <Square className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                            )}
                            <span className="truncate">{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right Actions & Status Transitions */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-2 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-stone-100">
                  <select
                    value={shoot.shootStatus}
                    onChange={(e) => handleStatusChange(shoot.id, e.target.value)}
                    className="px-3 py-1.5 text-xs font-bold text-stone-800 bg-stone-50 border border-stone-300 rounded-lg cursor-pointer"
                  >
                    <option>Scheduled</option>
                    <option>Confirmed</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                    <option>Reshoot Required</option>
                  </select>

                  <a
                    href={shoot.rawFootageLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-stone-900 hover:bg-black text-amber-400 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>Raw Footage Drive</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Calendar View Prototype */
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-stone-900">Production Calendar - March 2026</h3>
            <span className="text-xs text-stone-500 font-medium">Synced Studio Slots</span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-stone-500 border-b border-stone-200 pb-2">
            <div>MON</div>
            <div>TUE</div>
            <div>WED</div>
            <div>THU</div>
            <div>FRI</div>
            <div>SAT</div>
            <div>SUN</div>
          </div>

          <div className="grid grid-cols-7 gap-2 mt-2">
            {Array.from({ length: 31 }, (_, i) => {
              const day = i + 1;
              const dateStr = `2026-03-${day < 10 ? '0' + day : day}`;
              const dayShoots = shoots.filter(s => s.date === dateStr);

              return (
                <div
                  key={day}
                  className={`min-h-24 p-1.5 rounded-xl border transition-colors ${
                    dayShoots.length > 0 ? 'bg-amber-50/50 border-amber-300' : 'bg-stone-50/40 border-stone-200'
                  }`}
                >
                  <div className="text-right text-xs font-bold text-stone-400">{day}</div>
                  <div className="mt-1 space-y-1">
                    {dayShoots.map(s => (
                      <div
                        key={s.id}
                        className="text-[10px] font-bold p-1 rounded-md bg-amber-500 text-black truncate shadow-2xs cursor-pointer"
                        title={`${s.title} (${s.time})`}
                      >
                        {s.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Schedule Shoot Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsAddModalOpen(false)}
          title="Schedule New Production Shoot"
        >
          <form onSubmit={handleCreateShoot} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Shoot Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. ChaiPoint Cold Brew Summer Launch"
                value={newShootForm.title}
                onChange={(e) => setNewShootForm({ ...newShootForm, title: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Client *</label>
                <select
                  value={newShootForm.clientId}
                  onChange={(e) => setNewShootForm({ ...newShootForm, clientId: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.companyName || c.clientName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Creator *</label>
                <select
                  value={newShootForm.creatorId}
                  onChange={(e) => setNewShootForm({ ...newShootForm, creatorId: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
                >
                  {creators.map(cr => (
                    <option key={cr.id} value={cr.id}>{cr.name} ({cr.location})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Date *</label>
                <input
                  type="date"
                  required
                  value={newShootForm.date}
                  onChange={(e) => setNewShootForm({ ...newShootForm, date: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Time Slot *</label>
                <input
                  type="text"
                  required
                  value={newShootForm.time}
                  onChange={(e) => setNewShootForm({ ...newShootForm, time: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Studio / Location Address *</label>
              <input
                type="text"
                required
                value={newShootForm.location}
                onChange={(e) => setNewShootForm({ ...newShootForm, location: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-black bg-amber-500 hover:bg-amber-600 rounded-lg cursor-pointer shadow-xs"
              >
                Schedule Shoot
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
