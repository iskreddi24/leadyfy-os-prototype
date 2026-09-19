import React from 'react';
import {
  TrendingUp,
  BarChart3,
  DollarSign,
  Film,
  Users,
  Award,
  Calendar,
  CheckCircle,
  Percent
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import ProgressBar from '../components/common/ProgressBar';

export default function Reports() {
  const {
    orders,
    videos,
    clients,
    creators,
    totalRevenue,
    totalExpenses,
    totalCreatorPayouts,
    netProfit,
    profitMargin
  } = useApp();

  const totalContractedVideos = orders.reduce((sum, o) => sum + (o.contractedVideoCount || 0), 0);
  const deliveredVideos = videos.filter(v => v.stage === 'Delivered').length;
  const deliveryFulfillmentRate = totalContractedVideos > 0 ? Math.round((deliveredVideos / totalContractedVideos) * 100) : 0;

  // Video pipeline breakdown
  const stageCounts = {
    'Scripting & Pre-Prod': videos.filter(v => ['Script Approved', 'Shoot Pending'].includes(v.stage)).length,
    'Footage & Editing': videos.filter(v => ['Raw Footage Received', 'Video Editing'].includes(v.stage)).length,
    'Review & QA': videos.filter(v => ['Internal QA', 'Client Review', 'Revision'].includes(v.stage)).length,
    'Approved & Delivered': videos.filter(v => ['Final Approved', 'Delivered'].includes(v.stage)).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Agency Intelligence
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-500 font-medium">Financial & Operational Analytics</span>
          </div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Agency Performance & Unit Economics
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time breakdown of revenue realization, talent costs, net agency margins, and production efficiency.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-stone-100 text-stone-700 text-xs font-bold rounded-xl flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Q1 2026 Fiscal Cycle</span>
          </span>
        </div>
      </div>

      {/* Core Unit Economics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase">Gross Realized Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-stone-900 mt-2">₹{totalRevenue.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-emerald-600 font-semibold">+28% vs last quarter</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase">Net Operating Profit</span>
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-amber-600 mt-2">₹{netProfit.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-stone-500 font-medium">After creator fees & overhead</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase">Agency Net Margin</span>
            <Percent className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-indigo-600 mt-2">{profitMargin}%</p>
          <span className="text-[11px] text-emerald-600 font-semibold">Healthy SaaS/Agency benchmark</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase">Reel Delivery Quota</span>
            <Film className="w-4 h-4 text-stone-900" />
          </div>
          <p className="text-2xl font-black text-stone-900 mt-2">{deliveredVideos} / {totalContractedVideos}</p>
          <span className="text-[11px] text-stone-500 font-medium">{deliveryFulfillmentRate}% contracted fulfillment</span>
        </div>
      </div>

      {/* Financial Health Comparison Bar Chart */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-stone-900">Capital Flow & Margin Realization</h3>
            <p className="text-xs text-stone-500">Visual comparison of revenue, overhead expenses, talent payouts, and net profits</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-bold text-stone-700 mb-1">
              <span>Gross Client Revenue Realized</span>
              <span className="text-emerald-600 font-extrabold">₹{totalRevenue.toLocaleString('en-IN')} (100%)</span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-4 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full w-full"></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-stone-700 mb-1">
              <span>Agency Operational Overhead (Studios, Staff, SaaS)</span>
              <span className="text-stone-800 font-extrabold">₹{totalExpenses.toLocaleString('en-IN')} ({Math.round((totalExpenses / (totalRevenue || 1)) * 100)}%)</span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-4 overflow-hidden">
              <div
                className="bg-stone-800 h-full rounded-full"
                style={{ width: `${Math.min(100, Math.round((totalExpenses / (totalRevenue || 1)) * 100))}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-stone-700 mb-1">
              <span>UGC Creator & Actor Disbursements</span>
              <span className="text-amber-700 font-extrabold">₹{totalCreatorPayouts.toLocaleString('en-IN')} ({Math.round((totalCreatorPayouts / (totalRevenue || 1)) * 100)}%)</span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-4 overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full"
                style={{ width: `${Math.min(100, Math.round((totalCreatorPayouts / (totalRevenue || 1)) * 100))}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-stone-700 mb-1">
              <span>Net Agency Retained Profit</span>
              <span className="text-amber-600 font-extrabold">₹{netProfit.toLocaleString('en-IN')} ({profitMargin}%)</span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-4 overflow-hidden">
              <div
                className="bg-amber-600 h-full rounded-full"
                style={{ width: `${Math.min(100, profitMargin)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Production Volume & Client Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Production Stage Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-stone-900">Active Production Pipeline Volume</h3>
          <div className="space-y-3">
            {Object.entries(stageCounts).map(([stageName, count]) => (
              <div key={stageName} className="p-3 bg-stone-50 rounded-xl border border-stone-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-stone-800">{stageName}</h4>
                  <span className="text-[11px] text-stone-400">Current work-in-progress</span>
                </div>
                <span className="px-3 py-1 bg-white border border-stone-200 rounded-lg font-black text-sm text-stone-900">
                  {count} Videos
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Client Revenue Leaderboard */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-stone-900">Client Revenue Realization</h3>
          <div className="space-y-3">
            {clients.map(c => {
              const clientOrders = orders.filter(o => o.clientId === c.id);
              const val = clientOrders.reduce((sum, o) => sum + (o.totalInvoiceAmount || 0), 0);

              return (
                <div key={c.id} className="p-3 bg-stone-50 rounded-xl border border-stone-100 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-stone-800">{c.companyName || c.clientName}</h4>
                    <span className="text-[11px] text-stone-400">{c.brandNiche} • {c.packageTier}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-extrabold text-stone-900">₹{val.toLocaleString('en-IN')}</p>
                    <span className="text-[10px] text-emerald-600 font-bold">Active Sprint</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
