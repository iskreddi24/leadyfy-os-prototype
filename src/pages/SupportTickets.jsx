import React, { useState, useMemo } from 'react';
import {
  LifeBuoy,
  Plus,
  Search,
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertCircle,
  Send,
  User
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';

export default function SupportTickets() {
  const {
    tickets,
    clients,
    addTicket,
    addTicketReply,
    updateTicketStatus,
    notify
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [replyText, setReplyText] = useState('');

  const [ticketForm, setTicketForm] = useState({
    ticketNumber: `TCK-${Math.floor(100 + Math.random() * 899)}`,
    clientId: clients[0]?.id || '',
    subject: '',
    category: 'Video Revision',
    priority: 'High',
    message: ''
  });

  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      const matchesSearch =
        t.ticketNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.clientName?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tickets, searchQuery, statusFilter]);

  const handleCreateTicket = (e) => {
    e.preventDefault();
    const selClient = clients.find(c => c.id === ticketForm.clientId);

    addTicket({
      ...ticketForm,
      clientName: selClient?.companyName || selClient?.clientName || 'Client'
    });
    setIsAddModalOpen(false);
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    addTicketReply(selectedTicket.id, {
      sender: 'Agency Operations Support',
      role: 'Support Staff',
      message: replyText
    });

    setReplyText('');
    notify({
      title: 'Reply Dispatched',
      message: 'Client has been notified via email & portal',
      type: 'success'
    });
  };

  const handleStatusChange = (ticketId, newStatus) => {
    updateTicketStatus(ticketId, newStatus);
    notify({
      title: 'Ticket Status Updated',
      message: `Ticket transitioned to ${newStatus}`,
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
              Client Success
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-500 font-medium">SLA Escalations</span>
          </div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Client Support & Service Tickets
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Handle emergency script adjustments, rush render requests, and account inquiries with clear SLAs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Open Ticket</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search ticket #, subject, client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 rounded-xl bg-stone-50/70 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
          {['All', 'Open', 'In Progress', 'Resolved'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                statusFilter === st ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="divide-y divide-stone-100">
          {filteredTickets.length === 0 ? (
            <div className="p-12 text-center text-xs text-stone-400">
              No tickets matching current filters.
            </div>
          ) : (
            filteredTickets.map(t => (
              <div
                key={t.id}
                className="p-5 hover:bg-stone-50/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
                onClick={() => setSelectedTicket(t)}
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                      {t.ticketNumber}
                    </span>
                    <h3 className="text-sm font-bold text-stone-900">
                      {t.subject}
                    </h3>
                    <Badge status={t.status} size="xs" />
                    <Badge status={t.priority} size="xs" />
                  </div>

                  <p className="text-xs text-stone-500">
                    Client: <strong>{t.clientName}</strong> • Category: <strong>{t.category}</strong> • Created: {t.createdAt}
                  </p>

                  <p className="text-xs text-stone-600 line-clamp-1">
                    {t.thread?.[t.thread.length - 1]?.message}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-stone-400 font-medium">
                    {t.thread?.length || 0} messages
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTicket(t);
                    }}
                    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    View Thread
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Ticket Conversation Modal */}
      {selectedTicket && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedTicket(null)}
          title={`Ticket: ${selectedTicket.ticketNumber} - ${selectedTicket.subject}`}
          subtitle={`Client: ${selectedTicket.clientName} • Category: ${selectedTicket.category} • Priority: ${selectedTicket.priority}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4">
            {/* Status Transition Ribbon */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700">Ticket Lifecycle:</span>
              <div className="flex items-center gap-2">
                <select
                  value={selectedTicket.status}
                  onChange={(e) => {
                    handleStatusChange(selectedTicket.id, e.target.value);
                    setSelectedTicket({ ...selectedTicket, status: e.target.value });
                  }}
                  className="px-2.5 py-1 text-xs font-bold bg-white border border-stone-300 rounded-lg cursor-pointer"
                >
                  <option>Open</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                </select>
              </div>
            </div>

            {/* Thread Messages */}
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {selectedTicket.thread?.map((msg, idx) => {
                const isClient = msg.role?.includes('Client');
                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl text-xs space-y-1 ${
                      isClient
                        ? 'bg-stone-100 border border-stone-200 text-stone-800 mr-8'
                        : 'bg-amber-50 border border-amber-200 text-amber-950 ml-8'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span>{msg.sender} ({msg.role})</span>
                      <span className="text-[10px] text-stone-400 font-normal">{msg.timestamp}</span>
                    </div>
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                  </div>
                );
              })}
            </div>

            {/* Reply Form */}
            <form onSubmit={handleSendReply} className="flex gap-2 pt-2 border-t border-stone-200">
              <input
                type="text"
                required
                placeholder="Type your response to the client..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-1 px-3 py-2 text-xs border border-stone-300 rounded-lg"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Reply</span>
              </button>
            </form>

            <div className="flex justify-end pt-2 border-t border-stone-100">
              <button
                onClick={() => setSelectedTicket(null)}
                className="px-4 py-2 text-xs font-bold text-stone-600 hover:text-stone-900 cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Ticket Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsAddModalOpen(false)}
          title="Open New Support Ticket"
        >
          <form onSubmit={handleCreateTicket} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Client *</label>
                <select
                  value={ticketForm.clientId}
                  onChange={(e) => setTicketForm({ ...ticketForm, clientId: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.companyName || c.clientName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Category</label>
                <select
                  value={ticketForm.category}
                  onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
                >
                  <option>Video Revision</option>
                  <option>Rush Delivery Request</option>
                  <option>Script Adjustments</option>
                  <option>Invoicing & Billing</option>
                  <option>Creator Change</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Subject *</label>
              <input
                type="text"
                required
                placeholder="e.g. Need color grading tweak on hook scene"
                value={ticketForm.subject}
                onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Priority</label>
              <select
                value={ticketForm.priority}
                onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Initial Message *</label>
              <textarea
                rows={3}
                required
                placeholder="Describe the issue or request in detail..."
                value={ticketForm.message}
                onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
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
                Submit Ticket
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
