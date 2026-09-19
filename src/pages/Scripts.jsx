import React, { useState, useMemo } from 'react';
import {
  FileText,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Eye,
  Send,
  Edit,
  ArrowRight,
  Sparkles,
  Camera
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';

export default function Scripts() {
  const {
    scripts,
    clients,
    creators,
    addScript,
    updateScript,
    updateScriptStatus,
    notify
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [clientFilter, setClientFilter] = useState('All');

  // Reader & Edit Modals
  const [readingScript, setReadingScript] = useState(null);
  const [editingScript, setEditingScript] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newScriptForm, setNewScriptForm] = useState({
    clientId: clients[0]?.id || '',
    videoNumber: `ZO-${Math.floor(10 + Math.random() * 89)}`,
    title: '',
    writer: 'Rahul Verma',
    creatorId: creators[0]?.id || '',
    language: 'Hinglish',
    status: 'Draft',
    scriptText: '',
    deadline: '2026-03-30'
  });

  const filteredScripts = useMemo(() => {
    return scripts.filter(s => {
      const matchesSearch =
        s.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.videoNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.creatorName?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
      const matchesClient = clientFilter === 'All' || s.clientId === clientFilter;

      return matchesSearch && matchesStatus && matchesClient;
    });
  }, [scripts, searchQuery, statusFilter, clientFilter]);

  const scriptStatuses = [
    'All',
    'Draft',
    'Assigned',
    'In Review',
    'Sent to Client',
    'Revision Required',
    'Approved',
    'Ready for Shoot'
  ];

  const handleCreateScript = (e) => {
    e.preventDefault();
    const selClient = clients.find(c => c.id === newScriptForm.clientId);
    const selCreator = creators.find(c => c.id === newScriptForm.creatorId);

    addScript({
      ...newScriptForm,
      clientName: selClient?.companyName || selClient?.clientName || 'Client',
      creatorName: selCreator?.name || 'Creator'
    });
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    updateScript(editingScript.id, editingScript);
    setEditingScript(null);
    notify({
      title: 'Script Saved',
      message: `${editingScript.videoNumber} updated successfully.`,
      type: 'success'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Creative Development
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-500 font-medium">UGC Copywriting</span>
          </div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Scripting & Concept Approvals
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Craft 3-second visual hooks, UGC story angles, client reviews, and director notes for creators.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Draft New Script</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search script title, reference, writer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 rounded-xl bg-stone-50/70 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
            {scriptStatuses.map(st => (
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
        </div>
      </div>

      {/* Scripts Table & Cards */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="divide-y divide-stone-100">
          {filteredScripts.length === 0 ? (
            <div className="p-12 text-center text-xs text-stone-400">
              No scripts match the current filters.
            </div>
          ) : (
            filteredScripts.map(script => (
              <div
                key={script.id}
                className="p-4 sm:p-5 hover:bg-stone-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                      {script.videoNumber}
                    </span>
                    <h3 className="text-sm font-bold text-stone-900 truncate">
                      {script.title}
                    </h3>
                    <Badge status={script.status} size="xs" />
                  </div>

                  <p className="text-xs text-stone-500">
                    Client: <strong className="text-stone-800">{script.clientName}</strong> • Writer: <strong>{script.writer}</strong> • Creator: <strong>{script.creatorName}</strong> • Language: <strong>{script.language}</strong>
                  </p>

                  <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200/60 font-mono text-[11px] text-stone-600 line-clamp-2">
                    {script.scriptText}
                  </div>
                </div>

                {/* Status Transitions & Actions */}
                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  <button
                    onClick={() => setReadingScript(script)}
                    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Read</span>
                  </button>

                  <button
                    onClick={() => setEditingScript({ ...script })}
                    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  {/* Operational workflow shortcuts */}
                  {script.status === 'Draft' && (
                    <button
                      onClick={() => updateScriptStatus(script.id, 'Assigned')}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
                    >
                      Assign Writer
                    </button>
                  )}

                  {script.status === 'Assigned' && (
                    <button
                      onClick={() => updateScriptStatus(script.id, 'In Review')}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
                    >
                      Submit for QA
                    </button>
                  )}

                  {script.status === 'In Review' && (
                    <button
                      onClick={() => updateScriptStatus(script.id, 'Sent to Client')}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold rounded-lg cursor-pointer transition-colors"
                    >
                      Send to Client
                    </button>
                  )}

                  {script.status === 'Sent to Client' && (
                    <button
                      onClick={() => updateScriptStatus(script.id, 'Approved')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
                    >
                      Mark Approved
                    </button>
                  )}

                  {script.status === 'Approved' && (
                    <button
                      onClick={() => updateScriptStatus(script.id, 'Ready for Shoot')}
                      className="px-3 py-1.5 bg-stone-900 hover:bg-black text-amber-400 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Ready for Shoot</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Script Reader Modal */}
      {readingScript && (() => {
        const assignedCreator = creators.find(c => c.id === readingScript.creatorId || c.name === readingScript.creatorName);
        return (
          <Modal
            isOpen={true}
            onClose={() => setReadingScript(null)}
            title={`Script Reader: ${readingScript.videoNumber} - ${readingScript.title}`}
            subtitle={`Client: ${readingScript.clientName} • Writer: ${readingScript.writer} • Status: ${readingScript.status}`}
            maxWidth="max-w-2xl"
          >
            <div className="space-y-4">
              {/* Prominent Creator Banner */}
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full overflow-hidden bg-amber-100 border border-amber-300 shrink-0">
                    <img
                      src={assignedCreator?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                      alt={readingScript.creatorName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-full">
                        Assigned Creator
                      </span>
                      <span className="text-[11px] text-stone-500">{assignedCreator?.location || 'Hyderabad, Telangana'}</span>
                    </div>
                    <h4 className="text-sm font-bold text-stone-900 mt-0.5">{readingScript.creatorName || assignedCreator?.name}</h4>
                    <p className="text-[11px] text-stone-500">
                      Rate: ₹{(assignedCreator?.rates || 6500).toLocaleString('en-IN')} / video • Availability: <span className="font-semibold text-emerald-700">{assignedCreator?.availability || 'Available'}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <Badge status={readingScript.status} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-stone-700">Script Content & Hook Flow</span>
                  <span className="text-[11px] text-stone-400">Revisions: #{readingScript.revisionCount}</span>
                </div>
                <div className="p-4 bg-stone-900 text-stone-100 rounded-xl font-mono text-xs whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
                  {readingScript.scriptText}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-stone-200">
                <span className="text-xs text-stone-500">Target Deadline: {readingScript.deadline}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setReadingScript(null)}
                    className="px-4 py-2 text-xs font-bold text-stone-600 hover:text-stone-900 cursor-pointer"
                  >
                    Close
                  </button>
                  {readingScript.status !== 'Approved' && (
                    <button
                      onClick={() => {
                        updateScriptStatus(readingScript.id, 'Approved');
                        setReadingScript(null);
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Approve Script
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Modal>
        );
      })()}

      {/* Script Edit Modal */}
      {editingScript && (
        <Modal
          isOpen={true}
          onClose={() => setEditingScript(null)}
          title={`Edit Script: ${editingScript.videoNumber}`}
        >
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Title / Angle</label>
              <input
                type="text"
                required
                value={editingScript.title}
                onChange={(e) => setEditingScript({ ...editingScript, title: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Writer</label>
                <input
                  type="text"
                  value={editingScript.writer}
                  onChange={(e) => setEditingScript({ ...editingScript, writer: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Status</label>
                <select
                  value={editingScript.status}
                  onChange={(e) => setEditingScript({ ...editingScript, status: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
                >
                  {scriptStatuses.filter(s => s !== 'All').map(st => (
                    <option key={st}>{st}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Script Breakdown</label>
              <textarea
                rows={6}
                value={editingScript.scriptText}
                onChange={(e) => setEditingScript({ ...editingScript, scriptText: e.target.value })}
                className="w-full px-3 py-2 text-xs font-mono border border-stone-300 rounded-lg"
              />
            </div>
            <div className="flex justify-end gap-3 pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setEditingScript(null)}
                className="px-4 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-black bg-amber-500 hover:bg-amber-600 rounded-lg cursor-pointer shadow-xs"
              >
                Save Script Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Script Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsAddModalOpen(false)}
          title="Draft New UGC Script"
        >
          <form onSubmit={handleCreateScript} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Client *</label>
                <select
                  value={newScriptForm.clientId}
                  onChange={(e) => setNewScriptForm({ ...newScriptForm, clientId: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.companyName || c.clientName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Video Reference #</label>
                <input
                  type="text"
                  required
                  value={newScriptForm.videoNumber}
                  onChange={(e) => setNewScriptForm({ ...newScriptForm, videoNumber: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Script Title / Creative Hook *</label>
              <input
                type="text"
                required
                placeholder="e.g. Why Dermatologists Avoid This 1 Mistake"
                value={newScriptForm.title}
                onChange={(e) => setNewScriptForm({ ...newScriptForm, title: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Writer</label>
                <input
                  type="text"
                  value={newScriptForm.writer}
                  onChange={(e) => setNewScriptForm({ ...newScriptForm, writer: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Creator Assigned</label>
                <select
                  value={newScriptForm.creatorId}
                  onChange={(e) => setNewScriptForm({ ...newScriptForm, creatorId: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
                >
                  {creators.map(cr => (
                    <option key={cr.id} value={cr.id}>{cr.name} ({cr.location})</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Script Breakdown (Hook, Problem, Solution, CTA) *</label>
              <textarea
                rows={5}
                required
                placeholder="[HOOK - 0-3s]: ...&#10;[PROBLEM - 3-7s]: ...&#10;[DEMO & PRODUCT - 7-15s]: ...&#10;[CTA - 15-20s]: ..."
                value={newScriptForm.scriptText}
                onChange={(e) => setNewScriptForm({ ...newScriptForm, scriptText: e.target.value })}
                className="w-full px-3 py-2 text-xs font-mono border border-stone-300 rounded-lg"
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
                Draft Script
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
