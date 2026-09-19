import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useApp } from '../../context/AppContext';

export default function QuickAddModals({ activeModal, onClose }) {
  const {
    clients,
    orders,
    creators,
    employees,
    addClient,
    addOrder,
    addScript,
    addShoot,
    addVideo,
    addTask,
    addSupportTicket,
    role,
    activeClientId,
    notify
  } = useApp();

  // Ticket Form State
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: 'Video Revision',
    priority: 'High',
    message: ''
  });

  // Client Form State
  const [clientForm, setClientForm] = useState({
    clientName: '',
    companyName: '',
    email: '',
    phone: '',
    whatsapp: '',
    brandName: '',
    industry: 'Health & Wellness',
    gstTaxId: '',
    assignedEmployee: employees[1]?.name || 'Ananya Sharma',
    source: 'Inbound Website',
    status: 'New',
    notes: ''
  });

  // Order Form State
  const [orderForm, setOrderForm] = useState({
    clientId: clients[0]?.id || '',
    packageName: 'Scale 15x UGC Video Sprint',
    contractedVideoCount: 15,
    pricing: 180000,
    gst: 32400,
    totalInvoiceAmount: 212400,
    amountReceived: 100000,
    outstandingBalance: 112400,
    dueDate: '2026-04-15',
    assignedTeam: 'Sprint Alpha (Rahul, Sneha, Rohan)',
    notes: ''
  });

  // Script Form State
  const [scriptForm, setScriptForm] = useState({
    clientId: clients[0]?.id || '',
    orderId: orders[0]?.id || '',
    videoNumber: `ZO-${Math.floor(10 + Math.random() * 89)}`,
    title: '',
    writer: 'Rahul Verma',
    creatorId: creators[0]?.id || '',
    language: 'Hinglish',
    scriptText: '',
    referenceLinks: '',
    deadline: '2026-03-30'
  });

  // Shoot Form State
  const [shootForm, setShootForm] = useState({
    clientId: clients[0]?.id || '',
    orderId: orders[0]?.id || '',
    title: '',
    date: '2026-03-25',
    time: '11:00 AM - 03:00 PM',
    location: '',
    creatorId: creators[0]?.id || '',
    cameraman: 'Arjun Das',
    shootManager: 'Sneha Patel',
    shootingAssistant: 'Vikram Joshi',
    specialNotes: ''
  });

  // Video Form State
  const [videoForm, setVideoForm] = useState({
    clientId: clients[0]?.id || '',
    orderId: orders[0]?.id || '',
    videoNumber: `VID-${Math.floor(100 + Math.random() * 899)}`,
    title: '',
    creatorId: creators[0]?.id || '',
    editorId: 'emp-5',
    deadline: '2026-03-30',
    stage: 'Script Approved',
    thumbnail: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80'
  });

  // Task Form State
  const [taskForm, setTaskForm] = useState({
    task: '',
    assignee: 'Rahul Verma',
    module: 'Scripting',
    priority: 'High',
    deadline: '2026-03-25'
  });

  if (!activeModal) return null;

  // Handle Client Submission
  const handleClientSubmit = (e) => {
    e.preventDefault();
    if (!clientForm.clientName || !clientForm.companyName) return;
    addClient(clientForm);
    onClose();
  };

  // Handle Order Submission
  const handleOrderSubmit = (e) => {
    e.preventDefault();
    const selClient = clients.find(c => c.id === orderForm.clientId);
    const pricingNum = Number(orderForm.pricing) || 0;
    const gstNum = Math.round(pricingNum * 0.18);
    const totalNum = pricingNum + gstNum;
    const recNum = Number(orderForm.amountReceived) || 0;

    addOrder({
      ...orderForm,
      clientName: selClient?.clientName || 'Client',
      companyName: selClient?.companyName || 'Company',
      pricing: pricingNum,
      gst: gstNum,
      totalInvoiceAmount: totalNum,
      amountReceived: recNum,
      outstandingBalance: Math.max(0, totalNum - recNum),
      contractedVideoCount: Number(orderForm.contractedVideoCount)
    });
    onClose();
  };

  // Handle Script Submission
  const handleScriptSubmit = (e) => {
    e.preventDefault();
    const selClient = clients.find(c => c.id === scriptForm.clientId);
    const selCreator = creators.find(c => c.id === scriptForm.creatorId);

    addScript({
      ...scriptForm,
      clientName: selClient?.companyName || selClient?.clientName || 'Client',
      creatorName: selCreator?.name || 'Creator'
    });
    onClose();
  };

  // Handle Shoot Submission
  const handleShootSubmit = (e) => {
    e.preventDefault();
    const selClient = clients.find(c => c.id === shootForm.clientId);
    const selCreator = creators.find(c => c.id === shootForm.creatorId);

    addShoot({
      ...shootForm,
      clientName: selClient?.companyName || selClient?.clientName || 'Client',
      creatorName: selCreator?.name || 'Creator'
    });
    onClose();
  };

  // Handle Video Submission
  const handleVideoSubmit = (e) => {
    e.preventDefault();
    const selClient = clients.find(c => c.id === videoForm.clientId);
    const selCreator = creators.find(c => c.id === videoForm.creatorId);
    const selEditor = employees.find(emp => emp.id === videoForm.editorId);

    addVideo({
      ...videoForm,
      clientName: selClient?.companyName || selClient?.clientName || 'Client',
      creatorName: selCreator?.name || 'Creator',
      editorName: selEditor?.name || 'Video Editor'
    });
    onClose();
  };

  // Handle Task Submission
  const handleTaskSubmit = (e) => {
    e.preventDefault();
    addTask(taskForm);
    onClose();
  };

  return (
    <>
      {/* 1. Add Client Modal */}
      {activeModal === 'client' && (
        <Modal isOpen={true} onClose={onClose} title="Add New Client Account" subtitle="Establish centralized client profile and reference keys">
          <form onSubmit={handleClientSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Company / Legal Entity *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zing Organics Wellness Pvt Ltd"
                  value={clientForm.companyName}
                  onChange={(e) => setClientForm({ ...clientForm, companyName: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Client Point of Contact *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aditya Singhania"
                  value={clientForm.clientName}
                  onChange={(e) => setClientForm({ ...clientForm, clientName: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Brand Name</label>
                <input
                  type="text"
                  placeholder="e.g. Zing Organics"
                  value={clientForm.brandName}
                  onChange={(e) => setClientForm({ ...clientForm, brandName: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="aditya@zingorganics.in"
                  value={clientForm.email}
                  onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Phone / WhatsApp</label>
                <input
                  type="text"
                  placeholder="+91 98200 12345"
                  value={clientForm.phone}
                  onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value, whatsapp: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Industry</label>
                <select
                  value={clientForm.industry}
                  onChange={(e) => setClientForm({ ...clientForm, industry: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-white"
                >
                  <option>Health & Wellness</option>
                  <option>Fitness & Supplements</option>
                  <option>Food & Beverage</option>
                  <option>Fashion & D2C Apparel</option>
                  <option>Personal Care & Beauty</option>
                  <option>Skincare & Cosmetics</option>
                  <option>Footwear & Accessories</option>
                  <option>Tech & Electronics</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">GST / Tax ID</label>
                <input
                  type="text"
                  placeholder="27AABCZ1234F1Z5"
                  value={clientForm.gstTaxId}
                  onChange={(e) => setClientForm({ ...clientForm, gstTaxId: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Assigned Account Manager</label>
                <select
                  value={clientForm.assignedEmployee}
                  onChange={(e) => setClientForm({ ...clientForm, assignedEmployee: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.name}>{emp.name} ({emp.title})</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Brief / Strategic Notes</label>
              <textarea
                rows={2}
                placeholder="Product USPs, target audience demographics, creator tone preferences..."
                value={clientForm.notes}
                onChange={(e) => setClientForm({ ...clientForm, notes: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-black bg-amber-500 hover:bg-amber-600 rounded-lg cursor-pointer shadow-xs"
              >
                Create Client Profile
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* 2. Add Order Modal */}
      {activeModal === 'order' && (
        <Modal isOpen={true} onClose={onClose} title="Create Client Package / Order" subtitle="Provision new contracted video quota and billing agreement">
          <form onSubmit={handleOrderSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Client *</label>
                <select
                  value={orderForm.clientId}
                  onChange={(e) => setOrderForm({ ...orderForm, clientId: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.companyName || c.clientName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Package Name *</label>
                <input
                  type="text"
                  required
                  value={orderForm.packageName}
                  onChange={(e) => setOrderForm({ ...orderForm, packageName: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Contracted Video Count *</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={orderForm.contractedVideoCount}
                  onChange={(e) => setOrderForm({ ...orderForm, contractedVideoCount: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Package Base Pricing (INR ₹) *</label>
                <input
                  type="number"
                  step="1000"
                  required
                  value={orderForm.pricing}
                  onChange={(e) => setOrderForm({ ...orderForm, pricing: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Amount Received Advance (₹)</label>
                <input
                  type="number"
                  step="1000"
                  value={orderForm.amountReceived}
                  onChange={(e) => setOrderForm({ ...orderForm, amountReceived: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Delivery Due Date</label>
                <input
                  type="date"
                  value={orderForm.dueDate}
                  onChange={(e) => setOrderForm({ ...orderForm, dueDate: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
                />
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex justify-between items-center">
              <span>Includes 18% GST calculation automatically</span>
              <span className="font-bold">Total: ₹{Math.round(Number(orderForm.pricing || 0) * 1.18).toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-black bg-amber-500 hover:bg-amber-600 rounded-lg cursor-pointer shadow-xs"
              >
                Save Order & Quota
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* 3. Add Script Modal */}
      {activeModal === 'script' && (
        <Modal isOpen={true} onClose={onClose} title="Draft New UGC Script" subtitle="Define creative hook, problem, solution, and CTA angles">
          <form onSubmit={handleScriptSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Client *</label>
                <select
                  value={scriptForm.clientId}
                  onChange={(e) => setScriptForm({ ...scriptForm, clientId: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.companyName || c.clientName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Video Reference # *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ZO-05"
                  value={scriptForm.videoNumber}
                  onChange={(e) => setScriptForm({ ...scriptForm, videoNumber: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Script Title / Angle *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stop Doing This Gym Mistake"
                  value={scriptForm.title}
                  onChange={(e) => setScriptForm({ ...scriptForm, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Assigned Creator</label>
                <select
                  value={scriptForm.creatorId}
                  onChange={(e) => setScriptForm({ ...scriptForm, creatorId: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
                >
                  {creators.map(cr => (
                    <option key={cr.id} value={cr.id}>{cr.name} ({cr.niches.slice(0, 2).join(', ')})</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Script Breakdown (Hook, Problem, Solution, CTA) *</label>
              <textarea
                rows={5}
                required
                placeholder="[HOOK - 0-3s]: ...&#10;[PROBLEM - 3-7s]: ...&#10;[DEMO & PRODUCT - 7-15s]: ...&#10;[CTA - 15-20s]: ..."
                value={scriptForm.scriptText}
                onChange={(e) => setScriptForm({ ...scriptForm, scriptText: e.target.value })}
                className="w-full px-3 py-2 text-xs font-mono border border-stone-300 rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-black bg-amber-500 hover:bg-amber-600 rounded-lg cursor-pointer shadow-xs"
              >
                Save Script
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* 4. Schedule Shoot Modal */}
      {activeModal === 'shoot' && (
        <Modal isOpen={true} onClose={onClose} title="Schedule Production Shoot" subtitle="Book location, creator attendance, and technical crew">
          <form onSubmit={handleShootSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">Shoot Title / Campaign *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BoldFit Pre-Workout Gym Explode"
                  value={shootForm.title}
                  onChange={(e) => setShootForm({ ...shootForm, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Client *</label>
                <select
                  value={shootForm.clientId}
                  onChange={(e) => setShootForm({ ...shootForm, clientId: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.companyName || c.clientName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Assigned Creator *</label>
                <select
                  value={shootForm.creatorId}
                  onChange={(e) => setShootForm({ ...shootForm, creatorId: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
                >
                  {creators.map(cr => (
                    <option key={cr.id} value={cr.id}>{cr.name} ({cr.location})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Shoot Date *</label>
                <input
                  type="date"
                  required
                  value={shootForm.date}
                  onChange={(e) => setShootForm({ ...shootForm, date: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Time Window *</label>
                <input
                  type="text"
                  placeholder="10:00 AM - 02:00 PM"
                  value={shootForm.time}
                  onChange={(e) => setShootForm({ ...shootForm, time: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">Studio / Location Address *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Studio 4B, Bandra West, Mumbai"
                  value={shootForm.location}
                  onChange={(e) => setShootForm({ ...shootForm, location: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-black bg-amber-500 hover:bg-amber-600 rounded-lg cursor-pointer shadow-xs"
              >
                Schedule Shoot
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* 5. Add Video to Pipeline Modal */}
      {activeModal === 'video' && (
        <Modal isOpen={true} onClose={onClose} title="Inject Video Asset to Pipeline" subtitle="Initialize video track in the 9-stage production Kanban">
          <form onSubmit={handleVideoSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Video Number *</label>
                <input
                  type="text"
                  required
                  value={videoForm.videoNumber}
                  onChange={(e) => setVideoForm({ ...videoForm, videoNumber: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Client *</label>
                <select
                  value={videoForm.clientId}
                  onChange={(e) => setVideoForm({ ...videoForm, clientId: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.companyName || c.clientName}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">Video Title / Hook *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 3 Quick Hacks for Clear Skin"
                  value={videoForm.title}
                  onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Assigned Editor</label>
                <select
                  value={videoForm.editorId}
                  onChange={(e) => setVideoForm({ ...videoForm, editorId: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
                >
                  {employees.filter(emp => emp.role === 'Employee').map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.title})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Target Delivery Deadline</label>
                <input
                  type="date"
                  value={videoForm.deadline}
                  onChange={(e) => setVideoForm({ ...videoForm, deadline: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-black bg-amber-500 hover:bg-amber-600 rounded-lg cursor-pointer shadow-xs"
              >
                Add to Pipeline
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* 6. Add Task Modal */}
      {activeModal === 'task' && (
        <Modal isOpen={true} onClose={onClose} title="Create Internal Task" subtitle="Assign action item to team member">
          <form onSubmit={handleTaskSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Task Description *</label>
              <input
                type="text"
                required
                placeholder="e.g. Export 9:16 high-bitrate render for ChaiPoint reel"
                value={taskForm.task}
                onChange={(e) => setTaskForm({ ...taskForm, task: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Assignee</label>
                <select
                  value={taskForm.assignee}
                  onChange={(e) => setTaskForm({ ...taskForm, assignee: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.name}>{emp.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Priority</label>
                <select
                  value={taskForm.priority}
                  onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
                >
                  <option>Urgent</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Deadline</label>
                <input
                  type="date"
                  value={taskForm.deadline}
                  onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-black bg-amber-500 hover:bg-amber-600 rounded-lg cursor-pointer shadow-xs"
              >
                Create Task
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Quick Add Ticket Modal (for Client or Support) */}
      {activeModal === 'ticket' && (
        <Modal
          isOpen={true}
          onClose={onClose}
          title="Open New Support Ticket"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addSupportTicket({
                clientId: role === 'client' ? 'cli-1' : activeClientId,
                clientName: 'NovaFit Nutrition Pvt Ltd',
                subject: ticketForm.subject,
                category: ticketForm.category,
                priority: ticketForm.priority,
                message: ticketForm.message,
                status: 'Open'
              });
              notify({
                title: 'Ticket Submitted',
                message: 'Your ticket has been dispatched to the agency team.',
                type: 'success'
              });
              setTicketForm({ subject: '', category: 'Video Revision', priority: 'High', message: '' });
              onClose();
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Client Account</label>
              <div className="text-xs font-bold text-stone-900 bg-stone-100 px-3 py-2 rounded-lg border border-stone-200">
                NovaFit Nutrition Pvt Ltd
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Category</label>
                <select
                  value={ticketForm.category}
                  onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
                >
                  <option>Video Revision</option>
                  <option>Rush Delivery Request</option>
                  <option>Script Adjustments</option>
                  <option>Invoicing & Billing</option>
                  <option>General Support</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Priority</label>
                <select
                  value={ticketForm.priority}
                  onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
                >
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Subject *</label>
              <input
                type="text"
                required
                placeholder="e.g. Question regarding Video 01 hook cut"
                value={ticketForm.subject}
                onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Message *</label>
              <textarea
                rows={3}
                required
                placeholder="Describe your request or question in detail..."
                value={ticketForm.message}
                onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-black bg-amber-500 hover:bg-amber-600 rounded-lg cursor-pointer shadow-xs"
              >
                Submit Ticket
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
