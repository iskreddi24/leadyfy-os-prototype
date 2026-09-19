import React, { useState } from 'react';
import {
  Package,
  FileText,
  Film,
  Download,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  Send,
  MessageSquare,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';

export default function ClientPortal() {
  const {
    role,
    activeClientId,
    clients,
    orders,
    scripts,
    videos,
    clientScopedData,
    updateScriptStatus,
    updateVideoStage,
    addVideoFeedback,
    addSupportTicket,
    notify
  } = useApp();

  const isClientRole = role === 'client';
  const effectiveClientId = isClientRole ? 'cli-1' : activeClientId;

  // Find active client details
  const activeClient = clients.find(c => c.id === effectiveClientId) || clients[0];

  // Scoped data for this client
  const clientOrders = isClientRole ? (clientScopedData?.orders || []) : orders.filter(o => o.clientId === effectiveClientId);
  const clientScripts = isClientRole ? (clientScopedData?.scripts || []) : scripts.filter(s => s.clientId === effectiveClientId);
  const clientVideos = isClientRole ? (clientScopedData?.videos || []) : videos.filter(v => v.clientId === effectiveClientId);

  // Quota metrics
  const totalContractedVideos = clientOrders.reduce((sum, o) => sum + (o.contractedVideoCount || 0), 0);
  const deliveredVideos = clientVideos.filter(v => v.stage === 'Delivered').length;
  const inReviewVideos = clientVideos.filter(v => v.stage === 'Client Review').length;
  const pendingScriptsForApproval = clientScripts.filter(s => s.status === 'Sent to Client' || s.status === 'In Review').length;

  // State for Review Video Modal
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackTimestamp, setFeedbackTimestamp] = useState('00:08');

  // State for View Script Modal
  const [selectedScript, setSelectedScript] = useState(null);

  // State for New Ticket Modal
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: 'Video Revision',
    priority: 'Medium',
    message: ''
  });

  const handleApproveVideo = (video) => {
    updateVideoStage(video.id, 'Final Approved');
    notify({
      title: 'Video Approved',
      message: `${video.videoNumber} marked as Approved! Final master renders will be packaged for delivery.`,
      type: 'success'
    });
    setSelectedVideo(null);
  };

  const handleRequestVideoRevision = (video) => {
    if (!feedbackText.trim()) return;
    const authorName = activeClient?.clientName || activeClient?.name || 'Aditya Verma (NovaFit)';
    addVideoFeedback(video.id, {
      author: authorName,
      role: 'Client',
      comment: feedbackText,
      timestamp: feedbackTimestamp
    });
    updateVideoStage(video.id, 'Revision');
    notify({
      title: 'Revision Feedback Submitted',
      message: `Revision requested on ${video.videoNumber} with timestamp ${feedbackTimestamp}`,
      type: 'warning'
    });
    setFeedbackText('');
    setSelectedVideo(null);
  };

  const handleApproveScript = (script) => {
    updateScriptStatus(script.id, 'Approved');
    notify({
      title: 'Script Approved',
      message: `${script.videoNumber} approved by client! Next: Creator assignment & scheduling shoot.`,
      type: 'success'
    });
    setSelectedScript(null);
  };

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    addSupportTicket({
      clientId: effectiveClientId,
      clientName: activeClient?.companyName || activeClient?.clientName || 'NovaFit Nutrition Pvt Ltd',
      contactPerson: activeClient?.clientName || 'Aditya Verma',
      subject: ticketForm.subject,
      category: ticketForm.category,
      priority: ticketForm.priority,
      status: 'Open',
      message: ticketForm.message,
      description: ticketForm.message
    });
    setShowTicketModal(false);
    setTicketForm({ subject: '', category: 'Video Revision', priority: 'Medium', message: '' });
  };

  return (
    <div className="space-y-6">
      {/* Client Portal Header */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
              Dedicated Client Portal
            </span>
            <span className="text-xs text-stone-500 font-medium">Real-Time Production Workspace</span>
          </div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Welcome, {activeClient?.clientName || 'Aditya Verma'}
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Review scripts, view video cuts, timestamp feedback, and download high-resolution masters for <strong>{activeClient?.companyName || 'NovaFit Nutrition Pvt Ltd'}</strong>.
          </p>
        </div>

        {/* Verified Client Badge & Actions (No cross-client switching permitted) */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-100 border border-stone-200 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-stone-800">{activeClient?.companyName || 'NovaFit Nutrition Pvt Ltd'}</span>
          </div>

          <button
            onClick={() => setShowTicketModal(true)}
            className="px-4 py-2 bg-stone-900 hover:bg-black text-amber-400 font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Raise Ticket</span>
          </button>
        </div>
      </div>

      {/* Quota & Milestone Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Video Quota</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-stone-900">{totalContractedVideos}</span>
            <span className="text-xs text-stone-500 font-semibold">Contracted Reels</span>
          </div>
          <p className="text-[11px] text-stone-400 mt-2">Active across current Sprint package</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Completed & Delivered</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600">{deliveredVideos}</span>
            <span className="text-xs text-stone-500 font-semibold">Master Downloads Ready</span>
          </div>
          <p className="text-[11px] text-stone-400 mt-2">Approved by client sign-off</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Ready for Video Review</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600">{inReviewVideos}</span>
            <span className="text-xs text-amber-700 font-bold">Needs Your Input</span>
          </div>
          <p className="text-[11px] text-stone-400 mt-2">Watch preview & approve or revise</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Pending Script Approvals</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-purple-600">{pendingScriptsForApproval}</span>
            <span className="text-xs text-purple-700 font-semibold">Pre-Production Scripts</span>
          </div>
          <p className="text-[11px] text-stone-400 mt-2">Hook & CTA angles ready</p>
        </div>
      </div>

      {/* Section 1: Videos Awaiting Review / In Production */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <h2 className="text-base font-bold text-stone-900">
              Video Review & Approvals Queue
            </h2>
            <p className="text-xs text-stone-500">
              Click any video card to review draft cuts, leave timestamped feedback, or release final approval
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 font-bold border border-amber-200">
            {clientVideos.length} Total Videos
          </span>
        </div>

        {clientVideos.length === 0 ? (
          <div className="py-12 text-center text-xs text-stone-400">
            No video deliverables found for {activeClient?.companyName}.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clientVideos.map((video) => (
              <div
                key={video.id}
                className="rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-white hover:border-amber-400 hover:shadow-md transition-all overflow-hidden flex flex-col"
              >
                {/* Video Thumbnail */}
                <div className="relative aspect-video bg-stone-900 overflow-hidden group">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <Badge status={video.stage} size="xs" />
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-white font-mono bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-lg">
                    <span>{video.videoNumber}</span>
                    <span>Rev #{video.revisionCount}</span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 line-clamp-1">
                      {video.title}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1">
                      Creator: <span className="font-semibold text-stone-700">{video.creatorName}</span>
                    </p>
                    {video.feedbackLog && video.feedbackLog.length > 0 && (
                      <div className="mt-2 p-2 rounded-lg bg-stone-100 text-[11px] text-stone-600 line-clamp-2">
                        <strong>Latest Note:</strong> {video.feedbackLog[video.feedbackLog.length - 1].comment}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between gap-2">
                    {video.stage === 'Delivered' ? (
                      <a
                        href={video.driveFolder}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download 4K Master</span>
                      </a>
                    ) : (
                      <>
                        <button
                          onClick={() => setSelectedVideo(video)}
                          className="flex-1 py-2 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                        >
                          Review Cut
                        </button>
                        {video.stage === 'Client Review' && (
                          <button
                            onClick={() => handleApproveVideo(video)}
                            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                            title="Approve immediately"
                          >
                            Approve
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Scripts Awaiting Sign-Off */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <h2 className="text-base font-bold text-stone-900">
              Creative Scripts & Concepts
            </h2>
            <p className="text-xs text-stone-500">
              Review script hooks, pacing, and calls-to-action before production shoots take place
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-purple-50 text-purple-800 font-bold border border-purple-200">
            {clientScripts.length} Scripts
          </span>
        </div>

        <div className="divide-y divide-stone-100">
          {clientScripts.map((script) => (
            <div key={script.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    {script.videoNumber}
                  </span>
                  <h4 className="text-sm font-bold text-stone-900">{script.title}</h4>
                  <Badge status={script.status} size="xs" />
                </div>
                <p className="text-xs text-stone-500">
                  Writer: <strong>{script.writer}</strong> • Creator: <strong>{script.creatorName}</strong> • Language: <strong>{script.language}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedScript(script)}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-lg cursor-pointer transition-colors"
                >
                  Read Script
                </button>
                {(script.status === 'Sent to Client' || script.status === 'In Review') && (
                  <button
                    onClick={() => handleApproveScript(script)}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold rounded-lg cursor-pointer transition-colors"
                  >
                    Approve Script
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Review Modal with Timestamped Feedback */}
      {selectedVideo && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedVideo(null)}
          title={`Review Cut: ${selectedVideo.videoNumber} - ${selectedVideo.title}`}
          subtitle={`Current Stage: ${selectedVideo.stage} • Creator: ${selectedVideo.creatorName}`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-4">
            {/* Video Player Placeholder */}
            <div className="relative aspect-video bg-stone-900 rounded-xl overflow-hidden flex flex-col items-center justify-center text-white border border-stone-800">
              <Film className="w-12 h-12 text-amber-500 mb-2 animate-bounce" />
              <p className="text-sm font-bold">Draft Preview Player</p>
              <p className="text-xs text-stone-400">00:08 / 00:28 • 1080x1920 (9:16)</p>
              <a
                href={selectedVideo.driveFolder}
                target="_blank"
                rel="noreferrer"
                className="mt-3 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
              >
                <span>Open Google Drive Preview</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Existing Feedback Trail */}
            {selectedVideo.feedbackLog && selectedVideo.feedbackLog.length > 0 && (
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <span className="text-xs font-bold text-stone-700 uppercase">Review Feedback Trail</span>
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {selectedVideo.feedbackLog.map((fb, idx) => (
                    <div key={idx} className="text-xs bg-white p-2 rounded-lg border border-stone-200/60">
                      <div className="flex items-center justify-between font-bold text-stone-900">
                        <span>{fb.author} ({fb.role})</span>
                        <span className="text-amber-600 font-mono">@{fb.timestamp}</span>
                      </div>
                      <p className="text-stone-600 mt-0.5">{fb.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Request Revision Form */}
            <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/80 space-y-3">
              <h4 className="text-xs font-bold text-amber-900 uppercase">Submit Timestamped Revision Request</h4>
              <div className="flex items-center gap-3">
                <div className="w-28">
                  <label className="block text-[11px] font-bold text-stone-700 mb-0.5">Timestamp</label>
                  <input
                    type="text"
                    value={feedbackTimestamp}
                    onChange={(e) => setFeedbackTimestamp(e.target.value)}
                    placeholder="00:12"
                    className="w-full px-2 py-1.5 text-xs font-mono border border-stone-300 rounded-lg bg-white"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[11px] font-bold text-stone-700 mb-0.5">Specific Revision Instruction</label>
                  <input
                    type="text"
                    placeholder="e.g. Cut 1 second from hook, make brand logo 20% larger, boost sound effects"
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-lg bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-stone-200">
              <button
                onClick={() => setSelectedVideo(null)}
                className="px-4 py-2 text-xs font-bold text-stone-600 hover:text-stone-900 cursor-pointer"
              >
                Close
              </button>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleRequestVideoRevision(selectedVideo)}
                  disabled={!feedbackText.trim()}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl cursor-pointer transition-colors shadow-xs"
                >
                  Request Revision
                </button>
                <button
                  onClick={() => handleApproveVideo(selectedVideo)}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer transition-colors shadow-xs"
                >
                  Approve Cut & Finalize
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Script Reader Modal */}
      {selectedScript && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedScript(null)}
          title={`Script Reader: ${selectedScript.videoNumber} - ${selectedScript.title}`}
          subtitle={`Client: ${selectedScript.clientName} • Writer: ${selectedScript.writer} • Creator: ${selectedScript.creatorName}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4">
            <div className="p-4 bg-stone-900 text-stone-100 rounded-xl font-mono text-xs whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
              {selectedScript.scriptText}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-stone-200">
              <button
                onClick={() => setSelectedScript(null)}
                className="px-4 py-2 text-xs font-bold text-stone-600 hover:text-stone-900 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => handleApproveScript(selectedScript)}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold rounded-xl cursor-pointer transition-colors shadow-xs"
              >
                Approve Script For Shoot
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Raise Support Ticket Modal */}
      {showTicketModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowTicketModal(false)}
          title="Raise Operations Support Ticket"
          subtitle="Direct channel to Leadyfy Agency operations & editing team"
        >
          <form onSubmit={handleTicketSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Subject / Issue</label>
              <input
                type="text"
                required
                placeholder="e.g. Need urgent change on Hook font color"
                value={ticketForm.subject}
                onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
              />
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
                  <option>Script Change</option>
                  <option>Timeline / Delay</option>
                  <option>Invoice / Payment</option>
                  <option>Creator Replacement</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Priority</label>
                <select
                  value={ticketForm.priority}
                  onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
                >
                  <option>Medium</option>
                  <option>High</option>
                  <option>Urgent</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Detailed Message</label>
              <textarea
                rows={4}
                required
                placeholder="Describe your request or reference specific video numbers..."
                value={ticketForm.message}
                onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
              />
            </div>
            <div className="flex justify-end gap-3 pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setShowTicketModal(false)}
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
    </div>
  );
}
