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
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [rawSpecText, setRawSpecText] = useState('');

  // Selected vacancy for View/Edit modal
  const [selectedVacancyForModal, setSelectedVacancyForModal] = useState<JobProfile | null>(null);

  // Delete Confirmation State
  const [jobToDelete, setJobToDelete] = useState<JobProfile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State for Create Job
  const [formData, setFormData] = useState<Partial<JobProfile>>({
    jobTitle: '',
    department: '',
    company: '',
    location: '',
    locationType: undefined,
    employmentType: undefined,
    salaryMinZar: undefined,
    salaryMaxZar: undefined,
    requiredSkills: [],
    preferredSkills: [],
    minimumExperienceYears: undefined,
    qualifications: [],
    jobDescription: '',
    closingDate: '',
  });

  const [skillsInput, setSkillsInput] = useState('');
  const [preferredSkillsInput, setPreferredSkillsInput] = useState('');

  // Company suggestions in Create form
  const [companySuggestions, setCompanySuggestions] = useState<CompanySuggestionItem[]>([]);
  const [suggestedLocationHint, setSuggestedLocationHint] = useState<string | null>(null);

  // Live Annual Package for Create Form
  const createAnnualPackage = calculateAnnualPackage(
    Number(formData.salaryMinZar || 0),
    Number(formData.salaryMaxZar || 0)
  );

  const openCreateModal = () => {
    setFormData({
      jobTitle: '',
      department: '',
      company: '',
      location: '',
      locationType: undefined,
      employmentType: undefined,
      salaryMinZar: undefined,
      salaryMaxZar: undefined,
      requiredSkills: [],
      preferredSkills: [],
      minimumExperienceYears: undefined,
      qualifications: [],
      jobDescription: '',
      closingDate: '',
    });
    setSkillsInput('');
    setPreferredSkillsInput('');
    setRawSpecText('');
    setCompanySuggestions([]);
    setSuggestedLocationHint(null);
    setIsOpenAddModal(true);
  };

  useEffect(() => {
    if (isOpenAddModal) {
      openCreateModal();
    }
  }, [isOpenAddModal]);

  const filteredJobs = jobs.filter(
    (j) =>
      j.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Quick Preset Spec Prompts
  const sampleSpecPresets = [
    {
      title: 'Junior React Dev (Pretoria)',
      prompt: 'Junior React Developer in Pretoria, 2 years experience, R20 000 per month, full time. Must know React, TypeScript, and modern CSS.',
    },
    {
      title: 'Full Stack Engineer (Sandton)',
      prompt: 'Senior Full Stack Engineer at FinTech Dynamics in Sandton, Hybrid, 5 years experience, R55 000 to R75 000 per month. Java, Spring Boot, React, AWS.',
    },
    {
      title: 'Instructional Designer (Pretoria)',
      prompt: 'Instructional Designer at eStudy in Pretoria, 3 years experience, R30 000 to R42 000 pm, Full Time, Hybrid. LMS, Articulate, Curriculum Design.',
    },
  ];

  const handleAiAutoFill = async (customPrompt?: string) => {
    const textToAnalyze = customPrompt || rawSpecText;
    if (!textToAnalyze.trim()) return;
    setIsAiLoading(true);
    try {
      const extracted = await analyzeJobWithAi(textToAnalyze);
      setFormData((prev) => ({
        ...prev,
        ...extracted,
      }));
      if (extracted.requiredSkills) setSkillsInput(extracted.requiredSkills.join(', '));
      if (extracted.preferredSkills) setPreferredSkillsInput(extracted.preferredSkills.join(', '));
      if (extracted.location) {
        setSuggestedLocationHint(`Extracted Location: ${extracted.location} (Recruiter can adjust)`);
      }
    } catch (e) {
      console.error('AI extraction error:', e);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCompanyChange = (val: string) => {
    setFormData((prev) => ({ ...prev, company: val }));
    if (val.length >= 2) {
      const suggestions = getCompanySuggestions(
        val,
        jobs.map((j) => j.company)
      );
      setCompanySuggestions(suggestions);
    } else {
      setCompanySuggestions([]);
    }
  };

  const handleSelectCompany = (item: CompanySuggestionItem) => {
    setFormData((prev) => ({
      ...prev,
      company: item.name,
      location: item.knownLocation,
      locationType: item.defaultLocationType,
    }));
    setSuggestedLocationHint(`Suggested: Location: ${item.knownLocation} (Recruiter can change)`);
    setCompanySuggestions([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.jobTitle) return;

    const newJob: JobProfile = {
      id: `job-${Date.now()}`,
      jobTitle: formData.jobTitle.trim() || 'New Position',
      department: formData.department?.trim() || '',
      company: formData.company?.trim() || '',
      location: formData.location?.trim() || '',
      locationType: formData.locationType as LocationType,
      employmentType: formData.employmentType as EmploymentType,
      salaryMinZar: Number(formData.salaryMinZar) || 0,
      salaryMaxZar: Number(formData.salaryMaxZar) || 0,
      requiredSkills: skillsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      preferredSkills: preferredSkillsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      minimumExperienceYears: Number(formData.minimumExperienceYears) || 0,
      qualifications: typeof formData.qualifications === 'string'
        ? [formData.qualifications]
        : formData.qualifications || [],
      jobDescription: formData.jobDescription || '',
      closingDate: formData.closingDate || '',
      createdDate: new Date().toISOString().split('T')[0],
      status: 'Open',
      applicantCount: 0,
    };

    await onAddJob(newJob);
    setIsOpenAddModal(false);
    setRawSpecText('');
  };

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
            onClick={openCreateModal}
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
      {isOpenAddModal && (
        <div
          id="create-vacancy-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsOpenAddModal(false);
            }
          }}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full p-6 space-y-5 text-slate-800 shadow-[0_20px_60px_rgba(15,23,42,0.12)] my-8 cursor-default animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-600" /> Create Structured Job Profile
                </h2>
                <p className="text-xs text-slate-500">
                  Step 1: Input monthly salary, closing date, location type, and qualifications.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpenAddModal(false)}
                className="text-slate-400 hover:text-slate-700 text-2xl font-bold p-1 rounded-lg"
              >
                &times;
              </button>
            </div>

            {/* AI Quick Spec Parser Box */}
            <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-600 animate-pulse" /> AI Quick Spec Parser
                </span>
                <button
                  type="button"
                  id="ai-quick-parse-btn"
                  onClick={() => handleAiAutoFill()}
                  disabled={isAiLoading || !rawSpecText.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs px-3.5 py-1.5 rounded-lg font-semibold transition shadow-xs flex items-center gap-1.5"
                >
                  {isAiLoading ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  <span>{isAiLoading ? 'Extracting Parameters...' : 'Parse Raw Spec'}</span>
                </button>
              </div>

              <textarea
                value={rawSpecText}
                onChange={(e) => setRawSpecText(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-cyan-500 h-18 placeholder:text-slate-400"
              />

              {/* Sample Prompt Chips */}
              <div className="flex items-center gap-2 flex-wrap text-[11px]">
                <span className="text-indigo-900 font-medium">Quick Presets:</span>
                {sampleSpecPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setRawSpecText(preset.prompt);
                      handleAiAutoFill(preset.prompt);
                    }}
                    className="bg-white hover:bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-md border border-indigo-200 font-medium transition"
                  >
                    + {preset.title}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Job Title */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[11px]">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.jobTitle || ''}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold"
                    placeholder="e.g. Junior React Developer"
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[11px]">
                    Department *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.department || ''}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Company (with quick suggestions) */}
                <div className="relative">
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[11px]">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company || ''}
                    onChange={(e) => handleCompanyChange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold"
                  />

                  {/* Company Suggestions dropdown */}
                  {companySuggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-30 overflow-hidden text-xs">
                      <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Company Quick Suggestions
                      </div>
                      {companySuggestions.map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectCompany(item)}
                          className="w-full text-left px-3 py-2 hover:bg-cyan-50 transition flex items-center justify-between border-b border-slate-50 last:border-0"
                        >
                          <div>
                            <span className="font-bold text-slate-900">{item.name}</span>
                            <span className="text-slate-500 ml-1.5">({item.industry})</span>
                          </div>
                          <span className="text-[11px] text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                            Location: {item.knownLocation}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Location */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                      Location / Region *
                    </label>
                    {suggestedLocationHint && (
                      <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {suggestedLocationHint}
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.location || ''}
                    onChange={(e) => {
                      setFormData({ ...formData, location: e.target.value });
                      setSuggestedLocationHint(null);
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white text-xs"
                  />
                </div>
              </div>

              {/* Location Type & Employment Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Location Type (On-Site, Remote, Hybrid) */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[11px]">
                    Location Type *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['On-Site', 'Remote', 'Hybrid'] as LocationType[]).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({ ...formData, locationType: type })}
                        className={`py-2 px-2.5 rounded-lg text-xs font-bold border transition ${
                          formData.locationType === type
                            ? 'bg-cyan-600 text-white border-cyan-600 shadow-xs'
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
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[11px]">
                    Employment Type *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Full Time', 'Part Time', 'Contract'] as EmploymentType[]).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({ ...formData, employmentType: type })}
                        className={`py-2 px-2.5 rounded-lg text-xs font-bold border transition ${
                          formData.employmentType === type
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Monthly Salary Inputs with live auto annual package */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[11px]">
                    Min Monthly Salary (ZAR) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-400 font-bold">R</span>
                    <input
                      type="number"
                      required
                      min={0}
                      step={500}
                      value={formData.salaryMinZar || ''}
                      onChange={(e) => setFormData({ ...formData, salaryMinZar: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-7 pr-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[11px]">
                    Max Monthly Salary (ZAR) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-400 font-bold">R</span>
                    <input
                      type="number"
                      required
                      min={0}
                      step={500}
                      value={formData.salaryMaxZar || ''}
                      onChange={(e) => setFormData({ ...formData, salaryMaxZar: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-7 pr-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[11px]">
                    Min Exp (Years) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={25}
                    value={formData.minimumExperienceYears ?? ''}
                    onChange={(e) => setFormData({ ...formData, minimumExperienceYears: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white text-xs"
                  />
                </div>
              </div>

              {/* Live Annual Package Calculation Notice */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-900 font-medium">
                    Calculated Monthly Range:{' '}
                    <strong>
                      R{Number(formData.salaryMinZar || 0).toLocaleString()} - R
                      {Number(formData.salaryMaxZar || 0).toLocaleString()} p.m.
                    </strong>
                  </span>
                </div>
                <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg font-bold text-[11px] border border-emerald-300">
                  Annual Package: {createAnnualPackage.displayText}
                </span>
              </div>

              {/* Closing Date */}
              <div>
                <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[11px]">
                  Closing Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.closingDate || ''}
                  onChange={(e) => setFormData({ ...formData, closingDate: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white text-xs font-medium"
                />
              </div>

              {/* Skills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[11px]">
                    Required Skills (Comma Separated) *
                  </label>
                  <input
                    type="text"
                    required
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[11px]">
                    Preferred Skills (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={preferredSkillsInput}
                    onChange={(e) => setPreferredSkillsInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white text-xs"
                  />
                </div>
              </div>

              {/* Qualifications */}
              <div>
                <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[11px]">
                  Qualifications / NQF Standard
                </label>
                <input
                  type="text"
                  value={
                    Array.isArray(formData.qualifications)
                      ? formData.qualifications.join(', ')
                      : formData.qualifications || ''
                  }
                  onChange={(e) => setFormData({ ...formData, qualifications: [e.target.value] })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white text-xs"
                />
              </div>

              {/* Job Description */}
              <div>
                <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[11px]">
                  Full Job Description
                </label>
                <textarea
                  rows={3}
                  value={formData.jobDescription || ''}
                  onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white text-xs"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsOpenAddModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-4 py-2 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 text-white font-bold px-5 py-2 rounded-xl shadow-md shadow-cyan-600/20 transition cursor-pointer"
                >
                  Save Job Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
