import React, { useState, useMemo } from 'react';
import {
  Receipt,
  Plus,
  Search,
  Tag,
  Calendar,
  CreditCard,
  Building,
  TrendingDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Modal from '../components/common/Modal';

export default function Expenses() {
  const { expenses, addExpense, totalExpenses } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [expenseForm, setExpenseForm] = useState({
    title: '',
    category: 'Studio Rentals',
    amount: 15000,
    paidTo: '',
    paymentMethod: 'Bank Transfer',
    date: new Date().toISOString().slice(0, 10),
    notes: ''
  });

  const categories = [
    'All',
    'Salaries & Retainers',
    'Office Rent & Utilities',
    'Studio Rentals',
    'Equipment & Gear',
    'Fuel & Conveyance',
    'Creator Payouts',
    'Software & SaaS Tools'
  ];

  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => {
      const matchesSearch =
        e.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.paidTo?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = categoryFilter === 'All' || e.category === categoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [expenses, searchQuery, categoryFilter]);

  const handleCreateExpense = (e) => {
    e.preventDefault();
    addExpense({
      ...expenseForm,
      amount: Number(expenseForm.amount) || 0
    });
    setIsAddModalOpen(false);
    setExpenseForm({
      title: '',
      category: 'Studio Rentals',
      amount: 15000,
      paidTo: '',
      paymentMethod: 'Bank Transfer',
      date: new Date().toISOString().slice(0, 10),
      notes: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
              Cash Outflow
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-500 font-medium">Agency Overhead</span>
          </div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Agency Operating Expenses
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Log studio rentals, camera equipment, full-time staff salaries, SaaS toolings, and logistical overhead.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Log Expense</span>
          </button>
        </div>
      </div>

      {/* Expense Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200">
          <span className="text-xs font-bold text-stone-400 uppercase">Total Operational Burn</span>
          <p className="text-2xl font-black text-stone-900 mt-1">₹{totalExpenses.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-stone-400">Total recorded expenses this cycle</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-stone-200">
          <span className="text-xs font-bold text-stone-400 uppercase">Expense Items</span>
          <p className="text-2xl font-black text-stone-900 mt-1">{expenses.length}</p>
          <span className="text-[11px] text-stone-400">Ledger transactions logged</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-stone-200">
          <span className="text-xs font-bold text-stone-400 uppercase">Active Cost Centers</span>
          <p className="text-2xl font-black text-rose-600 mt-1">6 Centers</p>
          <span className="text-[11px] text-stone-400">Studios, Gear, Payroll, Travel</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search expense description, vendor, payee..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 rounded-xl bg-stone-50/70 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
          {categories.slice(0, 5).map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                categoryFilter === cat ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Expense Description</th>
                <th className="p-4">Category</th>
                <th className="p-4">Paid To (Vendor)</th>
                <th className="p-4">Date</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredExpenses.map(e => (
                <tr key={e.id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-stone-900">{e.title}</p>
                    {e.notes && <p className="text-[11px] text-stone-400 mt-0.5">{e.notes}</p>}
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-stone-100 text-stone-700">
                      {e.category}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-stone-800">
                    {e.paidTo}
                  </td>
                  <td className="p-4 text-stone-600">
                    {e.date}
                  </td>
                  <td className="p-4 text-stone-500">
                    {e.paymentMethod}
                  </td>
                  <td className="p-4 text-right font-extrabold text-stone-900">
                    ₹{(e.amount || 0).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsAddModalOpen(false)}
          title="Record Operating Expense"
        >
          <form onSubmit={handleCreateExpense} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Expense Description *</label>
              <input
                type="text"
                required
                placeholder="e.g. Studio 4B Bandra Day Booking (BoldFit shoot)"
                value={expenseForm.title}
                onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Category</label>
                <select
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
                >
                  {categories.filter(c => c !== 'All').map(cat => (
                    <option key={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Amount (INR ₹) *</label>
                <input
                  type="number"
                  required
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Paid To / Vendor</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bandra Film Studio Works"
                  value={expenseForm.paidTo}
                  onChange={(e) => setExpenseForm({ ...expenseForm, paidTo: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={expenseForm.date}
                  onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
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
                className="px-4 py-2 text-xs font-bold text-white bg-stone-900 hover:bg-black rounded-lg cursor-pointer shadow-xs"
              >
                Record Expense
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
