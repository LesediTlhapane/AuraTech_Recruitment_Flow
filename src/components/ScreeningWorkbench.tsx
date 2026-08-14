import React, { useState } from 'react';
import { ApplicationRecord, JobProfile } from '../types';
import { BrainCircuit, Award, AlertTriangle, CheckCircle2, ArrowRight, Eye, Search, Layers } from 'lucide-react';

interface ScreeningWorkbenchProps {
  candidates: ApplicationRecord[];
  jobs: JobProfile[];
  onSelectCandidate: (candidate: ApplicationRecord) => void;
  isAnonymizedView: boolean;
}

export const ScreeningWorkbench: React.FC<ScreeningWorkbenchProps> = ({
  candidates,
  jobs,
  onSelectCandidate,
  isAnonymizedView,
}) => {
  const [selectedJobId, setSelectedJobId] = useState<string>('All');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('All');

  const filteredCandidates = candidates.filter((c) => {
    const matchesJob = selectedJobId === 'All' || c.jobId === selectedJobId;
    const matchesRisk = 
      selectedRiskFilter === 'All' ? true :
      selectedRiskFilter === 'WithRisks' ? c.risks.length > 0 :
      c.risks.length === 0;

    return matchesJob && matchesRisk;
  });

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            AI Screening & Reasoning Workbench <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-0.5 rounded-full border border-indigo-200/80">Automated Screening Active</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Deep-dive evaluation analyzing 12 suitability metrics, career gaps, salary fit, and executive recommendations.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-500 font-medium">Job Filter:</span>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="bg-slate-50/80 border border-slate-200 text-slate-800 px-3 py-1.5 rounded-xl focus:outline-none focus:bg-white focus:border-cyan-500 shadow-xs font-medium"
            >
              <option value="All">All Jobs ({jobs.length})</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>{j.jobTitle}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="text-slate-500 font-medium">Risk Filter:</span>
            <select
              value={selectedRiskFilter}
              onChange={(e) => setSelectedRiskFilter(e.target.value)}
              className="bg-slate-50/80 border border-slate-200 text-slate-800 px-3 py-1.5 rounded-xl focus:outline-none focus:bg-white focus:border-cyan-500 shadow-xs font-medium"
            >
              <option value="All">All Candidates</option>
              <option value="WithRisks">Flagged Risks Only</option>
              <option value="ZeroRisks">Zero Risk Profiles</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Candidate Screening Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCandidates.map((cand) => {
          const displayName = isAnonymizedView
            ? `Candidate #${cand.id.replace('cand-', '')}`
            : cand.extractedData ? `${cand.extractedData.name} ${cand.extractedData.surname}` : `Candidate #${cand.id}`;

          return (
            <div
              key={cand.id}
              className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-6 space-y-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)] hover:shadow-[0_20px_40px_rgba(15,23,42,0.07)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      {displayName}
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                        cand.category === 'Excellent Match' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                        cand.category === 'Strong Match' ? 'bg-indigo-50 text-indigo-800 border-indigo-200' :
                        cand.category === 'Suitable' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                        cand.category === 'Potential' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                        'bg-rose-50 text-rose-800 border-rose-200'
                      }`}>
                        {cand.category}
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">{cand.jobTitle}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Overall Fit</span>
                    <span className={`text-2xl font-black ${
                      cand.scores.overallScore >= 90 ? 'text-emerald-700' :
                      cand.scores.overallScore >= 80 ? 'text-indigo-700' :
                      cand.scores.overallScore >= 65 ? 'text-amber-700' : 'text-rose-700'
                    }`}>
                      {cand.scores.overallScore}%
                    </span>
                  </div>
                </div>

                {/* Executive Summary Box */}
                <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 space-y-1.5 text-xs">
                  <span className="text-indigo-900 font-bold flex items-center gap-1">
                    <BrainCircuit className="w-3.5 h-3.5 text-cyan-600" /> AI Executive Analysis:
                  </span>
                  <p className="text-slate-900 font-semibold">{cand.summary.headline}</p>
                  <p className="text-slate-600 line-clamp-2">{cand.summary.experienceOverview}</p>
                </div>

                {/* Score Pills Grid */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/80">
                    <span className="text-slate-500 text-[10px] block font-medium">Skills</span>
                    <span className="font-bold text-cyan-700 text-sm">{cand.scores.skillsMatch}%</span>
                  </div>
                  <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/80">
                    <span className="text-slate-500 text-[10px] block font-medium">Experience</span>
                    <span className="font-bold text-cyan-700 text-sm">{cand.scores.experienceMatch}%</span>
                  </div>
                  <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/80">
                    <span className="text-slate-500 text-[10px] block font-medium">Education</span>
                    <span className="font-bold text-cyan-700 text-sm">{cand.scores.educationMatch}%</span>
                  </div>
                </div>

                {/* Risks Section */}
                <div className="text-xs space-y-1.5">
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Risk & Stability Assessment:</span>
                  {cand.risks.length === 0 ? (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Zero Concerns Identified
                    </span>
                  ) : (
                    cand.risks.map((r, i) => (
                      <div key={i} className="bg-rose-50/80 border border-rose-200 text-rose-900 p-2.5 rounded-xl flex justify-between items-center text-xs">
                        <span>⚠️ <strong>{r.category}:</strong> {r.description}</span>
                        <span className="text-[10px] bg-rose-600 text-white font-bold px-2 py-0.5 rounded-full">{r.severity}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-slate-200/80 flex justify-end">
                <button
                  onClick={() => onSelectCandidate(cand)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition shadow-xs active:scale-95"
                >
                  <span>Full 12-Factor Inspection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
