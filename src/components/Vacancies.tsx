import React, { useEffect, useState } from 'react';
import { JobProfile, EmploymentType, LocationType } from '../types';
import {
  Plus,
  Sparkles,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  Clock,
  FileText,
  Search,
  Trash2,
  AlertTriangle,
  PauseCircle,
  PlayCircle,
  Eye,
  Edit3,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { analyzeJobWithAi } from '../services/api';
import {
  formatMonthlySalaryRange,
  calculateAnnualPackage,
  getClosingDateIndicator,
  formatLocationDisplay,
} from '../utils/vacancyUtils';
import { getCompanySuggestions, CompanySuggestionItem } from '../data/companySuggestions';
import { VacancyDetailModal } from './VacancyDetailModal';
import { CreateVacancyModal } from './CreateVacancyModal';

interface VacanciesProps {
  jobs: JobProfile[];
  onAddJob: (job: JobProfile) => Promise<void> | void;
  onUpdateJob?: (job: JobProfile) => Promise<void> | void;
  onDeleteJob?: (jobId: string) => Promise<void> | void;
  onTogglePauseJob?: (jobId: string) => Promise<void> | void;
  onNavigateToWorkbench?: (jobId: string) => void;
  isOpenAddModal: boolean;
  setIsOpenAddModal: (val: boolean) => void;
}

export const Vacancies: React.FC<VacanciesProps> = ({
  jobs,
  onAddJob,
  onUpdateJob,
  onDeleteJob,
  onTogglePauseJob,
  onNavigateToWorkbench,
  isOpenAddModal,
  setIsOpenAddModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Selected vacancy for View/Edit modal
  const [selectedVacancyForModal, setSelectedVacancyForModal] = useState<JobProfile | null>(null);

  // Delete Confirmation State
  const [jobToDelete, setJobToDelete] = useState<JobProfile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredJobs = jobs.filter(
    (j) =>
      j.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConfirmDelete = async () => {
    if (!jobToDelete || !onDeleteJob) return;
    setIsDeleting(true);
    try {
      await onDeleteJob(jobToDelete.id);
      setJobToDelete(null);
    } catch (e) {
      console.error('Delete error:', e);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header Controls */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            Job Vacancy Management{' '}
            <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-0.5 rounded-full border border-indigo-200/80">
              {jobs.length} Positions Total
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create structured internal Job Profiles specifying monthly salary ranges, closing dates, work modes, and competency benchmarks.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search vacancies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-50/80 border border-slate-200 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:bg-white focus:border-cyan-500 w-48 sm:w-64 shadow-xs"
            />
          </div>
          <button
            id="create-job-profile-btn"
            onClick={() => setIsOpenAddModal(true)}
            className="bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-sm shadow-indigo-500/20 transition flex items-center space-x-1.5 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>+ Create Job Profile</span>
          </button>
        </div>
      </div>

      {/* Vacancy Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job) => {
          const isPaused = job.status === 'Paused';
          const salaryDisplay = formatMonthlySalaryRange(job.salaryMinZar, job.salaryMaxZar);
          const annualPackage = calculateAnnualPackage(job.salaryMinZar, job.salaryMaxZar);
          const closingIndicator = getClosingDateIndicator(job.closingDate);
          const locationDisplay = formatLocationDisplay(job.location, job.locationType);

          return (
            <div
              key={job.id}
              onClick={() => setSelectedVacancyForModal(job)}
              className={`bg-white/80 backdrop-blur-xl border rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between space-y-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)] cursor-pointer group hover:shadow-[0_20px_40px_rgba(15,23,42,0.08)] hover:-translate-y-1 ${
                isPaused
                  ? 'opacity-65 grayscale-[20%] border-dashed border-amber-300 bg-amber-50/15'
                  : 'border-white/80'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200/80 uppercase tracking-wide">
                      {job.department}
                    </span>
                    <h2 className="text-base font-bold text-slate-900 mt-2 line-clamp-1 group-hover:text-cyan-700 transition">
                      {job.jobTitle}
                    </h2>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {job.company}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                    {/* Status Badge */}
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                        isPaused
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}
                    >
                      {job.status}
                    </span>

                    {/* Pause / Resume Button */}
                    {onTogglePauseJob && (
                      <button
                        type="button"
                        onClick={() => onTogglePauseJob(job.id)}
                        title={isPaused ? 'Resume Vacancy' : 'Pause Vacancy'}
                        className={`p-1.5 rounded-lg border transition ${
                          isPaused
                            ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200'
                            : 'text-amber-700 bg-amber-50 hover:bg-amber-100 border-amber-200'
                        }`}
                      >
                        {isPaused ? <PlayCircle className="w-3.5 h-3.5" /> : <PauseCircle className="w-3.5 h-3.5" />}
                      </button>
                    )}

                    {/* Delete Button */}
                    {onDeleteJob && (
                      <button
                        type="button"
                        onClick={() => setJobToDelete(job)}
                        title="Delete Vacancy"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-200 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Meta details */}
                <div className="mt-4 space-y-2 text-xs text-slate-600">
                  {/* Location & Work Mode */}
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" /> Location:
                    </span>
                    <span className="font-semibold text-slate-800 truncate max-w-[170px]" title={locationDisplay}>
                      {locationDisplay}
                    </span>
                  </div>

                  {/* Monthly Salary */}
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-slate-500">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Monthly Salary:
                    </span>
                    <span className="font-semibold text-emerald-700">{salaryDisplay}</span>
                  </div>

                  {/* Auto Calculated Annual Package */}
                  <div className="flex items-center justify-between text-[11px] bg-slate-50/80 px-2 py-1 rounded-lg border border-slate-100">
                    <span className="text-slate-500 font-medium">Annual Package:</span>
                    <span className="font-semibold text-indigo-700">{annualPackage.displayText}</span>
                  </div>

                  {/* Experience & Type */}
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" /> Experience:
                    </span>
                    <span className="font-semibold text-slate-800">
                      {job.minimumExperienceYears}+ Years • {job.employmentType}
                    </span>
                  </div>

                  {/* Dynamic Closing Date Indicator */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="flex items-center gap-1 text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" /> Closing Date:
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${closingIndicator.badgeClass}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${closingIndicator.dotClass}`} />
                      {closingIndicator.label}
                    </span>
                  </div>
                </div>

                {/* Skills Tags */}
                <div className="mt-4">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1.5">
                    Required Skills:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {job.requiredSkills?.slice(0, 4).map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-100 text-slate-700 text-[10px] px-2.5 py-0.5 rounded-full border border-slate-200/80 font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.requiredSkills && job.requiredSkills.length > 4 && (
                      <span className="text-[10px] text-slate-400 font-medium px-1 py-0.5">
                        +{job.requiredSkills.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  <strong className="text-slate-900 font-bold">{job.applicantCount || 0}</strong> Applicants Received
                </span>
                <span className="text-[11px] font-bold text-cyan-700 hover:text-cyan-800 flex items-center gap-1">
                  <span>View Details</span>
                  <Eye className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* CREATE JOB VACANCY MODAL */}
      {/* ============================================================ */}
      <CreateVacancyModal
        isOpen={isOpenAddModal}
        onClose={() => setIsOpenAddModal(false)}
        onAddJob={onAddJob}
      />

      {/* ============================================================ */}
      {/* VACANCY DETAIL MODAL (VIEW MODE / EDIT MODE) */}
      {/* ============================================================ */}
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
          onNavigateToWorkbench={onNavigateToWorkbench}
        />
      )}

      {/* ============================================================ */}
      {/* CONFIRM DELETE MODAL */}
      {/* ============================================================ */}
      {jobToDelete && (
        <div
          id="confirm-delete-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setJobToDelete(null);
            }
          }}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-rose-200 rounded-3xl max-w-md w-full p-6 space-y-4 text-slate-800 shadow-[0_20px_60px_rgba(225,29,72,0.15)] animate-in fade-in zoom-in-95 duration-150 cursor-default"
          >
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Delete Vacancy Profile?</h3>
                <p className="text-xs text-rose-600 font-semibold">Irreversible Action</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2">
              <p className="text-slate-700">
                Are you sure you want to delete <strong className="text-slate-900 font-bold">"{jobToDelete.jobTitle}"</strong> ({jobToDelete.company})?
              </p>
              <p className="text-slate-500">
                This will remove the job profile from active positions and delete its entry from Supabase and the recruitment pipeline.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setJobToDelete(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-600/20 transition flex items-center space-x-1.5 active:scale-95 disabled:opacity-50"
              >
                {isDeleting ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                <span>Delete Vacancy</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
