import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileSpreadsheet,
  ArrowDownLeft
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';

export default function Payments() {
  const {
    payments,
    clients,
    orders,
    addPayment,
    updatePaymentStatus,
    totalRevenue,
    totalReceivables,
    notify
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [paymentForm, setPaymentForm] = useState({
    invoiceNumber: `INV-2026-${Math.floor(100 + Math.random() * 899)}`,
    clientId: clients[0]?.id || '',
    packageName: 'Scale 15x UGC Video Sprint',
    totalAmount: 212400,
    amountPaid: 100000,
    balance: 112400,
    dueDate: '2026-04-10',
    status: 'Partially Paid',
    paymentMethod: 'Bank Transfer (NEFT/RTGS)'
  });

  const filteredPayments = useMemo(() => {
    return payments.filter(p => {
      const matchesSearch =
        p.invoiceNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.packageName?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [payments, searchQuery, statusFilter]);

  const handleCreatePayment = (e) => {
    e.preventDefault();
    const selClient = clients.find(c => c.id === paymentForm.clientId);
    const total = Number(paymentForm.totalAmount) || 0;
    const paid = Number(paymentForm.amountPaid) || 0;

    addPayment({
      ...paymentForm,
      clientName: selClient?.companyName || selClient?.clientName || 'Client',
      totalAmount: total,
      amountPaid: paid,
      balance: Math.max(0, total - paid),
      paidDate: paid > 0 ? new Date().toISOString().slice(0, 10) : null
    });
    setIsAddModalOpen(false);
  };

  const handleStatusChange = (paymentId, newStatus) => {
    updatePaymentStatus(paymentId, newStatus);
    notify({
      title: 'Invoice Status Updated',
      message: `Invoice marked as ${newStatus}`,
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
              Agency Accounts
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-500 font-medium">Receivables & Invoicing</span>
          </div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Client Invoices & Billing
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Monitor client billing tranches, advance milestone collections, and overdue receivables.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Generate Invoice</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200">
          <span className="text-xs font-bold text-stone-500 uppercase">Total Collected Revenue</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">₹{totalRevenue.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-stone-400">Total cleared advance and milestones</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-stone-200">
          <span className="text-xs font-bold text-stone-500 uppercase">Outstanding Receivables</span>
          <p className="text-2xl font-black text-amber-600 mt-1">₹{totalReceivables.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-stone-400">Pending final delivery clearance</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-stone-200">
          <span className="text-xs font-bold text-stone-500 uppercase">Active Invoices</span>
          <p className="text-2xl font-black text-stone-900 mt-1">{payments.length}</p>
          <span className="text-[11px] text-stone-400">Issued for UGC video packages</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search invoice number, client, package..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 rounded-xl bg-stone-50/70 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
          {['All', 'Paid', 'Partially Paid', 'Unpaid', 'Overdue'].map(st => (
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

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Invoice #</th>
                <th className="p-4">Client & Package</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Paid</th>
                <th className="p-4">Balance</th>
                <th className="p-4">Due Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredPayments.map(p => (
                <tr key={p.id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="p-4 font-mono font-bold text-stone-900">
                    {p.invoiceNumber}
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-stone-900">{p.clientName}</p>
                    <p className="text-[11px] text-stone-500">{p.packageName}</p>
                  </td>
                  <td className="p-4 font-bold text-stone-900">
                    ₹{(p.totalAmount || 0).toLocaleString('en-IN')}
                  </td>
                  <td className="p-4 font-bold text-emerald-600">
                    ₹{(p.amountPaid || 0).toLocaleString('en-IN')}
                  </td>
                  <td className="p-4 font-bold text-amber-600">
                    ₹{(p.balance || 0).toLocaleString('en-IN')}
                  </td>
                  <td className="p-4 text-stone-600">
                    {p.dueDate}
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
                      <option>Unpaid</option>
                      <option>Partially Paid</option>
                      <option>Paid</option>
                      <option>Overdue</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Invoice Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsAddModalOpen(false)}
          title="Generate Client Invoice / Payment Milestone"
        >
          <form onSubmit={handleCreatePayment} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Invoice Reference</label>
                <input
                  type="text"
                  required
                  value={paymentForm.invoiceNumber}
                  onChange={(e) => setPaymentForm({ ...paymentForm, invoiceNumber: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Client *</label>
                <select
                  value={paymentForm.clientId}
                  onChange={(e) => setPaymentForm({ ...paymentForm, clientId: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.companyName || c.clientName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Total Bill Amount (INR ₹) *</label>
                <input
                  type="number"
                  required
                  value={paymentForm.totalAmount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, totalAmount: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Advance Received (INR ₹)</label>
                <input
                  type="number"
                  value={paymentForm.amountPaid}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amountPaid: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Payment Method</label>
                <select
                  value={paymentForm.paymentMethod}
                  onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
                >
                  <option>Bank Transfer (NEFT/RTGS)</option>
                  <option>UPI / Corporate QR</option>
                  <option>Payment Gateway Link</option>
                  <option>Cheque</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Due Date</label>
                <input
                  type="date"
                  required
                  value={paymentForm.dueDate}
                  onChange={(e) => setPaymentForm({ ...paymentForm, dueDate: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
                />
              </div>
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
                Issue Invoice
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
