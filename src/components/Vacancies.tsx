import React, { useState } from 'react';
import { JobProfile, EmploymentType } from '../types';
import { Plus, Sparkles, Building2, MapPin, DollarSign, Calendar, Clock, FileText, Search, Trash2, AlertTriangle, Pencil } from 'lucide-react';
import { analyzeJobWithAi } from '../services/api';

interface VacanciesProps {
  jobs: JobProfile[];
  onAddJob: (job: JobProfile) => void;
  onUpdateJob: (job: JobProfile) => void;
  onDeleteJob?: (jobId: string) => void;
  isOpenAddModal: boolean;
  setIsOpenAddModal: (val: boolean) => void;
}

export const Vacancies: React.FC<VacanciesProps> = ({
  jobs,
  onAddJob,
  onUpdateJob,
  onDeleteJob,
  isOpenAddModal,
  setIsOpenAddModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [rawSpecText, setRawSpecText] = useState('');
  const [jobBeingEdited, setJobBeingEdited] = useState<JobProfile | null>(null);

  // Delete Confirmation State
  const [jobToDelete, setJobToDelete] = useState<JobProfile | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<JobProfile>>({
    jobTitle: '',
    department: '',
    company: '',
    location: '',
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

  const filteredJobs = jobs.filter((j) =>
    j.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAiAutoFill = async () => {
    if (!rawSpecText.trim()) return;
    setIsAiLoading(true);
    try {
      const extracted = await analyzeJobWithAi(rawSpecText);
      setFormData((prev) => ({
        ...prev,
        ...extracted,
      }));
      if (extracted.requiredSkills) setSkillsInput(extracted.requiredSkills.join(', '));
      if (extracted.preferredSkills) setPreferredSkillsInput(extracted.preferredSkills.join(', '));
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.jobTitle) return;

    const savedJob: JobProfile = {
      id: jobBeingEdited?.id || `job-${Date.now()}`,
      jobTitle: formData.jobTitle || 'New Position',
      department: formData.department || '',
      company: formData.company || '',
      location: formData.location || '',
      employmentType: (formData.employmentType as EmploymentType) || 'Full-time',
      salaryMinZar: Number(formData.salaryMinZar) || 0,
      salaryMaxZar: Number(formData.salaryMaxZar) || 0,
      requiredSkills: skillsInput.split(',').map((s) => s.trim()).filter(Boolean),
      preferredSkills: preferredSkillsInput.split(',').map((s) => s.trim()).filter(Boolean),
      minimumExperienceYears: Number(formData.minimumExperienceYears) || 0,
      qualifications: typeof formData.qualifications === 'string' 
        ? [formData.qualifications] 
        : formData.qualifications || [],
      jobDescription: formData.jobDescription || '',
      closingDate: formData.closingDate || '',
      createdDate: jobBeingEdited?.createdDate || new Date().toISOString().split('T')[0],
      status: jobBeingEdited?.status || 'Open',
      applicantCount: jobBeingEdited?.applicantCount || 0,
    };

    if (jobBeingEdited) {
      onUpdateJob(savedJob);
    } else {
      onAddJob(savedJob);
    }
    setJobBeingEdited(null);
    setIsOpenAddModal(false);
  };

  const openCreateModal = () => {
    setJobBeingEdited(null);
    setRawSpecText('');
    setIsOpenAddModal(true);
  };

  const openEditModal = (job: JobProfile) => {
    setJobBeingEdited(job);
    setFormData(job);
    setSkillsInput(job.requiredSkills.join(', '));
    setPreferredSkillsInput(job.preferredSkills.join(', '));
    setRawSpecText('');
    setIsOpenAddModal(true);
  };

  return (
    <div className="space-y-8">
      {/* Top Header Controls */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            Job Vacancy Management <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-0.5 rounded-full border border-indigo-200/80">{jobs.length} Active Positions</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create structured internal Job Profiles specifying skills, qualifications, salary ranges, and competencies.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter vacancies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-50/80 border border-slate-200 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:bg-white focus:border-cyan-500 w-48 sm:w-64 shadow-xs"
            />
          </div>
          <button
            onClick={openCreateModal}
            className="bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-sm shadow-indigo-500/20 transition flex items-center space-x-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>+ Create Job Profile</span>
          </button>
        </div>
      </div>

      {/* Vacancy Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            role="button"
            tabIndex={0}
            onClick={() => openEditModal(job)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') openEditModal(job);
            }}
            className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-6 hover:shadow-[0_20px_40px_rgba(15,23,42,0.07)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200/80 uppercase tracking-wide">
                    {job.department}
                  </span>
                  <h2 className="text-base font-bold text-slate-900 mt-2 line-clamp-1">{job.jobTitle}</h2>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" /> {job.company}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-50 text-emerald-800 text-[10px] px-2.5 py-0.5 rounded-full font-bold border border-emerald-200">
                    {job.status}
                  </span>
                  {onDeleteJob && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setJobToDelete(job);
                      }}
                      title="Delete Vacancy from Database & System"
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-200 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Meta details */}
              <div className="mt-4 space-y-2 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> Location:
                  </span>
                  <span className="font-semibold text-slate-800">{job.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-slate-500">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Salary Range:
                  </span>
                  <span className="font-semibold text-emerald-700">
                    R{job.salaryMinZar.toLocaleString()} - R{job.salaryMaxZar.toLocaleString()} p.a.
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> Min Experience:
                  </span>
                  <span className="font-semibold text-slate-800">{job.minimumExperienceYears}+ Years</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> Closing Date:
                  </span>
                  <span className="font-medium text-slate-700">{job.closingDate}</span>
                </div>
              </div>

              {/* Skills Tags */}
              <div className="mt-4">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1.5">Required Skills Competencies:</p>
                <div className="flex flex-wrap gap-1">
                  {job.requiredSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-100 text-slate-700 text-[10px] px-2.5 py-0.5 rounded-full border border-slate-200/80 font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                <strong className="text-slate-900 font-bold">{job.applicantCount || 0}</strong> Applicants Received
              </span>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full border border-indigo-200/80 font-semibold">
                <Pencil className="w-3 h-3 inline mr-1" /> Edit Profile
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Job Vacancy Modal */}
      {isOpenAddModal && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsOpenAddModal(false);
            }
          }}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 space-y-5 text-slate-800 shadow-[0_20px_60px_rgba(15,23,42,0.12)] my-8 cursor-default animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-600" /> {jobBeingEdited ? 'Edit Job Profile' : 'Generate Structured Job Profile'}
                </h2>
                  <p className="text-xs text-slate-500">{jobBeingEdited ? 'Update the vacancy details below.' : 'Step 1: Input job parameters or paste raw job spec for AI parsing.'}</p>
              </div>
              <button
                onClick={() => setIsOpenAddModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold"
              >
                &times;
              </button>
            </div>

            {/* AI Spec Paste Helper */}
            <div className="bg-indigo-50/60 p-3.5 rounded-xl border border-indigo-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-indigo-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-600" /> AI Quick Spec Parser
                </span>
                <button
                  type="button"
                  onClick={handleAiAutoFill}
                  disabled={isAiLoading || !rawSpecText.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs px-3 py-1 rounded-lg font-medium transition shadow-xs"
                >
                  {isAiLoading ? 'Extracting...' : 'Parse Raw Spec'}
                </button>
              </div>
              <textarea
                placeholder="Paste raw unformatted job text or vacancy advert here to automatically populate fields..."
                value={rawSpecText}
                onChange={(e) => setRawSpecText(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-cyan-500 h-20 placeholder:text-slate-400"
              />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Job Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                    placeholder="e.g. Senior Software Engineer"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Department</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Min Salary (ZAR)</label>
                  <input
                    type="number"
                    value={formData.salaryMinZar}
                    onChange={(e) => setFormData({ ...formData, salaryMinZar: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Max Salary (ZAR)</label>
                  <input
                    type="number"
                    value={formData.salaryMaxZar}
                    onChange={(e) => setFormData({ ...formData, salaryMaxZar: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Min Exp (Years)</label>
                  <input
                    type="number"
                    value={formData.minimumExperienceYears}
                    onChange={(e) => setFormData({ ...formData, minimumExperienceYears: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Required Skills (Comma Separated)</label>
                <input
                  type="text"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Qualifications / NQF Standard</label>
                <input
                  type="text"
                  value={Array.isArray(formData.qualifications) ? formData.qualifications.join(', ') : formData.qualifications}
                  onChange={(e) => setFormData({ ...formData, qualifications: [e.target.value] })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Job Description</label>
                <textarea
                  rows={3}
                  value={formData.jobDescription}
                  onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsOpenAddModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-4 py-2 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded-xl shadow-xs"
                >
                  {jobBeingEdited ? 'Save Changes' : 'Save Job Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Vacancy Modal */}
      {jobToDelete && (
        <div 
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
                This will remove the job profile from active positions and delete its entry from the database.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setJobToDelete(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onDeleteJob) {
                    onDeleteJob(jobToDelete.id);
                  }
                  setJobToDelete(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-600/20 transition flex items-center space-x-1.5 active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Vacancy</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
