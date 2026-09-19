import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Building,
  Users,
  Shield,
  RotateCcw,
  Download,
  CheckCircle2,
  Save
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Modal from '../components/common/Modal';

export default function Settings() {
  const {
    currentRole,
    setCurrentRole,
    resetToDemoData,
    requestConfirm,
    notify,
    employees
  } = useApp();

  const [agencyProfile, setAgencyProfile] = useState({
    agencyName: 'Leadyfy Media & UGC Studio',
    tagline: 'Leading D2C & Brand UGC Video Production Agency',
    contactEmail: 'operations@leadyfy.agency',
    contactPhone: '+91 98200 12345',
    registeredCity: 'Bandra West, Mumbai - 400050',
    gstin: '27AABCL1234F1Z8',
    defaultCurrency: 'INR (₹)',
    driveAssetRoot: 'https://drive.google.com/drive/folders/leadyfy-master-ugc'
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    notify({
      title: 'Agency Profile Saved',
      message: 'Workspace configurations updated successfully.',
      type: 'success'
    });
  };

  const handleResetData = () => {
    requestConfirm({
      title: 'Reset to Initial Prototype Demo Data?',
      message: 'This will restore all Indian clients, video pipelines, scripts, creator rosters, and invoices back to their factory demo defaults.',
      confirmText: 'Reset Demo Data',
      isDanger: true,
      onConfirm: () => {
        resetToDemoData();
      }
    });
  };

  const handleExportData = () => {
    const backup = {
      timestamp: new Date().toISOString(),
      localStorageDump: window.localStorage
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "leadyfy_os_demo_snapshot.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    notify({
      title: 'JSON Snapshot Exported',
      message: 'Demo state downloaded to local system',
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
              System Administration
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-500 font-medium">Workspace & Roles</span>
          </div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Settings & Permissions
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Configure legal agency information, role-based access matrix, team roster, and demo state reset.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetData}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Agency Profile Form */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
          <Building className="w-5 h-5 text-amber-600" />
          <h2 className="text-base font-bold text-stone-900">Agency Legal & Commercial Profile</h2>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Agency Name</label>
              <input
                type="text"
                value={agencyProfile.agencyName}
                onChange={(e) => setAgencyProfile({ ...agencyProfile, agencyName: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Tagline / Mission</label>
              <input
                type="text"
                value={agencyProfile.tagline}
                onChange={(e) => setAgencyProfile({ ...agencyProfile, tagline: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Operations Email</label>
              <input
                type="email"
                value={agencyProfile.contactEmail}
                onChange={(e) => setAgencyProfile({ ...agencyProfile, contactEmail: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Contact Phone</label>
              <input
                type="text"
                value={agencyProfile.contactPhone}
                onChange={(e) => setAgencyProfile({ ...agencyProfile, contactPhone: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Registered Studio Address</label>
              <input
                type="text"
                value={agencyProfile.registeredCity}
                onChange={(e) => setAgencyProfile({ ...agencyProfile, registeredCity: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">GSTIN (Indian Tax Reg)</label>
              <input
                type="text"
                value={agencyProfile.gstin}
                onChange={(e) => setAgencyProfile({ ...agencyProfile, gstin: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-stone-100">
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>

      {/* Role-Based Access Control (RBAC) Matrix */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
          <Shield className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-bold text-stone-900">Role-Based Access Control (RBAC) Matrix</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase">
              <tr>
                <th className="p-3">Module Feature</th>
                <th className="p-3 text-center">Owner</th>
                <th className="p-3 text-center">Admin</th>
                <th className="p-3 text-center">Employee</th>
                <th className="p-3 text-center">Client</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {[
                { module: 'Executive Financial KPIs & Margin Analytics', o: true, a: true, e: false, c: false },
                { module: 'Client CRM & Contract Packages', o: true, a: true, e: true, c: false },
                { module: 'UGC Scripting & Concept Editor', o: true, a: true, e: true, c: 'View & Approve' },
                { module: 'Creator Roster & Commercial Rates', o: true, a: true, e: true, c: false },
                { module: 'Shoots & Studio Logistics Checklists', o: true, a: true, e: true, c: false },
                { module: '9-Stage Video Production Kanban', o: true, a: true, e: true, c: 'Review Stage Only' },
                { module: 'Internal Team Sprint Tasks', o: true, a: true, e: true, c: false },
                { module: 'Billing, Invoicing & GST Records', o: true, a: true, e: false, c: 'View Invoices' },
                { module: 'Operating Expenses & Burn Ledger', o: true, a: false, e: false, c: false },
                { module: 'Creator Payout Disbursements', o: true, a: true, e: false, c: false },
                { module: 'Client Portal & Frame Review', o: true, a: true, e: true, c: true },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-stone-50/60">
                  <td className="p-3 font-semibold text-stone-800">{row.module}</td>
                  <td className="p-3 text-center">
                    <span className="font-bold text-emerald-600">Full Access</span>
                  </td>
                  <td className="p-3 text-center">
                    <span className="font-bold text-emerald-600">Full Access</span>
                  </td>
                  <td className="p-3 text-center">
                    {row.e ? (
                      <span className="font-bold text-indigo-600">Operational</span>
                    ) : (
                      <span className="text-stone-300 font-bold">—</span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {row.c ? (
                      <span className="font-bold text-amber-600">{typeof row.c === 'string' ? row.c : 'Portal Access'}</span>
                    ) : (
                      <span className="text-stone-300 font-bold">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Data Management & Export */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-stone-900">Prototype State & Persistence</h3>
          <p className="text-xs text-stone-500 mt-0.5">
            All prototype changes are persisted directly in your browser's localStorage. You can export a snapshot or reset to initial mock data anytime.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportData}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Snapshot</span>
          </button>
          <button
            onClick={handleResetData}
            className="px-4 py-2 bg-stone-900 hover:bg-black text-amber-400 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Factory State</span>
          </button>
        </div>
      </div>
    </div>
  );
}
