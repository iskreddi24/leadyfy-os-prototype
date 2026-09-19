import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  Plus,
  Mail,
  Phone,
  Building,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  Tag
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Badge from '../components/common/Badge';

export default function Clients() {
  const { clients, orders, videos, role } = useApp();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [industryFilter, setIndustryFilter] = useState('All');

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesSearch =
        client.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.brandName?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All' || client.status === statusFilter;
      const matchesIndustry = industryFilter === 'All' || client.industry === industryFilter;

      return matchesSearch && matchesStatus && matchesIndustry;
    });
  }, [clients, searchQuery, statusFilter, industryFilter]);

  const industries = ['All', 'Health & Wellness', 'Fitness & Supplements', 'Food & Beverage', 'Fashion & D2C Apparel', 'Personal Care & Beauty'];
  const statuses = ['All', 'Lead', 'New', 'Onboarding', 'Active', 'On Hold', 'Completed'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Account Management
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-500 font-medium">CRM Records</span>
          </div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Clients & Brand Accounts
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Centralized registry for D2C brands, onboarding status, and dedicated account managers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/clients/new')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Brand Client</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search company, contact, brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 rounded-xl bg-stone-50/70 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
            {statuses.slice(0, 5).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  statusFilter === st
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <select
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            className="text-xs font-medium text-stone-700 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:outline-hidden cursor-pointer"
          >
            {industries.map(ind => (
              <option key={ind} value={ind}>{ind === 'All' ? 'All Industries' : ind}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.length === 0 ? (
          <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-stone-200 text-stone-400 text-xs">
            No clients match the specified search or filter criteria.
          </div>
        ) : (
          filteredClients.map((client) => {
            // Associated Orders & Videos
            const clientOrders = orders.filter(o => o.clientId === client.id);
            const totalVideos = clientOrders.reduce((sum, o) => sum + (o.contractedVideoCount || 0), 0);
            const clientVideos = videos.filter(v => v.clientId === client.id);
            const delivered = clientVideos.filter(v => v.stage === 'Delivered').length;

            return (
              <div
                key={client.id}
                onClick={() => navigate(`/clients/${client.id}`)}
                className="bg-white rounded-2xl p-5 border border-stone-200/80 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-base font-bold text-stone-900 truncate group-hover:text-amber-600 transition-colors">
                          {client.companyName}
                        </h3>
                      </div>
                      <p className="text-xs font-medium text-stone-500 mt-0.5">
                        Brand: <span className="text-stone-700">{client.brandName || client.clientName}</span>
                      </p>
                    </div>
                    <Badge status={client.status} size="xs" />
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 space-y-2 text-xs text-stone-600">
                    <div className="flex items-center justify-between">
                      <span className="text-stone-400 font-medium">Contact Person:</span>
                      <span className="font-semibold text-stone-800">{client.clientName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-stone-400 font-medium">Industry:</span>
                      <span className="font-medium text-stone-700">{client.industry}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-stone-400 font-medium">Account Lead:</span>
                      <span className="font-medium text-stone-700">{client.assignedEmployee}</span>
                    </div>
                  </div>

                  {/* Quota Progress */}
                  <div className="mt-4 p-3 bg-stone-50 rounded-xl border border-stone-100">
                    <div className="flex items-center justify-between text-xs font-semibold text-stone-700 mb-1.5">
                      <span>Video Production Quota</span>
                      <span>{delivered} / {totalVideos || 0} Delivered</span>
                    </div>
                    <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${totalVideos ? Math.min(100, Math.round((delivered / totalVideos) * 100)) : 0}%`
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-amber-600 group-hover:text-amber-700">
                  <span>View Full Profile & History</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
