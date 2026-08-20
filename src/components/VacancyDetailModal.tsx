import React, { useState } from 'react';
import { JobProfile, LocationType, EmploymentType } from '../types';
import {
  X,
  Building2,
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  Clock,
  GraduationCap,
  Sparkles,
  Edit3,
  Trash2,
  PauseCircle,
  PlayCircle,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ArrowLeft,
  Save,
  Users,
} from 'lucide-react';
import {
  formatMonthlySalaryRange,
  calculateAnnualPackage,
  getClosingDateIndicator,
  formatLocationDisplay,
} from '../utils/vacancyUtils';
import { getCompanySuggestions, CompanySuggestionItem } from '../data/companySuggestions';

interface VacancyDetailModalProps {
  job: JobProfile;
  onClose: () => void;
  onUpdateJob: (updatedJob: JobProfile) => Promise<void> | void;
  onDeleteJob: (jobId: string) => Promise<void> | void;
  onTogglePauseJob: (jobId: string) => Promise<void> | void;
  onNavigateToWorkbench?: (jobId: string) => void;
}

export const VacancyDetailModal: React.FC<VacancyDetailModalProps> = ({
  job,
  onClose,
  onUpdateJob,
  onDeleteJob,
  onTogglePauseJob,
  onNavigateToWorkbench,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Edit form state
  const [jobTitle, setJobTitle] = useState(job.jobTitle);
  const [department, setDepartment] = useState(job.department);
  const [company, setCompany] = useState(job.company);
  const [location, setLocation] = useState(job.location);
  const [locationType, setLocationType] = useState<LocationType>(job.locationType || 'Hybrid');
  const [employmentType, setEmploymentType] = useState<EmploymentType>(job.employmentType || 'Full Time');
  const [salaryMinZar, setSalaryMinZar] = useState<number>(job.salaryMinZar);
  const [salaryMaxZar, setSalaryMaxZar] = useState<number>(job.salaryMaxZar);
  const [minimumExperienceYears, setMinimumExperienceYears] = useState<number>(job.minimumExperienceYears);
  const [qualificationsString, setQualificationsString] = useState(
    Array.isArray(job.qualifications) ? job.qualifications.join('\n') : ''
  );
  const [requiredSkillsString, setRequiredSkillsString] = useState(
    Array.isArray(job.requiredSkills) ? job.requiredSkills.join(', ') : ''
  );
  const [preferredSkillsString, setPreferredSkillsString] = useState(
    Array.isArray(job.preferredSkills) ? job.preferredSkills.join(', ') : ''
  );
  const [jobDescription, setJobDescription] = useState(job.jobDescription);
  const [closingDate, setClosingDate] = useState(job.closingDate || '');

  // Company suggestions in edit mode
  const [companySuggestions, setCompanySuggestions] = useState<CompanySuggestionItem[]>([]);
  const [suggestedLocationHint, setSuggestedLocationHint] = useState<string | null>(null);

  // Calculations
  const salaryDisplay = formatMonthlySalaryRange(job.salaryMinZar, job.salaryMaxZar);
  const annualPackage = calculateAnnualPackage(job.salaryMinZar, job.salaryMaxZar);
  const closingIndicator = getClosingDateIndicator(job.closingDate);
  const isPaused = job.status === 'Paused';

  // Live calculated annual package for edit mode
  const editAnnualPackage = calculateAnnualPackage(salaryMinZar, salaryMaxZar);

  const handleCompanyChange = (val: string) => {
    setCompany(val);
    if (val.length >= 2) {
      const suggestions = getCompanySuggestions(val, [job.company]);
      setCompanySuggestions(suggestions);
    } else {
      setCompanySuggestions([]);
    }
  };

  const handleSelectCompany = (item: CompanySuggestionItem) => {
    setCompany(item.name);
    setLocation(item.knownLocation);
    setLocationType(item.defaultLocationType);
    setSuggestedLocationHint(`Suggested location: ${item.knownLocation} (Recruiter can change)`);
    setCompanySuggestions([]);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const updatedJob: JobProfile = {
      ...job,
      jobTitle: jobTitle.trim() || 'Untitled Position',
      department: department.trim() || 'General',
      company: company.trim() || 'Enterprise Client',
      location: location.trim() || 'South Africa',
      locationType,
      employmentType,
      salaryMinZar: Number(salaryMinZar || 0),
      salaryMaxZar: Number(salaryMaxZar || 0),
      minimumExperienceYears: Number(minimumExperienceYears || 0),
      qualifications: qualificationsString
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      requiredSkills: requiredSkillsString
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      preferredSkills: preferredSkillsString
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      jobDescription,
      closingDate,
    };

    try {
      await onUpdateJob(updatedJob);
      setIsSaving(false);
      setIsEditMode(false);
    } catch (err) {
      console.error('Error saving job:', err);
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onDeleteJob(job.id);
      onClose();
    } catch (err) {
      console.error('Error deleting job:', err);
      setIsDeleting(false);
    }
  };

  return (
    <div
      id="vacancy-detail-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !showDeleteConfirm) {
          onClose();
        }
      }}
    >
      <div
        id="vacancy-detail-modal-container"
        className="bg-white border border-slate-200/90 rounded-2xl shadow-2xl max-w-4xl w-full my-8 max-h-[90vh] flex flex-col overflow-hidden text-slate-900 animate-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 via-white to-slate-50/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-sm shrink-0 ${
                isPaused
                  ? 'bg-amber-100 text-amber-700 border border-amber-200'
                  : 'bg-gradient-to-br from-cyan-600 to-indigo-600 text-white shadow-cyan-600/20'
              }`}
            >
              <Briefcase className="w-5 h-5" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight truncate">
                  {isEditMode ? 'Edit Vacancy Profile' : job.jobTitle}
                </h2>
                {!isEditMode && (
                  <>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        isPaused
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isPaused ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                      />
                      {job.status}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs ${closingIndicator.badgeClass}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${closingIndicator.dotClass}`} />
                      {closingIndicator.label}
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                {job.company} • {job.department} • {formatLocationDisplay(job.location, job.locationType)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {!isEditMode && (
              <>
                {/* Pause / Resume Button */}
                <button
                  id="vacancy-modal-toggle-pause-btn"
                  type="button"
                  onClick={() => onTogglePauseJob(job.id)}
                  title={isPaused ? 'Resume Vacancy' : 'Pause Vacancy'}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition shadow-sm border ${
                    isPaused
                      ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-300'
                      : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-300'
                  }`}
                >
                  {isPaused ? (
                    <>
                      <PlayCircle className="w-4 h-4" />
                      <span>Resume</span>
                    </>
                  ) : (
                    <>
                      <PauseCircle className="w-4 h-4" />
                      <span>Pause</span>
                    </>
                  )}
                </button>

                {/* Edit Button */}
                <button
                  id="vacancy-modal-edit-btn"
                  type="button"
                  onClick={() => setIsEditMode(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border border-cyan-200 shadow-sm transition"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>

                {/* Delete Button */}
                <button
                  id="vacancy-modal-delete-btn"
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  title="Delete Vacancy"
                  className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}

            {isEditMode && (
              <button
                type="button"
                onClick={() => setIsEditMode(false)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
            )}

            <button
              id="vacancy-modal-close-btn"
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* ======================================================== */}
          {/* VIEW MODE */}
          {/* ======================================================== */}
          {!isEditMode && (
            <div className="space-y-6">
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {/* Monthly Salary & Auto Annual Package */}
                <div className="bg-slate-50/90 border border-slate-200/80 rounded-xl p-3.5 shadow-sm">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-1">
                    <DollarSign className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Monthly Salary Range</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900">{salaryDisplay}</div>
                  <div className="text-xs text-indigo-700 font-semibold mt-1 bg-indigo-50/90 px-2 py-0.5 rounded-md inline-block border border-indigo-100">
                    Annual Package: {annualPackage.displayText}
                  </div>
                </div>

                {/* Location & Work Mode */}
                <div className="bg-slate-50/90 border border-slate-200/80 rounded-xl p-3.5 shadow-sm">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Location & Mode</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900 truncate">{job.location}</div>
                  <div className="text-xs text-slate-600 font-medium mt-1">
                    Mode: <span className="font-semibold text-slate-900">{job.locationType || 'Hybrid'}</span>
                  </div>
                </div>

                {/* Employment Type & Experience */}
                <div className="bg-slate-50/90 border border-slate-200/80 rounded-xl p-3.5 shadow-sm">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-1">
                    <Clock className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Type & Experience</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900">{job.employmentType}</div>
                  <div className="text-xs text-slate-600 font-medium mt-1">
                    Min Experience:{' '}
                    <span className="font-semibold text-slate-900">{job.minimumExperienceYears} years</span>
                  </div>
                </div>

                {/* Closing Date & Indicator */}
                <div className="bg-slate-50/90 border border-slate-200/80 rounded-xl p-3.5 shadow-sm">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Closing Date</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    {job.closingDate ? job.closingDate : 'Continuous / Open'}
                  </div>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] ${closingIndicator.badgeClass}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${closingIndicator.dotClass}`} />
                      {closingIndicator.shortLabel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Skills Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Required Skills */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-600" />
                    Mandatory Required Skills ({job.requiredSkills?.length || 0})
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {job.requiredSkills?.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-cyan-50 text-cyan-900 border border-cyan-200 rounded-lg text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Preferred Skills */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-600" />
                    Preferred / Advantageous Skills ({job.preferredSkills?.length || 0})
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {job.preferredSkills && job.preferredSkills.length > 0 ? (
                      job.preferredSkills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-indigo-50 text-indigo-900 border border-indigo-200 rounded-lg text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">No secondary skills specified</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Qualifications */}
              {job.qualifications && job.qualifications.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-cyan-600" />
                    Qualifications & NQF Equivalencies
                  </h3>
                  <ul className="space-y-1.5">
                    {job.qualifications.map((qual, idx) => (
                      <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{qual}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Job Description */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                  Full Vacancy Description & Specifications
                </h3>
                <div className="text-xs text-slate-700 whitespace-pre-line leading-relaxed font-normal bg-slate-50/60 p-4 rounded-xl border border-slate-100 max-h-80 overflow-y-auto">
                  {job.jobDescription || 'No detailed description entered.'}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* EDIT MODE */}
          {/* ======================================================== */}
          {isEditMode && (
            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Job Title */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                    placeholder="e.g. Junior React Developer"
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Department *
                  </label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                    placeholder="e.g. Engineering & Technology"
                  />
                </div>

                {/* Company (with quick suggestions) */}
                <div className="relative">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => handleCompanyChange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                    placeholder="e.g. eStudy South Africa"
                  />

                  {/* Suggestions dropdown */}
                  {companySuggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden text-xs">
                      <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-100 text-[11px] font-semibold text-slate-500">
                        Intelligent Company Suggestions
                      </div>
                      {companySuggestions.map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectCompany(item)}
                          className="w-full text-left px-3 py-2 hover:bg-cyan-50 transition flex items-center justify-between border-b border-slate-50 last:border-0"
                        >
                          <div>
                            <span className="font-semibold text-slate-900">{item.name}</span>
                            <span className="text-slate-500 ml-1.5">({item.industry})</span>
                          </div>
                          <span className="text-[11px] text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                            {item.knownLocation}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Location */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Location / Region *
                    </label>
                    {suggestedLocationHint && (
                      <span className="text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded">
                        {suggestedLocationHint}
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      setSuggestedLocationHint(null);
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                    placeholder="e.g. Pretoria, Gauteng"
                  />
                </div>

                {/* Location Type (On-Site, Remote, Hybrid) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Location Type *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['On-Site', 'Remote', 'Hybrid'] as LocationType[]).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setLocationType(type)}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                          locationType === type
                            ? 'bg-cyan-600 text-white border-cyan-600 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Employment Type (Full Time, Part Time, Contract) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Employment Type *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Full Time', 'Part Time', 'Contract'] as EmploymentType[]).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setEmploymentType(type)}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                          employmentType === type
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Monthly Salary Min */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Min Monthly Salary (ZAR) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">R</span>
                    <input
                      type="number"
                      required
                      min={0}
                      step={500}
                      value={salaryMinZar || ''}
                      onChange={(e) => setSalaryMinZar(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-3.5 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                      placeholder="e.g. 8000"
                    />
                  </div>
                </div>

                {/* Monthly Salary Max & Live Annual Package */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Max Monthly Salary (ZAR) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">R</span>
                    <input
                      type="number"
                      required
                      min={0}
                      step={500}
                      value={salaryMaxZar || ''}
                      onChange={(e) => setSalaryMaxZar(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-3.5 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                      placeholder="e.g. 12000"
                    />
                  </div>
                  <p className="text-[11px] text-indigo-700 font-semibold mt-1">
                    Auto Annual Package: {editAnnualPackage.displayText}
                  </p>
                </div>

                {/* Minimum Experience */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Minimum Experience (Years) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={25}
                    value={minimumExperienceYears}
                    onChange={(e) => setMinimumExperienceYears(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                  />
                </div>

                {/* Closing Date */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Closing Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={closingDate}
                    onChange={(e) => setClosingDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Skills */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Required Skills (Comma separated) *
                  </label>
                  <input
                    type="text"
                    required
                    value={requiredSkillsString}
                    onChange={(e) => setRequiredSkillsString(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                    placeholder="e.g. React, TypeScript, Tailwind CSS"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Preferred Skills (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={preferredSkillsString}
                    onChange={(e) => setPreferredSkillsString(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                    placeholder="e.g. Node.js, GraphQL, AWS"
                  />
                </div>
              </div>

              {/* Qualifications */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Qualifications & NQF Requirements (One per line)
                </label>
                <textarea
                  rows={2}
                  value={qualificationsString}
                  onChange={(e) => setQualificationsString(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                  placeholder="e.g. BSc Computer Science / BTech IT (NQF Level 7)"
                />
              </div>

              {/* Job Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Full Vacancy Description *
                </label>
                <textarea
                  rows={6}
                  required
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 leading-relaxed font-mono"
                  placeholder="Enter detailed job description, duties, and responsibilities..."
                />
              </div>

              {/* Edit Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditMode(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 rounded-xl shadow-md shadow-cyan-600/20 transition disabled:opacity-50"
                >
                  {isSaving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer (View Mode) */}
        {!isEditMode && (
          <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Users className="w-4 h-4 text-slate-400" />
              <span>
                Total Applicants:{' '}
                <strong className="text-slate-900 font-bold">{job.applicantCount || 0}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              {onNavigateToWorkbench && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateToWorkbench(job.id);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Open Screening Workbench</span>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          id="vacancy-delete-confirm-overlay"
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150"
        >
          <div
            id="vacancy-delete-confirm-dialog"
            className="bg-white border border-rose-200 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 text-slate-900"
          >
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">Delete Vacancy Profile?</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Are you sure you want to permanently delete{' '}
                <strong className="text-slate-900 font-semibold">{job.jobTitle}</strong>? This will remove the
                vacancy from Supabase and the recruitment pipeline.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                id="vacancy-confirm-delete-btn"
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md shadow-rose-600/20 transition disabled:opacity-50"
              >
                {isDeleting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
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
