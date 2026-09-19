import React, { useState, useMemo } from 'react';
import {
  Film,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Sparkles,
  LayoutGrid,
  ListFilter,
  Eye
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';

export const PRODUCTION_STAGES = [
  'Script Approved',
  'Shoot Pending',
  'Raw Footage Received',
  'Video Editing',
  'Internal QA',
  'Client Review',
  'Revision',
  'Final Approved',
  'Delivered'
];

export default function Videos() {
  const {
    videos,
    clients,
    creators,
    employees,
    updateVideoStage,
    addVideoFeedback,
    notify
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [clientFilter, setClientFilter] = useState('All');
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'list'
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Feedback form inside modal
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackTimestamp, setFeedbackTimestamp] = useState('00:05');

  const filteredVideos = useMemo(() => {
    return videos.filter(v => {
      const matchesSearch =
        v.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.videoNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.creatorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.editorName?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesClient = clientFilter === 'All' || v.clientId === clientFilter;
      return matchesSearch && matchesClient;
    });
  }, [videos, searchQuery, clientFilter]);

  const handleAdvanceStage = (video) => {
    const currentIndex = PRODUCTION_STAGES.indexOf(video.stage);
    if (currentIndex < PRODUCTION_STAGES.length - 1) {
      const nextStage = PRODUCTION_STAGES[currentIndex + 1];
      updateVideoStage(video.id, nextStage);
      notify({
        title: 'Video Stage Advanced',
        message: `${video.videoNumber} advanced to ${nextStage}`,
        type: 'success'
      });
      if (selectedVideo?.id === video.id) {
        setSelectedVideo(prev => ({ ...prev, stage: nextStage }));
      }
    }
  };

  const handlePreviousStage = (video) => {
    const currentIndex = PRODUCTION_STAGES.indexOf(video.stage);
    if (currentIndex > 0) {
      const prevStage = PRODUCTION_STAGES[currentIndex - 1];
      updateVideoStage(video.id, prevStage);
      notify({
        title: 'Video Stage Reverted',
        message: `${video.videoNumber} moved back to ${prevStage}`,
        type: 'info'
      });
      if (selectedVideo?.id === video.id) {
        setSelectedVideo(prev => ({ ...prev, stage: prevStage }));
      }
    }
  };

  const handleAddFeedback = (e) => {
    e.preventDefault();
    if (!feedbackText.trim() || !selectedVideo) return;

    addVideoFeedback(selectedVideo.id, {
      author: 'Operations QA Lead',
      role: 'Internal',
      comment: feedbackText,
      timestamp: feedbackTimestamp
    });

    notify({
      title: 'Feedback Appended',
      message: `Note added at ${feedbackTimestamp}`,
      type: 'success'
    });

    setFeedbackText('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Core Operations Engine
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-500 font-medium">9-Stage Kanban</span>
          </div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Video Production Pipeline
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Monitor editing queues, client feedback loops, internal QA checks, and 4K final delivery.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                viewMode === 'kanban' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search video number, title, creator, editor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 rounded-xl bg-stone-50/70 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
            className="text-xs font-semibold text-stone-700 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:outline-hidden cursor-pointer w-full sm:w-auto"
          >
            <option value="All">All Clients</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.companyName || c.clientName}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max items-start">
            {PRODUCTION_STAGES.map(stage => {
              const stageVideos = filteredVideos.filter(v => v.stage === stage);

              return (
                <div
                  key={stage}
                  className="w-72 bg-stone-100/70 rounded-2xl p-3 border border-stone-200 flex flex-col max-h-[78vh]"
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-200 px-1">
                    <span className="text-xs font-bold text-stone-800">
                      {stage}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-stone-200 text-stone-700">
                      {stageVideos.length}
                    </span>
                  </div>

                  {/* Column Cards */}
                  <div className="overflow-y-auto space-y-3 flex-1 pr-1">
                    {stageVideos.length === 0 ? (
                      <div className="p-4 text-center text-[11px] text-stone-400 italic">
                        No videos in this stage
                      </div>
                    ) : (
                      stageVideos.map(video => (
                        <div
                          key={video.id}
                          onClick={() => setSelectedVideo(video)}
                          className="bg-white rounded-xl p-3 border border-stone-200 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                        >
                          <div>
                            <div className="relative aspect-video rounded-lg overflow-hidden bg-stone-900 mb-2">
                              <img
                                src={video.thumbnail}
                                alt={video.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                              />
                              <div className="absolute top-1.5 left-1.5">
                                <span className="font-mono text-[10px] font-bold text-amber-300 bg-black/70 px-1.5 py-0.5 rounded">
                                  {video.videoNumber}
                                </span>
                              </div>
                              <div className="absolute bottom-1.5 right-1.5">
                                <span className="text-[10px] font-bold text-white bg-rose-600/90 px-1.5 py-0.5 rounded">
                                  Rev #{video.revisionCount}
                                </span>
                              </div>
                            </div>

                            <h4 className="text-xs font-bold text-stone-900 line-clamp-1 group-hover:text-amber-600 transition-colors">
                              {video.title}
                            </h4>
                            <p className="text-[11px] text-stone-500 mt-0.5 truncate">
                              Client: <strong className="text-stone-700">{video.clientName}</strong>
                            </p>
                            <p className="text-[11px] text-stone-500 truncate">
                              Creator: {video.creatorName} • Editor: {video.editorName}
                            </p>
                          </div>

                          <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[10px]">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePreviousStage(video);
                              }}
                              className="p-1 hover:bg-stone-100 rounded text-stone-400 hover:text-stone-800"
                              title="Move back one stage"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>

                            <span className="font-bold text-amber-700">Due: {video.deadline}</span>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAdvanceStage(video);
                              }}
                              className="p-1 hover:bg-amber-100 rounded text-amber-600 hover:text-amber-900"
                              title="Advance to next stage"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="divide-y divide-stone-100">
            {filteredVideos.map(video => (
              <div
                key={video.id}
                onClick={() => setSelectedVideo(video)}
                className="p-4 hover:bg-stone-50 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-16 h-12 rounded-lg bg-stone-900 overflow-hidden shrink-0">
                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-700">{video.videoNumber}</span>
                      <h4 className="text-xs font-bold text-stone-900">{video.title}</h4>
                      <Badge status={video.stage} size="xs" />
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1">
                      Client: <strong>{video.clientName}</strong> • Creator: {video.creatorName} • Editor: {video.editorName} • Revisions: #{video.revisionCount}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreviousStage(video);
                    }}
                    className="px-2.5 py-1 text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg"
                  >
                    Back
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAdvanceStage(video);
                    }}
                    className="px-2.5 py-1 text-xs font-bold text-black bg-amber-500 hover:bg-amber-600 rounded-lg"
                  >
                    Next Stage
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Video Details & Review Modal */}
      {selectedVideo && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedVideo(null)}
          title={`Video Workfile: ${selectedVideo.videoNumber} - ${selectedVideo.title}`}
          subtitle={`Client: ${selectedVideo.clientName} • Stage: ${selectedVideo.stage}`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-4">
            {/* Stage Selector & Action Ribbon */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-600">Current Stage:</span>
                <select
                  value={selectedVideo.stage}
                  onChange={(e) => {
                    updateVideoStage(selectedVideo.id, e.target.value);
                    setSelectedVideo({ ...selectedVideo, stage: e.target.value });
                  }}
                  className="text-xs font-bold text-stone-900 bg-white border border-stone-300 rounded-lg px-2.5 py-1 cursor-pointer"
                >
                  {PRODUCTION_STAGES.map(s => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={selectedVideo.driveFolder}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-stone-900 hover:bg-black text-amber-400 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Google Drive Assets</span>
                </a>
              </div>
            </div>

            {/* Video Preview Box */}
            <div className="relative aspect-video bg-stone-900 rounded-xl overflow-hidden flex flex-col items-center justify-center text-white border border-stone-800">
              <Film className="w-12 h-12 text-amber-500 mb-2" />
              <p className="text-sm font-bold">UGC 9:16 Preview Player</p>
              <p className="text-xs text-stone-400 mt-1">
                Resolution: 1080x1920 • Aspect: 9:16 Vertical Reel
              </p>
            </div>

            {/* Existing Feedback Trail */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-stone-800 uppercase">Review Feedback Trail</h4>
                <span className="text-[11px] text-stone-400">{selectedVideo.feedbackLog?.length || 0} Comments</span>
              </div>

              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedVideo.feedbackLog?.map((fb, idx) => (
                  <div key={idx} className="p-2.5 bg-white rounded-lg border border-stone-200 text-xs">
                    <div className="flex items-center justify-between font-bold text-stone-900">
                      <span>{fb.author} ({fb.role})</span>
                      <span className="text-amber-700 font-mono">@{fb.timestamp}</span>
                    </div>
                    <p className="text-stone-600 mt-1">{fb.comment}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Append Internal Feedback */}
            <form onSubmit={handleAddFeedback} className="flex items-center gap-2">
              <div className="w-24 shrink-0">
                <input
                  type="text"
                  value={feedbackTimestamp}
                  onChange={(e) => setFeedbackTimestamp(e.target.value)}
                  placeholder="00:08"
                  className="w-full px-2 py-2 text-xs font-mono border border-stone-300 rounded-lg"
                />
              </div>
              <input
                type="text"
                required
                placeholder="Log internal feedback, sound correction, or transition fix..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="flex-1 px-3 py-2 text-xs border border-stone-300 rounded-lg"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-lg cursor-pointer shrink-0"
              >
                Log Note
              </button>
            </form>

            <div className="flex items-center justify-between pt-3 border-t border-stone-200">
              <button
                onClick={() => setSelectedVideo(null)}
                className="px-4 py-2 text-xs font-bold text-stone-600 hover:text-stone-900 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => handleAdvanceStage(selectedVideo)}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Advance to Next Stage
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
