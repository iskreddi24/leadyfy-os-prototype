import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Package,
  FileText,
  Camera,
  Film,
  CheckCircle2,
  Clock,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  DollarSign,
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import StatCard from '../components/common/StatCard';
import Badge from '../components/common/Badge';
import ProgressBar from '../components/common/ProgressBar';
import PipelineTracker from '../components/common/PipelineTracker';
import ClientPortal from './ClientPortal';

export default function Dashboard() {
  const {
    role,
    clients,
    orders,
    scripts,
    shoots,
    videos,
    tasks,
    payments,
    expenses,
    creatorPayouts,
    totalRevenue,
    totalExpenses,
    totalCreatorPayouts,
    estimatedNetProfit,
    totalReceivables,
    toggleTaskStatus,
    updateVideoStage,
    updateScriptStatus
  } = useApp();

  const navigate = useNavigate();

  // If role is Client, render the Client Portal view
  if (role === 'client') {
    return <ClientPortal />;
  }

  // Calculate Operational Metrics
  const activeClients = clients.filter(c => c.status === 'Active').length;
  const newClientsThisMonth = clients.filter(c => c.status === 'New' || c.status === 'Onboarding').length;
  const activeOrders = orders.filter(o => o.orderStatus === 'In Production' || o.orderStatus === 'Onboarding').length;
  const pendingScripts = scripts.filter(s => s.status === 'In Review' || s.status === 'Sent to Client' || s.status === 'Draft').length;
  const upcomingShoots = shoots.filter(s => s.shootStatus === 'Scheduled' || s.shootStatus === 'Confirmed').length;
  const videosInProduction = videos.filter(v => v.stage !== 'Delivered').length;
  const pendingApprovals = videos.filter(v => v.stage === 'Client Review' || v.stage === 'Internal QA').length;
  const videosDelivered = videos.filter(v => v.stage === 'Delivered').length;

  const pendingInvoices = payments.filter(p => p.status === 'Unpaid' || p.status === 'Overdue' || p.status === 'Partially Paid').length;

  // Today's Shoots & Urgent Items
  const todayShoots = shoots.filter(s => s.shootStatus === 'In Progress' || s.shootStatus === 'Confirmed' || s.shootStatus === 'Scheduled').slice(0, 3);
  const urgentTasks = tasks.filter(t => t.priority === 'Urgent' && t.status !== 'Done').slice(0, 4);
  const pendingScriptApprovals = scripts.filter(s => s.status === 'Sent to Client' || s.status === 'In Review').slice(0, 4);
  const pendingVideoReviews = videos.filter(v => v.stage === 'Client Review' || v.stage === 'Revision').slice(0, 4);

  // Pipeline stage breakdown counts
  const pipelineStages = [
    { label: 'Scripts', count: scripts.filter(s => s.status === 'Approved' || s.status === 'Ready for Shoot').length, color: 'bg-stone-800' },
    { label: 'Shoots', count: shoots.filter(s => s.shootStatus === 'Confirmed' || s.shootStatus === 'In Progress').length, color: 'bg-amber-600' },
    { label: 'Editing', count: videos.filter(v => v.stage === 'Video Editing').length, color: 'bg-indigo-600' },
    { label: 'QA', count: videos.filter(v => v.stage === 'Internal QA').length, color: 'bg-purple-600' },
    { label: 'Client Review', count: videos.filter(v => v.stage === 'Client Review').length, color: 'bg-amber-500' },
    { label: 'Revision', count: videos.filter(v => v.stage === 'Revision').length, color: 'bg-rose-500' },
    { label: 'Approved', count: videos.filter(v => v.stage === 'Final Approved').length, color: 'bg-teal-600' },
    { label: 'Delivered', count: videos.filter(v => v.stage === 'Delivered').length, color: 'bg-emerald-600' }
  ];

  return (
    <div className="space-y-6">
      {/* Executive Welcome & Demo Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Agency Operations HQ
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs font-medium text-stone-500">Live Pulse</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-stone-900">
            {role === 'owner' ? 'Executive Dashboard' : role === 'admin' ? 'Operations Control Center' : 'Team Production Hub'}
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time throughput for UGC videos, shoot logistics, client reviews, and creator settlements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/videos')}
            className="px-4 py-2 bg-stone-900 hover:bg-black text-amber-400 text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Film className="w-4 h-4" />
            <span>Open Kanban Board</span>
          </button>
        </div>
      </div>

      {/* Complete Operational Lifecycle Flow Banner */}
      <PipelineTracker
        activeStageId="editing"
        onSelectStage={(stage) => navigate(stage.route)}
      />

      {/* Production Pipeline Volume Bar */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-stone-900">
              Production Velocity Pipeline
            </h3>
            <p className="text-xs text-stone-500">
              Live volume of video deliverables across linear operational checkpoints
            </p>
          </div>
          <button
            onClick={() => navigate('/videos')}
            className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({videos.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {pipelineStages.map((stg, i) => (
            <div
              key={i}
              onClick={() => navigate('/videos')}
              className="p-3 rounded-xl bg-stone-50 hover:bg-amber-50/60 border border-stone-200/70 hover:border-amber-200 transition-all cursor-pointer text-center group"
            >
              <div className="text-2xl font-black text-stone-900 group-hover:text-amber-600 transition-colors">
                {stg.count}
              </div>
              <div className="text-[11px] font-semibold text-stone-600 mt-1 truncate">
                {stg.label}
              </div>
              <div className="w-full bg-stone-200 h-1 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full ${stg.color}`}
                  style={{ width: `${Math.min(100, Math.max(15, stg.count * 15))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Executive Key Performance Indicators (KPIs) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Production Volumes & Active Deliverables
          </h2>
          <span className="text-xs text-stone-400 font-medium">Synced with localStorage</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3.5">
          <StatCard
            title="Total Active Clients"
            value={activeClients}
            subtext={`${newClientsThisMonth} new onboarding`}
            icon={Users}
            trend="+12% MoM"
            color="amber"
            onClick={() => navigate('/clients')}
          />
          <StatCard
            title="Active Orders"
            value={activeOrders}
            subtext={`${orders.length} lifetime packages`}
            icon={Package}
            trend="+2 this week"
            color="emerald"
            onClick={() => navigate('/orders')}
          />
          <StatCard
            title="Videos In Production"
            value={videosInProduction}
            subtext="Active in editing & QA"
            icon={Film}
            color="purple"
            badge="Live"
            onClick={() => navigate('/videos')}
          />
          <StatCard
            title="Videos Delivered"
            value={videosDelivered}
            subtext="Client sign-off complete"
            icon={CheckCircle2}
            trend="+5 delivered"
            color="emerald"
            onClick={() => navigate('/videos')}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3.5">
          <StatCard
            title="Pending Scripts"
            value={pendingScripts}
            subtext="Client or internal review"
            icon={FileText}
            color="blue"
            onClick={() => navigate('/scripts')}
          />
          <StatCard
            title="Upcoming Shoots"
            value={upcomingShoots}
            subtext="Scheduled across 4 cities"
            icon={Camera}
            color="amber"
            onClick={() => navigate('/shoots')}
          />
          <StatCard
            title="Pending Approvals"
            value={pendingApprovals}
            subtext="Awaiting client sign-off"
            icon={Clock}
            trend="Action Required"
            color="rose"
            onClick={() => navigate('/videos')}
          />
          <StatCard
            title="Overdue / Urgent Tasks"
            value={urgentTasks.length}
            subtext="Requires immediate focus"
            icon={AlertTriangle}
            color="rose"
            onClick={() => navigate('/tasks')}
          />
        </div>
      </div>

      {/* Financial Overview (Visible for Owner & Admin) */}
      {(role === 'owner' || role === 'admin') && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Financial Summary & Margins (INR ₹)
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-stone-900 text-amber-400 font-bold">
                {role === 'owner' ? 'Full Ledger' : 'Admin View'}
              </span>
            </div>
            <button
              onClick={() => navigate('/payments')}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 cursor-pointer"
            >
              View Ledgers →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
              <span className="text-[11px] font-semibold text-stone-500 uppercase">Total Revenue</span>
              <p className="text-lg sm:text-xl font-extrabold text-stone-900 mt-1">
                ₹{totalRevenue.toLocaleString('en-IN')}
              </p>
              <span className="text-[10px] text-emerald-600 font-semibold">Inbound Collected</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
              <span className="text-[11px] font-semibold text-stone-500 uppercase">Receivables</span>
              <p className="text-lg sm:text-xl font-extrabold text-amber-600 mt-1">
                ₹{totalReceivables.toLocaleString('en-IN')}
              </p>
              <span className="text-[10px] text-stone-500 font-medium">Pending balance</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
              <span className="text-[11px] font-semibold text-stone-500 uppercase">Expenses</span>
              <p className="text-lg sm:text-xl font-extrabold text-stone-900 mt-1">
                ₹{totalExpenses.toLocaleString('en-IN')}
              </p>
              <span className="text-[10px] text-stone-500 font-medium">Salaries & studio gear</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
              <span className="text-[11px] font-semibold text-stone-500 uppercase">Creator Payouts</span>
              <p className="text-lg sm:text-xl font-extrabold text-stone-900 mt-1">
                ₹{totalCreatorPayouts.toLocaleString('en-IN')}
              </p>
              <span className="text-[10px] text-stone-500 font-medium">Settled creator fees</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
              <span className="text-[11px] font-semibold text-stone-500 uppercase">Pending Invoices</span>
              <p className="text-lg sm:text-xl font-extrabold text-rose-600 mt-1">
                {pendingInvoices}
              </p>
              <span className="text-[10px] text-stone-500 font-medium">Unsettled tranches</span>
            </div>

            <div className="bg-stone-900 p-4 rounded-xl border border-stone-800 shadow-2xs text-white">
              <span className="text-[11px] font-semibold text-amber-400 uppercase">Net Profit</span>
              <p className="text-lg sm:text-xl font-extrabold text-white mt-1">
                ₹{estimatedNetProfit.toLocaleString('en-IN')}
              </p>
              <span className="text-[10px] text-stone-400 font-medium">Revenue - Costs</span>
            </div>
          </div>
        </div>
      )}

      {/* Operational Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Widget 1: Today's Shoots & Logistics */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600">
                <Calendar className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-stone-900">Today & Upcoming Shoots</h3>
            </div>
            <button
              onClick={() => navigate('/shoots')}
              className="text-xs text-amber-600 hover:text-amber-700 font-semibold cursor-pointer"
            >
              All Shoots →
            </button>
          </div>

          <div className="space-y-3 flex-1">
            {todayShoots.length === 0 ? (
              <p className="text-xs text-stone-400 text-center py-6">No scheduled shoots today.</p>
            ) : (
              todayShoots.map((sh) => (
                <div
                  key={sh.id}
                  onClick={() => navigate('/shoots')}
                  className="p-3 rounded-xl bg-stone-50 hover:bg-amber-50/40 border border-stone-200/60 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-stone-900 line-clamp-1">
                      {sh.title}
                    </h4>
                    <Badge status={sh.shootStatus} size="xs" />
                  </div>
                  <div className="mt-2 text-[11px] text-stone-600 space-y-0.5">
                    <p><strong>Creator:</strong> {sh.creatorName} • <strong>Location:</strong> {sh.location}</p>
                    <p className="text-stone-500"><strong>Time:</strong> {sh.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Widget 2: Pending Client Video Reviews (Bottlenecks) */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600">
                <Clock className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-stone-900">Pending Reviews & Revisions</h3>
            </div>
            <button
              onClick={() => navigate('/videos')}
              className="text-xs text-amber-600 hover:text-amber-700 font-semibold cursor-pointer"
            >
              Review Pipeline →
            </button>
          </div>

          <div className="space-y-3 flex-1">
            {pendingVideoReviews.length === 0 ? (
              <p className="text-xs text-stone-400 text-center py-6">No pending video reviews.</p>
            ) : (
              pendingVideoReviews.map((vid) => (
                <div
                  key={vid.id}
                  onClick={() => navigate('/videos')}
                  className="p-3 rounded-xl bg-stone-50 hover:bg-amber-50/40 border border-stone-200/60 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-amber-700">
                        {vid.videoNumber}
                      </span>
                      <h4 className="text-xs font-bold text-stone-900 line-clamp-1">
                        {vid.title}
                      </h4>
                    </div>
                    <Badge status={vid.stage} size="xs" />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[11px] text-stone-500">
                    <span>{vid.clientName}</span>
                    <span className="font-semibold text-rose-600">Rev #{vid.revisionCount}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Widget 3: Urgent Tasks & Actions */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-stone-900">Urgent Operations Queue</h3>
            </div>
            <button
              onClick={() => navigate('/tasks')}
              className="text-xs text-amber-600 hover:text-amber-700 font-semibold cursor-pointer"
            >
              Task Board →
            </button>
          </div>

          <div className="space-y-2.5 flex-1">
            {urgentTasks.map((t) => (
              <div
                key={t.id}
                className="flex items-start gap-2.5 p-2.5 rounded-xl bg-stone-50 hover:bg-stone-100/80 border border-stone-200/60 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={t.status === 'Done'}
                  onChange={() => toggleTaskStatus(t.id)}
                  className="mt-1 rounded-sm border-stone-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold text-stone-900 leading-snug ${t.status === 'Done' ? 'line-through text-stone-400' : ''}`}>
                    {t.task}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-stone-500">
                    <span>Assignee: {t.assignee}</span>
                    <span>•</span>
                    <span className="text-rose-600 font-bold">Due: {t.deadline}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
