import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Package,
  Film,
  FileText,
  Calendar,
  CreditCard,
  Plus,
  CheckCircle2,
  Clock,
  ExternalLink,
  Edit2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Badge from '../components/common/Badge';
import ProgressBar from '../components/common/ProgressBar';
import Modal from '../components/common/Modal';

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    orders,
    updateOrder,
    clients,
    videos,
    scripts,
    addVideo,
    notify
  } = useApp();

  const order = orders.find(o => o.id === id);

  const [isAddVideoModalOpen, setIsAddVideoModalOpen] = useState(false);
  const [videoForm, setVideoForm] = useState({
    videoNumber: `VID-${Math.floor(100 + Math.random() * 899)}`,
    title: '',
    creatorName: 'Kavya Maran',
    editorName: 'Rohan Mehta',
    deadline: '2026-04-10',
    stage: 'Script Approved'
  });

  if (!order) {
    return (
      <div className="bg-white p-12 text-center rounded-2xl border border-stone-200">
        <p className="text-stone-500 text-sm">Order record not found.</p>
        <button
          onClick={() => navigate('/orders')}
          className="mt-4 px-4 py-2 bg-stone-900 text-white text-xs font-bold rounded-lg cursor-pointer"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  const orderVideos = videos.filter(v => v.orderId === order.id);
  const deliveredCount = orderVideos.filter(v => v.stage === 'Delivered').length;

  const handleAddVideo = (e) => {
    e.preventDefault();
    addVideo({
      ...videoForm,
      orderId: order.id,
      clientId: order.clientId,
      clientName: order.companyName,
      thumbnail: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80'
    });
    setIsAddVideoModalOpen(false);
    notify({
      title: 'Video Added to Quota',
      message: `${videoForm.videoNumber} initialized for ${order.companyName}`,
      type: 'success'
    });
  };

  const handleUpdateStatus = (newStatus) => {
    updateOrder(order.id, { orderStatus: newStatus });
    notify({
      title: 'Order Status Updated',
      message: `Status transitioned to ${newStatus}`,
      type: 'info'
    });
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate('/orders')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-900 cursor-pointer transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Orders</span>
      </button>

      {/* Main Order Card */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
                {order.packageName}
              </h1>
              <Badge status={order.orderStatus} size="md" />
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Client: <strong>{order.companyName}</strong> • Due: <strong>{order.dueDate}</strong> • Assigned: {order.assignedTeam}
            </p>
          </div>

          {/* Quick status transitions */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-400 font-semibold">Change Status:</span>
            <select
              value={order.orderStatus}
              onChange={(e) => handleUpdateStatus(e.target.value)}
              className="px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-bold text-stone-800 cursor-pointer"
            >
              <option>Onboarding</option>
              <option>In Production</option>
              <option>Partially Delivered</option>
              <option>Completed</option>
            </select>
          </div>
        </div>

        {/* Quota Progress */}
        <div className="mt-6 p-4 rounded-xl bg-stone-50 border border-stone-200">
          <ProgressBar
            value={deliveredCount}
            max={order.contractedVideoCount}
            label={`Contract Video Quota Fulfillment (${deliveredCount} / ${order.contractedVideoCount} Delivered)`}
            size="lg"
            color="amber"
          />
          <div className="mt-3 flex items-center justify-between text-xs text-stone-500">
            <span>In Pipeline: <strong>{orderVideos.length} Videos</strong></span>
            <span>Pending Delivery: <strong>{order.contractedVideoCount - deliveredCount} Videos</strong></span>
          </div>
        </div>

        {/* Financial Breakdown */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3 bg-stone-50 rounded-xl">
            <span className="text-[11px] font-bold text-stone-400 uppercase">Base Price</span>
            <p className="text-base font-extrabold text-stone-900 mt-0.5">₹{(order.pricing || 0).toLocaleString('en-IN')}</p>
            <p className="text-[10px] text-stone-400 mt-0.5">+ 18% GST (₹{(order.gst || 0).toLocaleString('en-IN')})</p>
          </div>
          <div className="p-3 bg-stone-50 rounded-xl">
            <span className="text-[11px] font-bold text-stone-400 uppercase">Total Invoice</span>
            <p className="text-base font-extrabold text-stone-900 mt-0.5">₹{(order.totalInvoiceAmount || 0).toLocaleString('en-IN')}</p>
            <p className="text-[10px] text-stone-400 mt-0.5">Tax Invoice Generated</p>
          </div>
          <div className="p-3 bg-stone-50 rounded-xl">
            <span className="text-[11px] font-bold text-stone-400 uppercase">Amount Received</span>
            <p className="text-base font-extrabold text-emerald-600 mt-0.5">₹{(order.amountReceived || 0).toLocaleString('en-IN')}</p>
            <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">Advance cleared</p>
          </div>
          <div className="p-3 bg-stone-50 rounded-xl">
            <span className="text-[11px] font-bold text-stone-400 uppercase">Outstanding Balance</span>
            <p className="text-base font-extrabold text-amber-600 mt-0.5">₹{(order.outstandingBalance || 0).toLocaleString('en-IN')}</p>
            <p className="text-[10px] text-amber-700 font-semibold mt-0.5">Due on final delivery</p>
          </div>
        </div>
      </div>

      {/* Videos Allocated to this Order */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-stone-900">
              Allocated Videos ({orderVideos.length} / {order.contractedVideoCount})
            </h2>
          </div>

          <button
            onClick={() => setIsAddVideoModalOpen(true)}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Video Slot</span>
          </button>
        </div>

        {orderVideos.length === 0 ? (
          <p className="text-xs text-stone-400 py-6 text-center">No video slots provisioned for this order yet.</p>
        ) : (
          <div className="divide-y divide-stone-100">
            {orderVideos.map(vid => (
              <div key={vid.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-16 h-12 rounded-lg bg-stone-900 overflow-hidden shrink-0">
                    <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover opacity-80" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-700">{vid.videoNumber}</span>
                      <h4 className="text-xs font-bold text-stone-900">{vid.title}</h4>
                      <Badge status={vid.stage} size="xs" />
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1">
                      Creator: {vid.creatorName} • Editor: {vid.editorName} • Revisions: #{vid.revisionCount}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/videos')}
                  className="text-xs font-bold text-amber-600 hover:text-amber-700 cursor-pointer"
                >
                  View in Pipeline →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Scripts Allocated to this Order */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold text-stone-900">
              Allocated Scripts ({scripts.filter(s => s.orderId === order.id || s.clientId === order.clientId).length})
            </h2>
          </div>

          <button
            onClick={() => navigate('/scripts')}
            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Open All Scripts</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {scripts.filter(s => s.orderId === order.id || s.clientId === order.clientId).length === 0 ? (
          <p className="text-xs text-stone-400 py-6 text-center">No scripts written for this order yet.</p>
        ) : (
          <div className="divide-y divide-stone-100">
            {scripts.filter(s => s.orderId === order.id || s.clientId === order.clientId).map(script => (
              <div key={script.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-700">{script.videoNumber}</span>
                    <h4 className="text-xs font-bold text-stone-900">{script.title}</h4>
                    <Badge status={script.status} size="xs" />
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Writer: <span className="text-stone-700 font-semibold">{script.writer}</span> • Assigned Creator: <span className="text-amber-700 font-semibold">{script.creatorName}</span> • Revisions: #{script.revisionCount}
                  </p>
                </div>

                <button
                  onClick={() => navigate('/scripts')}
                  className="text-xs font-bold text-amber-600 hover:text-amber-700 cursor-pointer"
                >
                  Read Script →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Video Slot Modal */}
      {isAddVideoModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsAddVideoModalOpen(false)}
          title={`Allocate Video Slot for ${order.packageName}`}
        >
          <form onSubmit={handleAddVideo} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Video Reference #</label>
              <input
                type="text"
                required
                value={videoForm.videoNumber}
                onChange={(e) => setVideoForm({ ...videoForm, videoNumber: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Video Title / Hook Angle</label>
              <input
                type="text"
                required
                placeholder="e.g. Unboxing our bestselling electrolyte powder"
                value={videoForm.title}
                onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Creator</label>
                <input
                  type="text"
                  value={videoForm.creatorName}
                  onChange={(e) => setVideoForm({ ...videoForm, creatorName: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Editor</label>
                <input
                  type="text"
                  value={videoForm.editorName}
                  onChange={(e) => setVideoForm({ ...videoForm, editorName: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setIsAddVideoModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-black bg-amber-500 hover:bg-amber-600 rounded-lg cursor-pointer shadow-xs"
              >
                Allocate Video
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
