import React, { useState } from 'react';
import { ApplicationRecord, CandidateCategory, ApplicationSource } from '../types';
import { 
  Users, 
  Search, 
  Filter, 
  Award, 
  AlertTriangle, 
  CheckCircle, 
  Calendar, 
  Briefcase, 
  Mail, 
  Eye, 
  Workflow, 
  FileText 
} from 'lucide-react';

interface CandidatesListProps {
  candidates: ApplicationRecord[];
  onSelectCandidate: (candidate: ApplicationRecord) => void;
  onOpenAddCandidate: () => void;
  isAnonymizedView: boolean;
  onQuickActionEmail?: (candidate: ApplicationRecord) => void;
  onQuickActionInterview?: (candidate: ApplicationRecord) => void;
}

export const CandidatesList: React.FC<CandidatesListProps> = ({
  candidates,
  onSelectCandidate,
  onOpenAddCandidate,
  isAnonymizedView,
  onQuickActionEmail,
  onQuickActionInterview,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSource, setSelectedSource] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'all' | 'top10'>('all');

  const categories: (CandidateCategory | 'All')[] = [
    'All',
    'Excellent Match',
    'Strong Match',
    'Suitable',
    'Potential',
    'Not Suitable',
  ];

  const sources: (ApplicationSource | 'All')[] = [
    'All',
    'Careers Website',
    'Email',
    'LinkedIn',
    'Job Portals',
    'Manual Upload',
  ];

  const filteredCandidates = candidates.filter((c) => {
    const fullName = c.extractedData ? `${c.extractedData.name} ${c.extractedData.surname}`.toLowerCase() : '';
    const matchesSearch = 
      fullName.includes(searchQuery.toLowerCase()) ||
      c.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.extractedData?.technicalSkills || []).some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesSource = selectedSource === 'All' || c.source === selectedSource;

    return matchesSearch && matchesCategory && matchesSource;
  });

  // Top 10 sorted by score
  const top10Candidates = [...candidates]
    .sort((a, b) => b.scores.overallScore - a.scores.overallScore)
    .slice(0, 10);

  const displayedList = viewMode === 'top10' ? top10Candidates : filteredCandidates;

  return (
    <div className="space-y-8">
      {/* Top Controls & Filter Bar */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            Applicant Repository & Ranking Engine <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-0.5 rounded-full border border-indigo-200/80">Steps 2, 3 & 7 Active</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse, filter, and review candidates categorized by AI semantic suitability.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Toggle */}
          <div className="bg-slate-100/80 border border-slate-200/80 p-1 rounded-xl flex items-center space-x-1 text-xs">
            <button
              onClick={() => setViewMode('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                viewMode === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All Applicants ({candidates.length})
            </button>
            <button
              onClick={() => setViewMode('top10')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1 ${
                viewMode === 'top10' ? 'bg-amber-500 text-slate-950 font-bold shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Award className="w-3.5 h-3.5" /> Top 10 Leaderboard
            </button>
          </div>

          <button
            onClick={onOpenAddCandidate}
            className="bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-sm shadow-indigo-500/20 transition active:scale-95"
          >
            + Ingest CV Application
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search candidate, skill, title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50/80 border border-slate-200 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:bg-white focus:border-cyan-500 shadow-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs">
          {/* Category Filter */}
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-500 font-medium">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50/80 border border-slate-200 text-slate-800 px-3 py-1.5 rounded-xl focus:outline-none focus:bg-white focus:border-cyan-500 shadow-xs font-medium"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Source Filter */}
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-500 font-medium">Source:</span>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="bg-slate-50/80 border border-slate-200 text-slate-800 px-3 py-1.5 rounded-xl focus:outline-none focus:bg-white focus:border-cyan-500 shadow-xs font-medium"
            >
              {sources.map((src) => (
                <option key={src} value={src}>{src}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Candidate Cards Grid */}
      <div className="space-y-3">
        {displayedList.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-12 text-center text-slate-500 space-y-3 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            <Users className="w-10 h-10 mx-auto text-slate-400" />
            <p className="text-sm font-medium">No candidates match the specified filters.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedSource('All'); }}
              className="text-xs text-cyan-700 hover:underline font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          displayedList.map((cand, index) => {
            const displayName = isAnonymizedView 
              ? `Candidate #${cand.id.replace('cand-', '')}`
              : cand.extractedData ? `${cand.extractedData.name} ${cand.extractedData.surname}` : `Candidate #${cand.id}`;

            return (
              <div
                key={cand.id}
                className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-6 hover:shadow-[0_20px_40px_rgba(15,23,42,0.07)] hover:-translate-y-0.5 transition-all duration-300 space-y-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left Column: Candidate Info */}
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      {viewMode === 'top10' && (
                        <span className="bg-amber-500 text-slate-950 font-black text-xs px-2 py-0.5 rounded-md">
                          #{index + 1}
                        </span>
                      )}
                      <h2 className="text-base font-bold text-slate-900">{displayName}</h2>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                        cand.category === 'Excellent Match' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                        cand.category === 'Strong Match' ? 'bg-indigo-50 text-indigo-800 border-indigo-200' :
                        cand.category === 'Suitable' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                        cand.category === 'Potential' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                        'bg-rose-50 text-rose-800 border-rose-200'
                      }`}>
                        {cand.category}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 flex flex-wrap items-center gap-x-4 gap-y-1">
                      <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5 text-cyan-600" /> {cand.jobTitle}</span>
                      <span>•</span>
                      <span>Experience: <strong className="text-slate-900 font-semibold">{cand.extractedData?.totalYearsExperience ?? 0} Years</strong></span>
                      <span>•</span>
                      <span>Location: <strong className="text-slate-900 font-semibold">{cand.extractedData?.location || 'N/A'}</strong></span>
                      <span>•</span>
                      <span>Source: <strong className="text-slate-500">{cand.source}</strong></span>
                    </p>
                  </div>

                  {/* Right Column: Score & Action */}
                  <div className="flex items-center space-x-4">
                    {/* Score badge */}
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Match Score</span>
                      <span className={`text-2xl font-black ${
                        cand.scores.overallScore >= 90 ? 'text-emerald-700' :
                        cand.scores.overallScore >= 80 ? 'text-indigo-700' :
                        cand.scores.overallScore >= 65 ? 'text-amber-700' : 'text-rose-700'
                      }`}>
                        {cand.scores.overallScore}%
                      </span>
                    </div>

                    {/* Action buttons */}
                    <button
                      onClick={() => onSelectCandidate(cand)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-xs transition active:scale-95"
                    >
                      Deep-Dive Inspection
                    </button>
                  </div>
                </div>

                {/* Sub details: Skills & Risks */}
                <div className="pt-3 border-t border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                  {/* Technical skills */}
                  <div className="flex items-center space-x-2 overflow-x-auto">
                    <span className="text-slate-400 text-[10px] font-bold uppercase">Skills:</span>
                    <div className="flex gap-1">
                      {(cand.extractedData?.technicalSkills || []).slice(0, 5).map((sk, i) => (
                        <span key={i} className="bg-slate-100 text-slate-700 text-[10px] px-2.5 py-0.5 rounded-full border border-slate-200/80 font-medium">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Risk pill */}
                  <div>
                    {cand.risks.length === 0 ? (
                      <span className="text-emerald-700 text-[11px] font-semibold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Zero Risk Flags
                      </span>
                    ) : (
                      <span className="text-rose-700 text-[11px] font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> {cand.risks.length} Concerns ({cand.risks[0].category})
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
