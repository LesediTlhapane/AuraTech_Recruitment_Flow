import React, { useState } from 'react';
import { ApplicationRecord, JobProfile, ApplicationStatus } from '../types';
import { 
  Users, 
  BrainCircuit, 
  Award, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  TrendingUp,
  XCircle,
  FileSpreadsheet,
  Briefcase,
  Plus,
  Search,
  Filter,
  ChevronRight,
  Check,
  Sparkles,
  MapPin,
  Building2,
  DollarSign,
  Eye,
  PauseCircle,
  PlayCircle
} from 'lucide-react';
import {
  formatMonthlySalaryRange,
  calculateAnnualPackage,
  getClosingDateIndicator,
  formatLocationDisplay,
} from '../utils/vacancyUtils';
import { VacancyDetailModal } from './VacancyDetailModal';

interface DashboardProps {
  candidates: ApplicationRecord[];
  jobs: JobProfile[];
  onSelectCandidate: (cand: ApplicationRecord) => void;
  onNavigateTab: (tab: string) => void;
  onOpenAddCandidate: () => void;
  onOpenAddJob?: () => void;
  onUpdateJob?: (job: JobProfile) => Promise<void> | void;
  onDeleteJob?: (jobId: string) => Promise<void> | void;
  onTogglePauseJob?: (jobId: string) => Promise<void> | void;
  isAnonymizedView: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({
  candidates,
  jobs,
  onSelectCandidate,
  onNavigateTab,
  onOpenAddCandidate,
  onOpenAddJob,
  onUpdateJob,
  onDeleteJob,
  onTogglePauseJob,
  isAnonymizedView,
}) => {
  // State for filtering dashboard by vacancy and stage
  const [selectedJobId, setSelectedJobId] = useState<string>('ALL');
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // State for opening Vacancy Detail Modal from dashboard cards
  const [selectedVacancyForModal, setSelectedVacancyForModal] = useState<JobProfile | null>(null);

  // Filter candidates by selected job vacancy first
  const jobFilteredCandidates = candidates.filter((c) => {
    if (selectedJobId === 'ALL') return true;
    const selectedJob = jobs.find(j => j.id === selectedJobId);
    return c.jobId === selectedJobId || (selectedJob && c.jobTitle.toLowerCase() === selectedJob.jobTitle.toLowerCase());
  });

  // KPI Calculations based on job-filtered candidates
  const totalReceived = jobFilteredCandidates.length;
  const screenedCount = jobFilteredCandidates.filter((c) => c.status !== 'New').length;
  const topMatches = jobFilteredCandidates.filter((c) => c.category === 'Excellent Match' || c.category === 'Strong Match').length;
  const inInterview = jobFilteredCandidates.filter((c) => c.status === 'Interview Scheduled' || c.status === 'Assessment Sent').length;
  const offersCount = jobFilteredCandidates.filter((c) => c.status === 'Offer Extended').length;
  const rejectedCount = jobFilteredCandidates.filter((c) => c.status === 'Rejected').length;

  const avgScore = jobFilteredCandidates.length > 0
    ? Math.round(jobFilteredCandidates.reduce((acc, c) => acc + c.scores.overallScore, 0) / jobFilteredCandidates.length)
    : 0;

  // Estimated hours saved (approx 3.5 hrs manual screening per candidate)
  const hoursSaved = Math.round(screenedCount * 3.5);

  // Apply stage filter to candidate leaderboard table
  const displayedCandidates = jobFilteredCandidates.filter((c) => {
    // Stage filter
    if (selectedStageFilter === 'Received') {
      // Show all
    } else if (selectedStageFilter === 'Screened') {
      if (c.status === 'New') return false;
    } else if (selectedStageFilter === 'Shortlisted') {
      if (!(c.category === 'Excellent Match' || c.category === 'Strong Match' || c.status === 'Shortlisted')) return false;
    } else if (selectedStageFilter === 'Interview') {
      if (!(c.status === 'Interview Scheduled' || c.status === 'Assessment Sent')) return false;
    } else if (selectedStageFilter === 'Offers') {
      if (c.status !== 'Offer Extended') return false;
    }

    // Category filter
    if (categoryFilter !== 'ALL' && c.category !== categoryFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const name = c.extractedData ? `${c.extractedData.name} ${c.extractedData.surname}`.toLowerCase() : '';
      const title = c.jobTitle.toLowerCase();
      const skills = (c.extractedData?.technicalSkills || []).join(' ').toLowerCase();
      return name.includes(q) || title.includes(q) || skills.includes(q);
    }

    return true;
  }).sort((candidateA, candidateB) => {
    const scoreDifference = candidateB.scores.overallScore - candidateA.scores.overallScore;
    if (scoreDifference !== 0) return scoreDifference;

    const nameA = `${candidateA.extractedData?.name || ''} ${candidateA.extractedData?.surname || ''}`.trim();
    const nameB = `${candidateB.extractedData?.name || ''} ${candidateB.extractedData?.surname || ''}`.trim();
    return nameA.localeCompare(nameB);
  });

  // Dynamic Recruiter Actions
  const actionRequiredCandidates = candidates.filter((c) => {
    if (c.status === 'Shortlisted' || c.status === 'Screened' && c.scores.overallScore >= 80) return true;
    if (c.risks && c.risks.length > 0) return true;
    if (c.status === 'New') return true;
    if (c.status === 'Offer Extended') return true;
    return false;
  }).slice(0, 4);

  const selectedJobObject = jobs.find(j => j.id === selectedJobId);

  return (
    <div className="space-y-8">
      {/* Top Banner & Control Center Header */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 sm:p-7 text-slate-800 dark:text-slate-200 shadow-[0_10px_30px_rgba(15,23,42,0.04)] relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-200/80 dark:border-indigo-500/40">
                Aura AI Platform
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-200/80 dark:border-emerald-500/40">
                POPIA Compliant
              </span>
              {selectedJobId !== 'ALL' && selectedJobObject && (
                <span className="text-[11px] font-bold bg-cyan-50 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 px-2.5 py-0.5 rounded-full border border-cyan-200 dark:border-cyan-500/40 flex items-center gap-1">
                  <Briefcase className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                  Filtered: {selectedJobObject.jobTitle}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Recruiter Control Center
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              AI-driven candidate screening and bias-free ranking across{' '}
              <strong className="text-cyan-700 dark:text-cyan-400 font-semibold">{jobs.length} open job vacancies</strong> in South Africa.
            </p>
          </div>

          {/* Quick Action Controls & Job Vacancy Dropdown */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Vacancy Selector Dropdown */}
            <div className="relative">
              <label htmlFor="vacancy-filter-select" className="sr-only">Filter by Vacancy</label>
              <select
                id="vacancy-filter-select"
                aria-label="Filter dashboard by job vacancy"
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-semibold text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer shadow-xs"
              >
                <option value="ALL">All Vacancies ({jobs.length})</option>
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.jobTitle} ({candidates.filter(c => c.jobId === job.id || c.jobTitle.toLowerCase() === job.jobTitle.toLowerCase()).length} Applicants)
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => onNavigateTab('workbench')}
              className="bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-sm shadow-indigo-500/20 transition flex items-center space-x-2 active:scale-95 shrink-0"
            >
              <BrainCircuit className="w-4 h-4 text-white" />
              <span>Launch Screening</span>
            </button>

            <button
              onClick={() => {
                onNavigateTab('vacancies');
                if (onOpenAddJob) onOpenAddJob();
              }}
              className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition flex items-center space-x-1.5 shadow-sm active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>New Vacancy</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {/* Card 1 */}
        <div 
          onClick={() => onNavigateTab('candidates')}
          className="bg-white/90 backdrop-blur-md border border-white/80 rounded-2xl p-4 flex flex-col justify-between shadow-[0_8px_25px_rgba(15,23,42,0.04)] hover:shadow-[0_16px_35px_rgba(15,23,42,0.08)] hover:-translate-y-1 transition-all duration-200 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold">Received</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-900">{totalReceived}</span>
            <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Total Applications</p>
          </div>
        </div>

        {/* Card 2 */}
        <div 
          onClick={() => onNavigateTab('workbench')}
          className="bg-white/90 backdrop-blur-md border border-white/80 rounded-2xl p-4 flex flex-col justify-between shadow-[0_8px_25px_rgba(15,23,42,0.04)] hover:shadow-[0_16px_35px_rgba(15,23,42,0.08)] hover:-translate-y-1 transition-all duration-200 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold">Screened</span>
            <BrainCircuit className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-indigo-700">{screenedCount}</span>
            <p className="text-[10px] text-slate-500 mt-0.5 font-medium">AI Evaluated</p>
          </div>
        </div>

        {/* Card 3 */}
        <div 
          onClick={() => onNavigateTab('candidates')}
          className="bg-white/90 backdrop-blur-md border border-white/80 rounded-2xl p-4 flex flex-col justify-between shadow-[0_8px_25px_rgba(15,23,42,0.04)] hover:shadow-[0_16px_35px_rgba(15,23,42,0.08)] hover:-translate-y-1 transition-all duration-200 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold">Top Match</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-emerald-700">{topMatches}</span>
            <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Excellent/Strong</p>
          </div>
        </div>

        {/* Card 4 */}
        <div 
          onClick={() => onNavigateTab('scheduling')}
          className="bg-white/90 backdrop-blur-md border border-white/80 rounded-2xl p-4 flex flex-col justify-between shadow-[0_8px_25px_rgba(15,23,42,0.04)] hover:shadow-[0_16px_35px_rgba(15,23,42,0.08)] hover:-translate-y-1 transition-all duration-200 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold">Interviews</span>
            <Calendar className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-amber-700">{inInterview}</span>
            <p className="text-[10px] text-slate-500 mt-0.5 font-medium">In Pipeline</p>
          </div>
        </div>

        {/* Card 5 */}
        <div 
          onClick={() => onNavigateTab('communications')}
          className="bg-white/90 backdrop-blur-md border border-white/80 rounded-2xl p-4 flex flex-col justify-between shadow-[0_8px_25px_rgba(15,23,42,0.04)] hover:shadow-[0_16px_35px_rgba(15,23,42,0.08)] hover:-translate-y-1 transition-all duration-200 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold">Offers</span>
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-green-700">{offersCount}</span>
            <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Extended</p>
          </div>
        </div>

        {/* Card 6 */}
        <div onClick={() => onNavigateTab('candidates')} className="bg-white/90 backdrop-blur-md border border-white/80 rounded-2xl p-4 flex flex-col justify-between shadow-[0_8px_25px_rgba(15,23,42,0.04)] hover:shadow-[0_16px_35px_rgba(15,23,42,0.08)] hover:-translate-y-1 transition-all duration-200 cursor-pointer">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold">Rejected</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-rose-700">{rejectedCount}</span>
            <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Not Suitable</p>
          </div>
        </div>

        {/* Card 7 */}
        <div onClick={() => onNavigateTab('analytics')} className="bg-white/90 backdrop-blur-md border border-white/80 rounded-2xl p-4 flex flex-col justify-between shadow-[0_8px_25px_rgba(15,23,42,0.04)] hover:shadow-[0_16px_35px_rgba(15,23,42,0.08)] hover:-translate-y-1 transition-all duration-200 cursor-pointer">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold">Avg Score</span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-purple-700">{avgScore}%</span>
            <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Suitability Fit</p>
          </div>
        </div>

        {/* Card 8 */}
        <div onClick={() => onNavigateTab('analytics')} className="bg-white/90 backdrop-blur-md border border-white/80 rounded-2xl p-4 flex flex-col justify-between shadow-[0_8px_25px_rgba(15,23,42,0.04)] hover:shadow-[0_16px_35px_rgba(15,23,42,0.08)] hover:-translate-y-1 transition-all duration-200 cursor-pointer">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold">Time Saved</span>
            <Clock className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-cyan-700">{hoursSaved}h</span>
            <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Workload Reduced</p>
          </div>
        </div>
      </div>

      {/* Active Vacancies Showcase Grid */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-cyan-600" /> Active Job Vacancies ({jobs.length})
            </h2>
            <p className="text-xs text-slate-500">
              Overview of all active vacancies in the recruitment pipeline. Select a vacancy to filter candidate scoring.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {selectedJobId !== 'ALL' && (
              <button
                onClick={() => setSelectedJobId('ALL')}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-1.5 rounded-lg transition"
              >
                Clear Vacancy Filter
              </button>
            )}
            <button
              onClick={() => onNavigateTab('vacancies')}
              className="text-xs text-cyan-700 hover:text-cyan-800 font-semibold flex items-center space-x-1"
            >
              <span>Manage Vacancies</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {jobs.map((job) => {
            const jobApplicants = candidates.filter(
              (c) => c.jobId === job.id || c.jobTitle.toLowerCase() === job.jobTitle.toLowerCase()
            );
            const jobTopMatches = jobApplicants.filter(
              (c) => c.category === 'Excellent Match' || c.category === 'Strong Match'
            ).length;
            const isSelected = selectedJobId === job.id;
            const isPaused = job.status === 'Paused';
            const salaryDisplay = formatMonthlySalaryRange(job.salaryMinZar, job.salaryMaxZar);
            const annualPackage = calculateAnnualPackage(job.salaryMinZar, job.salaryMaxZar);
            const closingIndicator = getClosingDateIndicator(job.closingDate);
            const locationDisplay = formatLocationDisplay(job.location, job.locationType);

            return (
              <div
                key={job.id}
                onClick={() => setSelectedVacancyForModal(job)}
                className={`rounded-xl p-4 border transition-all duration-200 flex flex-col justify-between cursor-pointer group hover:shadow-md ${
                  isPaused
                    ? 'opacity-65 grayscale-[20%] border-dashed border-amber-300 bg-amber-50/15'
                    : isSelected
                    ? 'border-cyan-500 ring-2 ring-cyan-500/20 bg-cyan-50/30 shadow-md'
                    : 'bg-slate-50/80 border-slate-200/80 hover:border-slate-300 hover:bg-slate-100/50'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-200/60 px-2 py-0.5 rounded">
                      {job.department}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isPaused
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {job.status || 'Open'}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 leading-snug line-clamp-2 group-hover:text-cyan-700 transition">
                    {job.jobTitle}
                  </h3>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                    <Building2 className="w-3 h-3 text-slate-400 shrink-0" /> {job.company}
                  </p>

                  <div className="mt-2.5 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{locationDisplay}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="font-semibold text-emerald-700">{salaryDisplay}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] bg-white/70 px-2 py-0.5 rounded border border-slate-200/60">
                      <span className="text-slate-500">Annual:</span>
                      <span className="font-semibold text-indigo-700">{annualPackage.displayText}</span>
                    </div>
                    <div className="flex items-center justify-between pt-0.5">
                      <span className="text-slate-500 text-[11px] flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" /> Closes:
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${closingIndicator.badgeClass}`}
                      >
                        <span className={`w-1 h-1 rounded-full ${closingIndicator.dotClass}`} />
                        {closingIndicator.label}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/80">
                  <div className="flex justify-between items-center text-xs mb-3">
                    <span className="text-slate-500">
                      Applicants: <strong className="text-slate-900 font-bold">{jobApplicants.length}</strong>
                    </span>
                    <span className="text-emerald-700 font-semibold">{jobTopMatches} Top Match</span>
                  </div>

                  <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => setSelectedJobId(isSelected ? 'ALL' : job.id)}
                      className={`flex-1 text-xs py-1.5 rounded-lg font-semibold transition text-center ${
                        isSelected
                          ? 'bg-cyan-600 text-white'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'Filter Funnel'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedJobId(job.id);
                        onNavigateTab('workbench');
                      }}
                      className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs px-2.5 py-1.5 rounded-lg font-semibold transition"
                      title="Screen Candidates for this vacancy"
                    >
                      Screen →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Quick Create Card */}
          {onOpenAddJob && (
            <button
              type="button"
              onClick={() => {
                onNavigateTab('vacancies');
                if (onOpenAddJob) onOpenAddJob();
              }}
              className="bg-dashed bg-white border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 hover:bg-indigo-50/30 group min-h-[180px] w-full text-left"
            >
              <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                <Plus className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Create New Vacancy</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-[180px]">Add a new position to start receiving AI-screened candidates.</p>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Funnel + Urgent Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recruitment Funnel Visualizer */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                Recruitment Pipeline Funnel
                {selectedStageFilter !== 'ALL' && (
                  <span className="text-xs bg-indigo-100 text-indigo-800 font-semibold px-2 py-0.5 rounded-md">
                    Filtered: Stage {selectedStageFilter}
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500">
                Click any pipeline stage below to filter the candidate list below ({totalReceived} total applicants in view)
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {selectedStageFilter !== 'ALL' && (
                <button
                  onClick={() => setSelectedStageFilter('ALL')}
                  className="text-xs text-slate-600 hover:text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg font-medium transition"
                >
                  Reset Stage
                </button>
              )}
              <button
                onClick={() => onNavigateTab('analytics')}
                className="text-xs text-cyan-700 hover:text-cyan-800 font-semibold flex items-center space-x-1"
              >
                <span>View Full BI Analytics</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { id: 'Received', label: '1. Applications Received', count: totalReceived, color: 'bg-blue-600', width: totalReceived > 0 ? '100%' : '0%', pct: totalReceived > 0 ? 100 : 0 },
              { id: 'Screened', label: '2. Candidates AI Screened', count: screenedCount, color: 'bg-indigo-600', width: totalReceived > 0 ? `${Math.round((screenedCount/totalReceived)*100)}%` : '0%', pct: totalReceived > 0 ? Math.round((screenedCount/totalReceived)*100) : 0 },
              { id: 'Shortlisted', label: '3. Shortlisted / Top Matches', count: topMatches, color: 'bg-purple-600', width: totalReceived > 0 ? `${Math.round((topMatches/totalReceived)*100)}%` : '0%', pct: totalReceived > 0 ? Math.round((topMatches/totalReceived)*100) : 0 },
              { id: 'Interview', label: '4. Interview Pipeline', count: inInterview, color: 'bg-amber-600', width: totalReceived > 0 ? `${Math.round((inInterview/totalReceived)*100)}%` : '0%', pct: totalReceived > 0 ? Math.round((inInterview/totalReceived)*100) : 0 },
              { id: 'Offers', label: '5. Offers Extended', count: offersCount, color: 'bg-emerald-600', width: totalReceived > 0 ? `${Math.round((offersCount/totalReceived)*100)}%` : '0%', pct: totalReceived > 0 ? Math.round((offersCount/totalReceived)*100) : 0 },
            ].map((stage) => {
              const isActive = selectedStageFilter === stage.id;

              return (
                <div 
                  key={stage.id} 
                  onClick={() => setSelectedStageFilter(isActive ? 'ALL' : stage.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer group ${
                    isActive 
                      ? 'bg-indigo-50/80 border-indigo-400 shadow-sm ring-2 ring-indigo-500/20' 
                      : 'bg-slate-50/80 border-slate-200/80 hover:border-slate-300 hover:bg-slate-100/60'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-2">
                    <span className="group-hover:text-slate-900 transition flex items-center gap-1.5">
                      {stage.label}
                      <span className="opacity-0 group-hover:opacity-100 text-[10px] text-indigo-600 font-bold transition">
                        (Click to filter)
                      </span>
                    </span>
                    <span className="font-bold text-slate-900 flex items-center gap-2">
                      {stage.count} <span className="text-slate-500 font-normal">({stage.pct}%)</span>
                      {isActive && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200/80 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`${stage.color} h-full transition-all duration-500 rounded-full`}
                      style={{ width: stage.width }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Needed / High Match Queue */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" /> Recruiter Actions Needed
              </h2>
              <span className="text-[10px] bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-full font-bold border border-amber-200">
                {actionRequiredCandidates.length} Active
              </span>
            </div>

            <div className="space-y-3">
              {actionRequiredCandidates.length === 0 ? (
                <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-center space-y-1">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                  <p className="font-bold text-emerald-900">All Recruiter Actions Up To Date!</p>
                  <p className="text-emerald-700">All current candidates in this view have been processed or evaluated.</p>
                </div>
              ) : (
                actionRequiredCandidates.map((cand) => {
                  const displayName = isAnonymizedView 
                    ? `Candidate #${cand.id.replace('cand-', '')}`
                    : cand.extractedData ? `${cand.extractedData.name} ${cand.extractedData.surname}` : `Candidate #${cand.id}`;

                  let actionText = '';
                  let actionBtnText = '';
                  let targetTab = 'workbench';

                  if (cand.status === 'Shortlisted' || (cand.status === 'Screened' && cand.scores.overallScore >= 80)) {
                    actionText = 'Shortlisted top candidate ready for interview scheduling.';
                    actionBtnText = 'Schedule Interview →';
                    targetTab = 'scheduling';
                  } else if (cand.risks && cand.risks.length > 0) {
                    actionText = `Flagged: ${cand.risks[0].description}`;
                    actionBtnText = 'Review Risk Analysis →';
                    targetTab = 'workbench';
                  } else if (cand.status === 'New') {
                    actionText = 'New application submitted needing AI screening execution.';
                    actionBtnText = 'Run AI Screen →';
                    targetTab = 'workbench';
                  } else {
                    actionText = `Status: ${cand.status}. Review candidate profile.`;
                    actionBtnText = 'Deep-Dive Review →';
                    targetTab = 'workbench';
                  }

                  return (
                    <div key={cand.id} className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 text-xs space-y-1 hover:border-slate-300 transition">
                      <div className="flex justify-between text-slate-900 font-bold">
                        <span>{displayName} ({cand.scores.overallScore}% Score)</span>
                        <span className="text-amber-800 font-bold">{cand.status}</span>
                      </div>
                      <p className="text-slate-600 line-clamp-2">{actionText}</p>
                      <button
                        onClick={() => {
                          onSelectCandidate(cand);
                          if (targetTab !== 'workbench') {
                            onNavigateTab(targetTab);
                          }
                        }}
                        className="mt-2 text-cyan-700 hover:text-cyan-800 font-bold text-xs underline inline-block"
                      >
                        {actionBtnText}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200/80 text-xs text-slate-500">
            <p>💡 <strong>Recruiter Oversight Rule:</strong> AI assists with screening, scoring, and drafting communications, but human recruiters make 100% of final hiring decisions.</p>
          </div>
        </div>
      </div>

      {/* Candidate Leaderboard Table */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              Top Candidate Rankings
              <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-semibold">
                {displayedCandidates.length} Candidates
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Candidates scored & ranked by Aura 12-Factor Intelligence Engine
            </p>
          </div>

          {/* Table Filters & Search */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search candidates or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48 sm:w-64"
              />
            </div>

            <select
              aria-label="Filter candidates by match category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="ALL">All Match Categories</option>
              <option value="Excellent Match">Excellent Match</option>
              <option value="Strong Match">Strong Match</option>
              <option value="Suitable">Suitable</option>
              <option value="Potential">Potential</option>
              <option value="Not Suitable">Not Suitable</option>
            </select>

            <button
              onClick={() => onNavigateTab('candidates')}
              className="text-xs text-cyan-700 hover:text-cyan-800 font-semibold flex items-center space-x-1 pl-2"
            >
              <span>Full Directory →</span>
            </button>
          </div>
        </div>

        {displayedCandidates.length === 0 ? (
          <div className="p-8 text-center bg-slate-50/50 rounded-xl border border-slate-200/80 my-4">
            <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-700">No Candidates Found</h3>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your vacancy or stage filter, or add a candidate to this vacancy.</p>
            <button
              onClick={onOpenAddCandidate}
              className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2 rounded-lg transition"
            >
              + Add Candidate to Vacancy
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/80 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 rounded-l-xl font-bold">Candidate</th>
                  <th className="px-4 py-3 font-bold">Applied Vacancy</th>
                  <th className="px-4 py-3 font-bold">Overall Score</th>
                  <th className="px-4 py-3 font-bold">Category</th>
                  <th className="px-4 py-3 font-bold">Risks</th>
                  <th className="px-4 py-3 font-bold">Status</th>
                  <th className="px-4 py-3 rounded-r-xl text-right font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {displayedCandidates.map((cand) => {
                  const displayName = isAnonymizedView 
                    ? `Candidate #${cand.id.replace('cand-', '')}`
                    : cand.extractedData ? `${cand.extractedData.name} ${cand.extractedData.surname}` : `Candidate #${cand.id}`;

                  return (
                    <tr key={cand.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        <div>
                          {displayName}
                          <p className="text-[10px] text-slate-500 font-normal">{cand.extractedData?.location || 'N/A'}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-700">{cand.jobTitle}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <span className={`font-extrabold text-sm ${
                            cand.scores.overallScore >= 90 ? 'text-emerald-700' :
                            cand.scores.overallScore >= 80 ? 'text-indigo-700' :
                            cand.scores.overallScore >= 65 ? 'text-amber-700' : 'text-rose-700'
                          }`}>
                            {cand.scores.overallScore}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          cand.category === 'Excellent Match' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                          cand.category === 'Strong Match' ? 'bg-indigo-50 text-indigo-800 border border-indigo-200' :
                          cand.category === 'Suitable' ? 'bg-blue-50 text-blue-800 border border-blue-200' :
                          cand.category === 'Potential' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                          'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}>
                          {cand.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {cand.risks.length === 0 ? (
                          <span className="text-slate-400 text-[10px]">None</span>
                        ) : (
                          <span className="bg-rose-50 text-rose-800 text-[10px] px-2 py-0.5 rounded-full font-bold border border-rose-200">
                            {cand.risks.length} Risk Flag{cand.risks.length > 1 ? 's' : ''}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-semibold border border-slate-200">
                          {cand.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => onSelectCandidate(cand)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-lg text-[10px] font-semibold transition shadow-xs active:scale-95"
                        >
                          Deep-Dive Review
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Vacancy Detail Modal */}
      {selectedVacancyForModal && (
        <VacancyDetailModal
          job={selectedVacancyForModal}
          onClose={() => setSelectedVacancyForModal(null)}
          onUpdateJob={async (updatedJob) => {
            if (onUpdateJob) {
              await onUpdateJob(updatedJob);
            }
            setSelectedVacancyForModal(updatedJob);
          }}
          onDeleteJob={async (jobId) => {
            if (onDeleteJob) {
              await onDeleteJob(jobId);
            }
            setSelectedVacancyForModal(null);
          }}
          onTogglePauseJob={async (jobId) => {
            if (onTogglePauseJob) {
              await onTogglePauseJob(jobId);
            }
            setSelectedVacancyForModal((prev) =>
              prev ? { ...prev, status: prev.status === 'Paused' ? 'Open' : 'Paused' } : null
            );
          }}
          onNavigateToWorkbench={(jobId) => {
            setSelectedJobId(jobId);
            onNavigateTab('workbench');
          }}
        />
      )}
    </div>
  );
};
