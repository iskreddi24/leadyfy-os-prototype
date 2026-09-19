import React, { useState, useMemo } from 'react';
import {
  Wallet,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Send
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';

export default function CreatorPayouts() {
  const {
    creatorPayouts,
    creators,
    addCreatorPayout,
    updateCreatorPayoutStatus,
    totalCreatorPayouts,
    notify
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [payoutForm, setPayoutForm] = useState({
    creatorId: creators[0]?.id || '',
    shootTitle: 'Zing Organics Summer Sunscreen Sprint',
    videosDeliveredCount: 3,
    ratePerVideo: 4500,
    amount: 13500,
    status: 'Pending',
    upiId: 'creator@okaxis'
  });

  const filteredPayouts = useMemo(() => {
    return creatorPayouts.filter(p => {
      const matchesSearch =
        p.creatorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shootTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.upiId?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [creatorPayouts, searchQuery, statusFilter]);

  const handleCreatePayout = (e) => {
    e.preventDefault();
    const selCreator = creators.find(c => c.id === payoutForm.creatorId);
    const count = Number(payoutForm.videosDeliveredCount) || 1;
    const rate = Number(payoutForm.ratePerVideo) || 4500;

    addCreatorPayout({
      ...payoutForm,
      creatorName: selCreator?.name || 'Creator',
      upiId: selCreator?.upiId || payoutForm.upiId,
      amount: count * rate,
      videosDeliveredCount: count,
      ratePerVideo: rate
    });
    setIsAddModalOpen(false);
  };

  const handleStatusChange = (payoutId, newStatus) => {
    updateCreatorPayoutStatus(payoutId, newStatus);
    notify({
      title: 'Payout Status Updated',
      message: `Creator settlement marked as ${newStatus}`,
      type: 'success'
    });
  };

  const pendingPayoutsTotal = creatorPayouts
    .filter(p => p.status === 'Pending' || p.status === 'Approved')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Talent Disbursements
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-500 font-medium">Commercial Settling</span>
          </div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Creator Payouts & Settlements
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Clear creator commercial dues, verify completed shoot reels, and execute UPI / NEFT bank payouts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Create Payout Batch</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200">
          <span className="text-xs font-bold text-stone-400 uppercase">Total Settled to Creators</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">₹{totalCreatorPayouts.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-stone-400">Paid via direct bank/UPI</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-stone-200">
          <span className="text-xs font-bold text-stone-400 uppercase">Pending Creator Dues</span>
          <p className="text-2xl font-black text-amber-600 mt-1">₹{pendingPayoutsTotal.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-stone-400">Awaiting raw footage review / approval</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-stone-200">
          <span className="text-xs font-bold text-stone-400 uppercase">Active Talent Invoices</span>
          <p className="text-2xl font-black text-stone-900 mt-1">{creatorPayouts.length}</p>
          <span className="text-[11px] text-stone-400">Across 6 onboarded UGC creators</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search creator, shoot title, UPI handle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 rounded-xl bg-stone-50/70 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
          {['All', 'Pending', 'Approved', 'Paid'].map(st => (
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

      {/* Payouts Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Creator</th>
                <th className="p-4">Shoot Campaign</th>
                <th className="p-4">Videos Shot</th>
                <th className="p-4">Rate / Video</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">UPI / Bank ID</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Disbursement Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredPayouts.map(p => (
                <tr key={p.id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-stone-900">{p.creatorName}</p>
                    <p className="text-[11px] text-stone-400">Verified UGC Partner</p>
                  </td>
                  <td className="p-4 font-semibold text-stone-800">
                    {p.shootTitle}
                  </td>
                  <td className="p-4 font-mono font-bold text-stone-900">
                    {p.videosDeliveredCount} Reels
                  </td>
                  <td className="p-4 text-stone-600">
                    ₹{(p.ratePerVideo || 0).toLocaleString('en-IN')}
                  </td>
                  <td className="p-4 font-extrabold text-stone-900">
                    ₹{(p.amount || 0).toLocaleString('en-IN')}
                  </td>
                  <td className="p-4 font-mono text-[11px] text-stone-600">
                    {p.upiId}
                  </td>
                  <td className="p-4">
                    <Badge status={p.status} size="xs" />
                  </td>
                  <td className="p-4 text-right">
                    <select
                      value={p.status}
                      onChange={(e) => handleStatusChange(p.id, e.target.value)}
                      className="px-2.5 py-1 text-xs font-semibold bg-stone-50 border border-stone-300 rounded-lg cursor-pointer"
                    >
                      <option>Pending</option>
                      <option>Approved</option>
                      <option>Paid</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Payout Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsAddModalOpen(false)}
          title="Create Creator Settlement Entry"
        >
          <form onSubmit={handleCreatePayout} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Creator *</label>
                <select
                  value={payoutForm.creatorId}
                  onChange={(e) => {
                    const sel = creators.find(c => c.id === e.target.value);
                    setPayoutForm({
                      ...payoutForm,
                      creatorId: e.target.value,
                      ratePerVideo: sel?.ratePerVideo || 4500,
                      upiId: sel?.upiId || 'creator@upi'
                    });
                  }}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
                >
                  {creators.map(cr => (
                    <option key={cr.id} value={cr.id}>{cr.name} ({cr.location})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Shoot Campaign *</label>
                <input
                  type="text"
                  required
                  value={payoutForm.shootTitle}
                  onChange={(e) => setPayoutForm({ ...payoutForm, shootTitle: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Videos Shot Count *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={payoutForm.videosDeliveredCount}
                  onChange={(e) => setPayoutForm({ ...payoutForm, videosDeliveredCount: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Rate Per Video (₹)</label>
                <input
                  type="number"
                  required
                  value={payoutForm.ratePerVideo}
                  onChange={(e) => setPayoutForm({ ...payoutForm, ratePerVideo: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Creator UPI / Bank Account Reference</label>
              <input
                type="text"
                required
                value={payoutForm.upiId}
                onChange={(e) => setPayoutForm({ ...payoutForm, upiId: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg font-mono"
              />
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
              <span>Total Payout to Creator:</span>
              <span className="font-extrabold text-sm">
                ₹{(Number(payoutForm.videosDeliveredCount || 1) * Number(payoutForm.ratePerVideo || 4500)).toLocaleString('en-IN')}
              </span>
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
                Create Settlement
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
