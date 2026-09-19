import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Building,
  Mail,
  Phone,
  Tag,
  Calendar,
  FileText,
  Package,
  Film,
  Camera,
  CreditCard,
  Edit2,
  Trash2,
  ExternalLink,
  Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';

export default function ClientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    clients,
    updateClient,
    deleteClient,
    orders,
    scripts,
    shoots,
    videos,
    payments,
    requestConfirm
  } = useApp();

  const client = clients.find(c => c.id === id);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState(client ? { ...client } : {});

  if (!client) {
    return (
      <div className="bg-white p-12 text-center rounded-2xl border border-stone-200">
        <p className="text-stone-500 text-sm">Client profile not found.</p>
        <button
          onClick={() => navigate('/clients')}
          className="mt-4 px-4 py-2 bg-stone-900 text-white text-xs font-bold rounded-lg cursor-pointer"
        >
          Return to Clients List
        </button>
      </div>
    );
  }

  // Related Entities
  const clientOrders = orders.filter(o => o.clientId === client.id);
  const clientScripts = scripts.filter(s => s.clientId === client.id);
  const clientShoots = shoots.filter(sh => sh.clientId === client.id);
  const clientVideos = videos.filter(v => v.clientId === client.id);
  const clientPayments = payments.filter(p => p.clientId === client.id);

  const totalContracted = clientOrders.reduce((sum, o) => sum + (o.contractedVideoCount || 0), 0);
  const delivered = clientVideos.filter(v => v.stage === 'Delivered').length;

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateClient(client.id, editForm);
    setIsEditModalOpen(false);
  };

  const handleDelete = () => {
    requestConfirm({
      title: `Delete Client: ${client.companyName}?`,
      message: 'This will remove the client profile from local storage. All associated historical references will be preserved.',
      confirmText: 'Delete Client',
      isDanger: true,
      onConfirm: () => {
        deleteClient(client.id);
        navigate('/clients');
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate('/clients')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-900 cursor-pointer transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Clients</span>
      </button>

      {/* Profile Overview Card */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
                {client.companyName}
              </h1>
              <Badge status={client.status} size="md" />
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Brand: <strong>{client.brandName || client.clientName}</strong> • Industry: <strong>{client.industry}</strong> • GST: <span className="font-mono text-stone-700">{client.gstTaxId || 'Pending'}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setEditForm({ ...client });
                setIsEditModalOpen(true);
              }}
              className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Account</span>
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              title="Delete client profile"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Contact and Strategy Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="p-3 bg-stone-50 rounded-xl">
            <span className="text-[11px] font-bold text-stone-400 uppercase">Primary Contact</span>
            <p className="text-sm font-bold text-stone-900 mt-0.5">{client.clientName}</p>
            <p className="text-xs text-stone-500 mt-0.5">{client.email}</p>
            <p className="text-xs text-stone-500">{client.phone}</p>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl">
            <span className="text-[11px] font-bold text-stone-400 uppercase">Account Manager</span>
            <p className="text-sm font-bold text-stone-900 mt-0.5">{client.assignedEmployee}</p>
            <p className="text-xs text-stone-500 mt-0.5">Leadyfy Operations Lead</p>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl">
            <span className="text-[11px] font-bold text-stone-400 uppercase">Production Quota</span>
            <p className="text-sm font-bold text-stone-900 mt-0.5">{delivered} / {totalContracted} Delivered</p>
            <p className="text-xs text-emerald-600 font-semibold mt-0.5">
              {totalContracted - delivered} reels in pipeline
            </p>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl">
            <span className="text-[11px] font-bold text-stone-400 uppercase">Acquisition Source</span>
            <p className="text-sm font-bold text-stone-900 mt-0.5">{client.source || 'Inbound'}</p>
            <p className="text-xs text-stone-500 mt-0.5">Onboarded: {client.createdAt?.slice(0, 10) || '2026-03-01'}</p>
          </div>
        </div>

        {client.notes && (
          <div className="mt-4 p-4 bg-amber-50/60 rounded-xl border border-amber-200/60">
            <h4 className="text-xs font-bold text-amber-900 uppercase">Creative Strategy & Brand Brief</h4>
            <p className="text-xs text-stone-700 mt-1 leading-relaxed">
              {client.notes}
            </p>
          </div>
        )}
      </div>

      {/* Orders & Packages Section */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-bold text-stone-900">Contracted Packages & Orders</h2>
          </div>
          <button
            onClick={() => navigate('/orders')}
            className="text-xs font-bold text-amber-600 hover:text-amber-700"
          >
            Manage Orders →
          </button>
        </div>

        {clientOrders.length === 0 ? (
          <p className="text-xs text-stone-400 py-4">No packages active for this client yet.</p>
        ) : (
          <div className="space-y-3">
            {clientOrders.map(order => (
              <div
                key={order.id}
                onClick={() => navigate(`/orders/${order.id}`)}
                className="p-4 rounded-xl border border-stone-200 hover:border-amber-400 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-stone-900">{order.packageName}</h3>
                    <Badge status={order.orderStatus} size="xs" />
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Quota: <strong>{order.contractedVideoCount} Videos</strong> • Due: <strong>{order.dueDate}</strong> • Team: {order.assignedTeam}
                  </p>
                </div>
                <div className="text-right sm:text-right">
                  <p className="text-sm font-extrabold text-stone-900">
                    ₹{(order.totalInvoiceAmount || 0).toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs text-emerald-600 font-semibold">
                    Recv: ₹{(order.amountReceived || 0).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Scripts Section */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            <h2 className="text-base font-bold text-stone-900">Scripts ({clientScripts.length})</h2>
          </div>
          <button
            onClick={() => navigate('/scripts')}
            className="text-xs font-bold text-amber-600 hover:text-amber-700"
          >
            Open Script Hub →
          </button>
        </div>

        {clientScripts.length === 0 ? (
          <p className="text-xs text-stone-400 py-4">No scripts drafted yet.</p>
        ) : (
          <div className="divide-y divide-stone-100">
            {clientScripts.map(script => (
              <div key={script.id} className="py-3 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                      {script.videoNumber}
                    </span>
                    <h4 className="text-xs font-bold text-stone-900">{script.title}</h4>
                    <Badge status={script.status} size="xs" />
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Creator: {script.creatorName} • Writer: {script.writer} • Due: {script.deadline}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Videos Section */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-stone-900">Video Pipeline ({clientVideos.length})</h2>
          </div>
          <button
            onClick={() => navigate('/videos')}
            className="text-xs font-bold text-amber-600 hover:text-amber-700"
          >
            Kanban Board →
          </button>
        </div>

        {clientVideos.length === 0 ? (
          <p className="text-xs text-stone-400 py-4">No video assets registered yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {clientVideos.map(vid => (
              <div key={vid.id} className="p-3 rounded-xl border border-stone-200 bg-stone-50">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-stone-800">{vid.videoNumber}</span>
                  <Badge status={vid.stage} size="xs" />
                </div>
                <h4 className="text-xs font-bold text-stone-900 mt-2 line-clamp-1">{vid.title}</h4>
                <p className="text-[11px] text-stone-500 mt-1">Creator: {vid.creatorName}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Client Modal */}
      {isEditModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsEditModalOpen(false)}
          title={`Edit Client: ${client.companyName}`}
        >
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={editForm.companyName || ''}
                  onChange={(e) => setEditForm({ ...editForm, companyName: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Contact Person</label>
                <input
                  type="text"
                  required
                  value={editForm.clientName || ''}
                  onChange={(e) => setEditForm({ ...editForm, clientName: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Brand Name</label>
                <input
                  type="text"
                  value={editForm.brandName || ''}
                  onChange={(e) => setEditForm({ ...editForm, brandName: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Status</label>
                <select
                  value={editForm.status || 'Active'}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
                >
                  <option>Lead</option>
                  <option>New</option>
                  <option>Onboarding</option>
                  <option>Active</option>
                  <option>On Hold</option>
                  <option>Completed</option>
                  <option>Inactive</option>
                  <option>Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editForm.email || ''}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={editForm.phone || ''}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Brand Notes</label>
              <textarea
                rows={3}
                value={editForm.notes || ''}
                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-black bg-amber-500 hover:bg-amber-600 rounded-lg cursor-pointer shadow-xs"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
