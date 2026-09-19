import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Badge from '../components/common/Badge';
import ProgressBar from '../components/common/ProgressBar';

export default function Orders() {
  const { orders, clients, videos } = useApp();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch =
        order.packageName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.clientName?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All' || order.orderStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  // Aggregate stats
  const totalPackagesValue = orders.reduce((sum, o) => sum + (o.totalInvoiceAmount || 0), 0);
  const totalCollected = orders.reduce((sum, o) => sum + (o.amountReceived || 0), 0);
  const totalBalance = orders.reduce((sum, o) => sum + (o.outstandingBalance || 0), 0);
  const totalVideosOrdered = orders.reduce((sum, o) => sum + (o.contractedVideoCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Contract Fulfillment
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-500 font-medium">Sprint Deliverables</span>
          </div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Client Packages & Orders
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Track contracted video counts, advance milestones, GST invoices, and production sprint timelines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/orders/new')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Create Package Order</span>
          </button>
        </div>
      </div>

      {/* Financial Snapshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-xs font-bold text-stone-500 uppercase">Total Contract Value</span>
          <p className="text-xl font-extrabold text-stone-900 mt-1">₹{totalPackagesValue.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-stone-400">Across {orders.length} packages</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-xs font-bold text-stone-500 uppercase">Advance Collected</span>
          <p className="text-xl font-extrabold text-emerald-600 mt-1">₹{totalCollected.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-stone-400">Cash received in bank</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-xs font-bold text-stone-500 uppercase">Outstanding Balance</span>
          <p className="text-xl font-extrabold text-amber-600 mt-1">₹{totalBalance.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-stone-400">Due on delivery sign-off</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-xs font-bold text-stone-500 uppercase">Total Video Deliverables</span>
          <p className="text-xl font-extrabold text-stone-900 mt-1">{totalVideosOrdered} Reels</p>
          <span className="text-[11px] text-stone-400">Contracted UGC volume</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search package, client, brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 rounded-xl bg-stone-50/70 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
          {['All', 'In Production', 'Onboarding', 'Partially Delivered', 'Completed'].map(st => (
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

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredOrders.map(order => {
          // Delivered videos for this order
          const orderVideos = videos.filter(v => v.orderId === order.id);
          const deliveredCount = orderVideos.filter(v => v.stage === 'Delivered').length;

          return (
            <div
              key={order.id}
              onClick={() => navigate(`/orders/${order.id}`)}
              className="bg-white rounded-2xl p-5 border border-stone-200/80 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
                      {order.companyName}
                    </span>
                    <h3 className="text-base font-bold text-stone-900 group-hover:text-amber-600 transition-colors">
                      {order.packageName}
                    </h3>
                  </div>
                  <Badge status={order.orderStatus} size="xs" />
                </div>

                {/* Quota Progress */}
                <div className="mt-4">
                  <ProgressBar
                    value={deliveredCount}
                    max={order.contractedVideoCount}
                    label={`Reel Delivery Fulfillment: ${deliveredCount} of ${order.contractedVideoCount} Delivered`}
                    color="amber"
                  />
                </div>

                {/* Financial Details */}
                <div className="mt-4 grid grid-cols-3 gap-2 p-3 rounded-xl bg-stone-50 border border-stone-100 text-center">
                  <div>
                    <span className="text-[10px] text-stone-400 font-semibold uppercase">Total Invoice</span>
                    <p className="text-xs font-extrabold text-stone-900 mt-0.5">
                      ₹{(order.totalInvoiceAmount || 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 font-semibold uppercase">Advance Paid</span>
                    <p className="text-xs font-extrabold text-emerald-600 mt-0.5">
                      ₹{(order.amountReceived || 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 font-semibold uppercase">Balance Due</span>
                    <p className="text-xs font-extrabold text-amber-600 mt-0.5">
                      ₹{(order.outstandingBalance || 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-stone-500">
                  <span>Sprint Team: <strong>{order.assignedTeam}</strong></span>
                  <span>Due: <strong>{order.dueDate}</strong></span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-amber-600 group-hover:text-amber-700">
                <span>View Order Details & Quota Breakdown</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
