import React, { useState, useMemo } from 'react';
import {
  Video,
  Plus,
  Search,
  MapPin,
  Instagram,
  Star,
  Film,
  ExternalLink,
  Languages,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';

export default function Creators() {
  const { creators, addCreator, updateCreatorAvailability } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [nicheFilter, setNicheFilter] = useState('All');
  const [availabilityFilter, setAvailabilityFilter] = useState('All');
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [creatorForm, setCreatorForm] = useState({
    name: '',
    handle: '@',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    location: 'Mumbai',
    niches: 'Fitness, Wellness',
    languages: 'English, Hindi, Hinglish',
    ratePerVideo: 4500,
    availability: 'Available',
    pastShootsCount: 0,
    rating: 4.9,
    bio: ''
  });

  const allNiches = ['All', 'Fitness', 'Wellness', 'Tech & Gadgets', 'Beauty & Skincare', 'Food & Beverage', 'Lifestyle', 'Fashion'];

  const filteredCreators = useMemo(() => {
    return creators.filter(c => {
      const matchesSearch =
        c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.handle?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesNiche = nicheFilter === 'All' || c.niches?.some(n => n.toLowerCase().includes(nicheFilter.toLowerCase()));
      const matchesAvail = availabilityFilter === 'All' || c.availability === availabilityFilter;

      return matchesSearch && matchesNiche && matchesAvail;
    });
  }, [creators, searchQuery, nicheFilter, availabilityFilter]);

  const handleAddCreator = (e) => {
    e.preventDefault();
    addCreator({
      ...creatorForm,
      ratePerVideo: Number(creatorForm.ratePerVideo) || 4000,
      niches: creatorForm.niches.split(',').map(s => s.trim()),
      languages: creatorForm.languages.split(',').map(s => s.trim())
    });
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Talent Roster
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-500 font-medium">UGC Creator Network</span>
          </div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Creators & Influencer Match
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Verified Indian UGC talent, niche expertise, regional languages, rates, and shoot availability.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Onboard Creator</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search creator name, city, Instagram handle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 rounded-xl bg-stone-50/70 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
            {allNiches.slice(0, 5).map(n => (
              <button
                key={n}
                onClick={() => setNicheFilter(n)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  nicheFilter === n
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {n}
              </button>
            ))}
          </div>

          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="text-xs font-medium text-stone-700 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:outline-hidden cursor-pointer"
          >
            <option value="All">All Availabilities</option>
            <option value="Available">Available</option>
            <option value="Booked">Booked</option>
            <option value="Unavailable">Unavailable</option>
          </select>
        </div>
      </div>

      {/* Creators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCreators.map(creator => (
          <div
            key={creator.id}
            className="bg-white rounded-2xl p-5 border border-stone-200/80 hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Creator Profile Header */}
              <div className="flex items-start gap-3.5">
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-500/30 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-stone-900 truncate">
                      {creator.name}
                    </h3>
                    <Badge status={creator.availability} size="xs" />
                  </div>
                  <p className="text-xs font-medium text-amber-700 mt-0.5">
                    {creator.handle}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-500">
                    <span className="flex items-center gap-0.5">
                      <MapPin className="w-3 h-3 text-stone-400" />
                      {creator.location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      {creator.rating}
                    </span>
                  </div>
                </div>
              </div>

              {/* Niches Pills */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {creator.niches?.map((niche, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700"
                  >
                    {niche}
                  </span>
                ))}
              </div>

              {/* Bio & Details */}
              <p className="text-xs text-stone-600 mt-3 line-clamp-2 leading-relaxed">
                {creator.bio}
              </p>

              <div className="mt-4 pt-3 border-t border-stone-100 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-stone-400 font-bold uppercase">Languages</span>
                  <p className="font-semibold text-stone-800 truncate mt-0.5">
                    {creator.languages?.join(', ')}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 font-bold uppercase">Rate / Video</span>
                  <p className="font-extrabold text-stone-900 mt-0.5">
                    ₹{(creator.ratePerVideo || 0).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
              <select
                value={creator.availability}
                onChange={(e) => updateCreatorAvailability(creator.id, e.target.value)}
                className="text-[11px] font-semibold bg-stone-50 border border-stone-300 rounded-lg px-2 py-1 cursor-pointer"
              >
                <option value="Available">Available</option>
                <option value="Booked">Booked</option>
                <option value="Unavailable">Unavailable</option>
              </select>

              <button
                onClick={() => setSelectedCreator(creator)}
                className="px-3 py-1.5 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                View Portfolio
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Creator Detail / Portfolio Modal */}
      {selectedCreator && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedCreator(null)}
          title={`Creator Profile: ${selectedCreator.name}`}
          subtitle={`${selectedCreator.handle} • ${selectedCreator.location} • ₹${selectedCreator.ratePerVideo?.toLocaleString('en-IN')} / video`}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-xl border border-stone-200">
              <img
                src={selectedCreator.avatar}
                alt={selectedCreator.name}
                className="w-16 h-16 rounded-2xl object-cover"
              />
              <div>
                <h4 className="text-base font-bold text-stone-900">{selectedCreator.name}</h4>
                <p className="text-xs text-amber-700 font-semibold">{selectedCreator.handle}</p>
                <p className="text-xs text-stone-500 mt-1">{selectedCreator.bio}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-400 font-bold uppercase">Completed Shoots</span>
                <p className="text-base font-extrabold text-stone-900 mt-0.5">{selectedCreator.pastShootsCount}</p>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-400 font-bold uppercase">Client Rating</span>
                <p className="text-base font-extrabold text-amber-600 mt-0.5">{selectedCreator.rating} / 5.0</p>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-400 font-bold uppercase">Commercial Rate</span>
                <p className="text-base font-extrabold text-stone-900 mt-0.5">₹{selectedCreator.ratePerVideo?.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-stone-800 uppercase mb-2">Sample UGC Deliverables</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-stone-100 text-xs">
                  <p className="font-bold text-stone-900">Zing Organics - Morning Routine</p>
                  <p className="text-[11px] text-stone-500">Hook: "Why I threw away my chemical cleanser"</p>
                </div>
                <div className="p-3 rounded-xl bg-stone-100 text-xs">
                  <p className="font-bold text-stone-900">BoldFit - Pre Workout Challenge</p>
                  <p className="text-[11px] text-stone-500">Hook: "Gym mistake that ruined my gains"</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-stone-200">
              <button
                onClick={() => setSelectedCreator(null)}
                className="px-4 py-2 bg-stone-900 text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Creator Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsAddModalOpen(false)}
          title="Onboard New UGC Creator"
        >
          <form onSubmit={handleAddCreator} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Iyer"
                  value={creatorForm.name}
                  onChange={(e) => setCreatorForm({ ...creatorForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Instagram Handle *</label>
                <input
                  type="text"
                  required
                  placeholder="@maya_lifestyle"
                  value={creatorForm.handle}
                  onChange={(e) => setCreatorForm({ ...creatorForm, handle: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Base City *</label>
                <input
                  type="text"
                  required
                  placeholder="Mumbai / Delhi / Bengaluru"
                  value={creatorForm.location}
                  onChange={(e) => setCreatorForm({ ...creatorForm, location: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Rate / Video (INR ₹)</label>
                <input
                  type="number"
                  required
                  value={creatorForm.ratePerVideo}
                  onChange={(e) => setCreatorForm({ ...creatorForm, ratePerVideo: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Niches (comma separated)</label>
              <input
                type="text"
                placeholder="Fitness, Wellness, Skincare"
                value={creatorForm.niches}
                onChange={(e) => setCreatorForm({ ...creatorForm, niches: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Languages (comma separated)</label>
              <input
                type="text"
                placeholder="English, Hindi, Hinglish, Tamil"
                value={creatorForm.languages}
                onChange={(e) => setCreatorForm({ ...creatorForm, languages: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Short Bio</label>
              <textarea
                rows={2}
                placeholder="Creator experience, camera setup, persona..."
                value={creatorForm.bio}
                onChange={(e) => setCreatorForm({ ...creatorForm, bio: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-black bg-amber-500 hover:bg-amber-600 rounded-lg cursor-pointer shadow-xs"
              >
                Onboard Creator
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
