import React, { useState } from 'react';
import { ApplicationRecord, ApplicationStatus, JobProfile } from '../types';
import { 
  X, 
  BrainCircuit, 
  Award, 
  AlertTriangle, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Copy, 
  Send, 
  Calendar, 
  DollarSign, 
  Briefcase, 
  GraduationCap, 
  ShieldCheck, 
  Workflow,
  Trash2,
  PauseCircle,
  PlayCircle,
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  Check,
  TrendingUp,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface CandidateDetailModalProps {
  candidate: ApplicationRecord;
  jobs?: JobProfile[];
  onClose: () => void;
  onUpdateStatus: (candidateId: string, newStatus: ApplicationStatus, notes?: string) => void;
  onDeleteCandidate?: (candidateId: string) => Promise<void> | void;
  onToggleMuteCandidate?: (candidateId: string) => Promise<void> | void;
  isAnonymizedView?: boolean;
  onNavigateToEmail?: (candidate: ApplicationRecord) => void;
  onNavigateToInterview?: (candidate: ApplicationRecord) => void;
}

export const CandidateDetailModal: React.FC<CandidateDetailModalProps> = ({
  candidate,
  jobs = [],
  onClose,
  onUpdateStatus,
  onDeleteCandidate,
  onToggleMuteCandidate,
  isAnonymizedView = false,
  onNavigateToEmail,
  onNavigateToInterview,
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'full_profile' | 'scores' | 'risks' | 'n8n'>('summary');
  const [recruiterNote, setRecruiterNote] = useState(candidate.recruiterNotes || '');
  const [copiedJson, setCopiedJson] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showRawCv, setShowRawCv] = useState(false);

  const isMuted = candidate.isPaused || candidate.status === 'On Hold';

  const displayName = isAnonymizedView
    ? `Candidate #${candidate.id.replace('cand-', '')}`
    : candidate.extractedData
      ? `${candidate.extractedData.name} ${candidate.extractedData.surname}`.trim()
      : `Candidate #${candidate.id}`;

  // Experience advantage calculation vs matched job vacancy
  const matchedJob = jobs.find((j) => j.id === candidate.jobId || j.jobTitle.toLowerCase() === candidate.jobTitle.toLowerCase());
  const vacancyRequiredExp = matchedJob?.minimumExperienceYears ?? 0;
  const candidateExp = candidate.extractedData?.totalYearsExperience ?? 0;
  const expAdvantage = vacancyRequiredExp > 0 ? candidateExp - vacancyRequiredExp : 0;

  const scoresList = [
    { label: 'Education Match', value: candidate.scores.educationMatch },
    { label: 'Skills Match', value: candidate.scores.skillsMatch },
    { label: 'Experience Match', value: candidate.scores.experienceMatch },
    { label: 'Industry Match', value: candidate.scores.industryMatch },
    { label: 'Certification Match', value: candidate.scores.certificationMatch },
    { label: 'Leadership Experience', value: candidate.scores.leadershipExperience },
    { label: 'Communication Skills', value: candidate.scores.communicationSkills },
    { label: 'Career Stability', value: candidate.scores.careerStability },
    { label: 'Employment Gaps Score', value: candidate.scores.employmentGapsScore },
    { label: 'Location Suitability', value: candidate.scores.locationSuitability },
    { label: 'Salary Alignment', value: candidate.scores.salaryAlignment },
    { label: 'Availability Score', value: candidate.scores.availabilityScore },
  ];

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(candidate.n8nPayload || candidate, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleStatusChange = (newStatus: ApplicationStatus) => {
    onUpdateStatus(candidate.id, newStatus, recruiterNote);
  };

  const handleScheduleInterview = () => {
    handleStatusChange('Interview Scheduled');
    onClose();
    onNavigateToInterview?.(candidate);
  };

  const handleDecision = (status: ApplicationStatus) => {
    handleStatusChange(status);

    if (status === 'Assessment Sent' || status === 'Offer Extended') {
      onClose();
      onNavigateToEmail?.(candidate);
      return;
    }

    onClose();
  };

  const handleConfirmDelete = async () => {
    if (!onDeleteCandidate) return;
    setIsDeleting(true);
    try {
      await onDeleteCandidate(candidate.id);
      setShowDeleteConfirm(false);
      onClose();
    } catch (err) {
      console.error('Failed to delete candidate:', err);
      setIsDeleting(false);
    }
  };

  return (
    <div 
      id="candidate-detail-modal-overlay"
      className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !showDeleteConfirm) {
          onClose();
        }
      }}
    >
      <div 
        id="candidate-detail-modal-container"
        className="bg-white border border-slate-200/90 rounded-2xl max-w-4xl w-full text-slate-800 shadow-[0_25px_70px_rgba(15,23,42,0.15)] flex flex-col max-h-[90vh] my-auto overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 via-white to-slate-50/80 flex items-center justify-between gap-4 sticky top-0 z-10">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-sm shrink-0 ${
                isMuted
                  ? 'bg-amber-100 text-amber-700 border border-amber-200'
                  : 'bg-gradient-to-br from-indigo-600 to-cyan-600 text-white shadow-indigo-600/20'
              }`}
            >
              <User className="w-5 h-5" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight truncate">
                  {displayName}
                </h2>

                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                  candidate.category === 'Excellent Match' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                  candidate.category === 'Strong Match' ? 'bg-indigo-50 text-indigo-700 border-indigo-200/80' :
                  candidate.category === 'Suitable' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                  candidate.category === 'Potential' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                  'bg-rose-50 text-rose-800 border-rose-200'
                }`}>
                  {candidate.category} ({candidate.scores.overallScore}%)
                </span>

                {isMuted && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                    <PauseCircle className="w-3 h-3" />
                    <span>Paused / Muted</span>
                  </span>
                )}

                {expAdvantage > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <TrendingUp className="w-3 h-3" />
                    <span>+{expAdvantage} yrs exp advantage</span>
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                Applied for: <strong className="text-slate-800">{candidate.jobTitle}</strong> • Source: <span className="text-slate-600">{candidate.source}</span> • Status: <strong className="text-indigo-700">{candidate.status}</strong>
              </p>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Mute / Pause Toggle Button */}
            {onToggleMuteCandidate && (
              <button
                id="candidate-modal-toggle-mute-btn"
                type="button"
                onClick={() => onToggleMuteCandidate(candidate.id)}
                title={isMuted ? 'Resume Candidate' : 'Pause / Mute Candidate'}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition shadow-sm border ${
                  isMuted
                    ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-300'
                    : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-300'
                }`}
              >
                {isMuted ? (
                  <>
                    <PlayCircle className="w-4 h-4" />
                    <span>Resume</span>
                  </>
                ) : (
                  <>
                    <PauseCircle className="w-4 h-4" />
                    <span>Pause / Mute</span>
                  </>
                )}
              </button>
            )}

            {/* Open Full Profile Toggle Button */}
            <button
              id="candidate-modal-open-profile-btn"
              type="button"
              onClick={() => setActiveTab(activeTab === 'full_profile' ? 'summary' : 'full_profile')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border shadow-sm transition ${
                activeTab === 'full_profile'
                  ? 'bg-indigo-600 text-white border-indigo-700'
                  : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{activeTab === 'full_profile' ? 'Summary View' : 'Open Profile'}</span>
            </button>

            {/* Delete Candidate Button */}
            {onDeleteCandidate && (
              <button
                id="candidate-modal-delete-btn"
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                title="Delete Candidate"
                className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            {/* Close Button */}
            <button
              id="candidate-modal-close-btn"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 border-b border-slate-200 bg-slate-50/80 px-6 pt-2 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-3.5 py-2.5 rounded-t-xl border-b-2 transition font-bold ${
              activeTab === 'summary' ? 'border-indigo-600 text-indigo-800 bg-white shadow-xs' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Candidate Summary
          </button>
          <button
            onClick={() => setActiveTab('full_profile')}
            className={`px-3.5 py-2.5 rounded-t-xl border-b-2 transition font-bold flex items-center gap-1.5 ${
              activeTab === 'full_profile' ? 'border-indigo-600 text-indigo-800 bg-white shadow-xs' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Full Profile
          </button>
          <button
            onClick={() => setActiveTab('scores')}
            className={`px-3.5 py-2.5 rounded-t-xl border-b-2 transition font-bold ${
              activeTab === 'scores' ? 'border-indigo-600 text-indigo-800 bg-white shadow-xs' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            12-Factor Scoring ({candidate.scores.overallScore}%)
          </button>
          <button
            onClick={() => setActiveTab('risks')}
            className={`px-3.5 py-2.5 rounded-t-xl border-b-2 transition font-bold flex items-center gap-1.5 ${
              activeTab === 'risks' ? 'border-rose-600 text-rose-800 bg-white shadow-xs' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Risk Analysis {candidate.risks.length > 0 && <span className="bg-rose-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">{candidate.risks.length}</span>}
          </button>
          <button
            onClick={() => setActiveTab('n8n')}
            className={`px-3.5 py-2.5 rounded-t-xl border-b-2 transition font-bold flex items-center gap-1.5 ${
              activeTab === 'n8n' ? 'border-emerald-600 text-emerald-800 bg-white shadow-xs' : 'border-transparent text-emerald-700 hover:text-emerald-800'
            }`}
          >
            <Workflow className="w-3.5 h-3.5" /> Integration Payload
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1 text-slate-700">
          {/* ======================================================== */}
          {/* TAB 1: CANDIDATE SUMMARY */}
          {/* ======================================================== */}
          {activeTab === 'summary' && (
            <div className="space-y-5">
              {/* Experience Advantage Highlight Banner (if applicable) */}
              {expAdvantage > 0 && (
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-emerald-900">Experience Advantage Detected</h4>
                      <p className="text-xs text-emerald-800 mt-0.5">
                        Experience requirement: <strong className="font-semibold">{vacancyRequiredExp} years</strong> • Candidate experience: <strong className="font-semibold">{candidateExp} years</strong> • Experience advantage: <strong className="font-bold text-emerald-900">+{expAdvantage} years</strong>
                      </p>
                    </div>
                  </div>
                  <span className="bg-emerald-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-xs shrink-0">
                    +{expAdvantage} Yrs Surplus
                  </span>
                </div>
              )}

              {/* Key Contact & Snapshot Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold flex items-center gap-1">
                    <Mail className="w-3 h-3 text-slate-400" /> Email
                  </span>
                  <span className="text-slate-900 font-semibold truncate block">
                    {isAnonymizedView ? 'anonymized@candidate.co.za' : (candidate.extractedData?.email || 'Not provided')}
                  </span>
                </div>

                <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" /> Phone
                  </span>
                  <span className="text-slate-900 font-semibold truncate block">
                    {isAnonymizedView ? '+27 (Protected)' : (candidate.extractedData?.phone || 'Not provided')}
                  </span>
                </div>

                <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" /> Location
                  </span>
                  <span className="text-slate-900 font-semibold truncate block">
                    {candidate.extractedData?.location || 'Not provided'}
                  </span>
                </div>

                <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-slate-400" /> Experience
                  </span>
                  <span className="text-slate-900 font-semibold block">
                    {candidateExp > 0 ? `${candidateExp} Years` : 'Not specified'}
                  </span>
                </div>
              </div>

              {/* Current Role, Salary & Notice */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Current / Recent Role</span>
                  <p className="text-slate-900 font-semibold text-xs">
                    {candidate.extractedData?.currentEmployer 
                      ? `${candidate.extractedData?.workExperience?.[0]?.title || 'Professional'} at ${candidate.extractedData?.currentEmployer}`
                      : (candidate.extractedData?.workExperience?.[0]?.title || 'Candidate')}
                  </p>
                </div>

                <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Expected Salary</span>
                  <p className="text-emerald-700 font-bold text-xs">
                    {candidate.extractedData?.expectedSalaryZar 
                      ? `R${candidate.extractedData.expectedSalaryZar.toLocaleString()} p.a.`
                      : 'Negotiable / Market Related'}
                  </p>
                </div>

                <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Notice Period</span>
                  <p className="text-slate-900 font-semibold text-xs">
                    {candidate.extractedData?.noticePeriodDays ? `${candidate.extractedData.noticePeriodDays} Days` : 'Immediate / 30 Days'}
                  </p>
                </div>
              </div>

              {/* Skills Badges */}
              <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 space-y-2">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Technical & Verified Skills</span>
                <div className="flex flex-wrap gap-1.5">
                  {(candidate.extractedData?.technicalSkills || []).length > 0 ? (
                    candidate.extractedData.technicalSkills.map((skill, idx) => (
                      <span key={idx} className="bg-indigo-50 text-indigo-700 border border-indigo-200/80 text-[11px] px-2.5 py-1 rounded-lg font-medium">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 italic">No specific skills listed</span>
                  )}
                </div>
              </div>

              {/* AI Executive Summary */}
              <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 space-y-2">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-indigo-600" /> AI Executive Summary
                </h3>
                <p className="text-sm font-bold text-slate-900">{candidate.summary.headline}</p>
                <p className="text-slate-600 leading-relaxed">{candidate.summary.experienceOverview}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                  <span className="font-bold text-slate-900">Technical Alignment:</span>
                  <p className="text-slate-600">{candidate.summary.technicalAlignment}</p>
                </div>
                <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                  <span className="font-bold text-slate-900">Salary & Notice Fit:</span>
                  <p className="text-slate-600">{candidate.summary.salaryAndNoticeFit}</p>
                </div>
              </div>

              {/* Recommendation Box */}
              <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">AI Recommendation</span>
                  <span className="text-sm font-extrabold text-emerald-700">{candidate.summary.overallRecommendation}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {onNavigateToEmail && (
                    <button
                      onClick={() => { onClose(); onNavigateToEmail(candidate); }}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition shadow-xs active:scale-95"
                    >
                      <Send className="w-3.5 h-3.5" /> Draft Email
                    </button>
                  )}
                  {onNavigateToInterview && (
                    <button
                      onClick={() => { onClose(); onNavigateToInterview(candidate); }}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xs active:scale-95"
                    >
                      <Calendar className="w-3.5 h-3.5" /> Schedule Interview
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: FULL CANDIDATE PROFILE */}
          {/* ======================================================== */}
          {activeTab === 'full_profile' && (
            <div className="space-y-6">
              {/* Comprehensive Contact & Demographics Card */}
              <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 space-y-3">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <User className="w-4 h-4 text-indigo-600" /> Personal & Contact Profile
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Full Name</span>
                    <span className="text-slate-900 font-semibold">{displayName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Email Address</span>
                    <span className="text-slate-900 font-semibold">{isAnonymizedView ? 'anonymized@candidate.co.za' : (candidate.extractedData?.email || 'Not provided')}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Phone Number</span>
                    <span className="text-slate-900 font-semibold">{isAnonymizedView ? '+27 (Protected)' : (candidate.extractedData?.phone || 'Not provided')}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Location / Region</span>
                    <span className="text-slate-900 font-semibold">{candidate.extractedData?.location || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Total Experience</span>
                    <span className="text-slate-900 font-semibold">{candidateExp} Years</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Current Employer</span>
                    <span className="text-slate-900 font-semibold">{candidate.extractedData?.currentEmployer || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Notice Period</span>
                    <span className="text-slate-900 font-semibold">{candidate.extractedData?.noticePeriodDays ?? 30} Days</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Expected Salary</span>
                    <span className="text-emerald-700 font-semibold">
                      {candidate.extractedData?.expectedSalaryZar ? `R${candidate.extractedData.expectedSalaryZar.toLocaleString()} p.a.` : 'Negotiable'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Work Experience Timeline */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-indigo-600" /> Career & Employment History
                </h4>
                {(candidate.extractedData?.workExperience || []).length > 0 ? (
                  <div className="space-y-3">
                    {candidate.extractedData.workExperience.map((exp, idx) => (
                      <div key={idx} className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">{exp.title}</span>
                            <span className="text-slate-600 font-medium text-[11px]">{exp.company}</span>
                          </div>
                          <span className="text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-[10px] font-semibold">
                            {exp.startDate} — {exp.endDate} {exp.durationMonths ? `(${exp.durationMonths} mos)` : ''}
                          </span>
                        </div>

                        {exp.keyResponsibilities && exp.keyResponsibilities.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Responsibilities:</span>
                            <ul className="list-disc list-inside text-slate-600 text-[11px] space-y-0.5">
                              {exp.keyResponsibilities.map((resp, rIdx) => (
                                <li key={rIdx}>{resp}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {exp.achievements && exp.achievements.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-bold text-emerald-700 block">Key Achievements:</span>
                            <ul className="list-disc list-inside text-slate-700 text-[11px] space-y-0.5">
                              {exp.achievements.map((ach, aIdx) => (
                                <li key={aIdx}>{ach}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 text-slate-500 text-center">
                    No detailed employment history provided in profile.
                  </div>
                )}
              </div>

              {/* Education & Qualifications */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-indigo-600" /> Education & Qualifications
                </h4>
                {(candidate.extractedData?.education || []).length > 0 ? (
                  <div className="space-y-2">
                    {candidate.extractedData.education.map((edu, idx) => (
                      <div key={idx} className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-xs">{edu.degree}</span>
                            {edu.nqfLevelEquivalent && (
                              <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                                {edu.nqfLevelEquivalent}
                              </span>
                            )}
                          </div>
                          <p className="text-slate-500 text-[11px] mt-0.5">{edu.institution} {edu.fieldOfStudy ? `• ${edu.fieldOfStudy}` : ''}</p>
                        </div>
                        <span className="text-slate-500 text-[11px] font-semibold">
                          {edu.yearGraduated || 'Completed'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 text-slate-500 text-center">
                    {candidate.extractedData?.qualifications?.length ? candidate.extractedData.qualifications.join(', ') : 'No formal qualifications specified.'}
                  </div>
                )}
              </div>

              {/* Skills & Certifications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 space-y-2">
                  <span className="font-bold text-slate-900 text-xs block">Technical Competencies</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(candidate.extractedData?.technicalSkills || []).map((s, idx) => (
                      <span key={idx} className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] px-2.5 py-1 rounded-lg font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 space-y-2">
                  <span className="font-bold text-slate-900 text-xs block">Soft Skills & Languages</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(candidate.extractedData?.softSkills || ['Communication', 'Teamwork', 'Problem Solving']).map((s, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-700 border border-slate-200 text-[11px] px-2.5 py-1 rounded-lg font-medium">
                        {s}
                      </span>
                    ))}
                    {(candidate.extractedData?.languages || ['English']).map((l, idx) => (
                      <span key={`lang-${idx}`} className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] px-2.5 py-1 rounded-lg font-medium">
                        🗣️ {l}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Raw CV Accordion */}
              {candidate.rawCvText && (
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setShowRawCv(!showRawCv)}
                    className="w-full bg-slate-50/80 p-3.5 flex items-center justify-between text-xs font-bold text-slate-800 hover:bg-slate-100 transition"
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      View Raw CV & Cover Letter Text
                    </span>
                    {showRawCv ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {showRawCv && (
                    <div className="p-4 bg-slate-950 text-slate-200 font-mono text-[11px] whitespace-pre-wrap max-h-72 overflow-y-auto">
                      {candidate.rawCvText}
                      {candidate.coverLetterText && `\n\n--- COVER LETTER ---\n${candidate.coverLetterText}`}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: 12-FACTOR SCORING */}
          {/* ======================================================== */}
          {activeTab === 'scores' && (
            <div className="space-y-4">
              <p className="text-slate-500">
                Evaluation breakdown comparing candidate against Job Profile using semantic AI reasoning:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {scoresList.map((item, idx) => (
                  <div key={idx} className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/80 space-y-1">
                    <div className="flex justify-between items-center text-xs font-semibold text-slate-800">
                      <span>{item.label}</span>
                      <span className={`font-bold ${
                        item.value >= 90 ? 'text-emerald-700' :
                        item.value >= 75 ? 'text-indigo-700' :
                        item.value >= 60 ? 'text-amber-700' : 'text-rose-700'
                      }`}>
                        {item.value}/100
                      </span>
                    </div>
                    <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          item.value >= 90 ? 'bg-emerald-600' :
                          item.value >= 75 ? 'bg-indigo-600' :
                          item.value >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: RISK ANALYSIS */}
          {/* ======================================================== */}
          {activeTab === 'risks' && (
            <div className="space-y-4">
              {candidate.risks.length === 0 ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center text-emerald-900 space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="text-sm font-bold">Zero Risk Concerns Detected</p>
                  <p className="text-xs text-slate-600">Candidate meets career stability, qualification, salary, and availability benchmarks.</p>
                </div>
              ) : (
                candidate.risks.map((risk) => (
                  <div key={risk.id} className="bg-rose-50 p-4 rounded-xl border border-rose-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-rose-600" /> {risk.category}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        risk.severity === 'High' ? 'bg-rose-600 text-white' : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}>
                        {risk.severity} Severity
                      </span>
                    </div>
                    <p className="text-slate-800">{risk.description}</p>
                    {risk.mitigationSuggestion && (
                      <p className="text-slate-700 text-[11px] bg-white p-2.5 rounded-lg border border-slate-200">
                        💡 <strong>Mitigation Suggestion:</strong> {risk.mitigationSuggestion}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: RAW INTEGRATION JSON */}
          {/* ======================================================== */}
          {activeTab === 'n8n' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-800 font-semibold flex items-center gap-1.5">
                  <Workflow className="w-4 h-4 text-emerald-600" /> Executable Integration Payload
                </span>
                <button
                  onClick={handleCopyJson}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1 shadow-xs transition active:scale-95"
                >
                  <Copy className="w-3.5 h-3.5" /> {copiedJson ? 'Copied!' : 'Copy Payload JSON'}
                </button>
              </div>
              <pre className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-emerald-400 text-[11px] font-mono overflow-x-auto max-h-96 shadow-inner">
                {JSON.stringify(candidate.n8nPayload || candidate, null, 2)}
              </pre>
            </div>
          )}

          {/* ======================================================== */}
          {/* Recruiter Decision Panel */}
          {/* ======================================================== */}
          <div className="pt-4 border-t border-slate-200/80 space-y-3">
            <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" /> Recruiter Decision Panel (Final Oversight)
            </h4>

            <div>
              <textarea
                placeholder="Add confidential recruiter notes or feedback for hiring manager..."
                value={recruiterNote}
                onChange={(e) => setRecruiterNote(e.target.value)}
                className="w-full bg-slate-50/80 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white h-16 shadow-xs font-medium"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleDecision('Shortlisted')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-3.5 py-1.5 rounded-xl text-xs transition shadow-xs active:scale-95"
              >
                Mark Shortlisted
              </button>
              <button
                onClick={handleScheduleInterview}
                className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-3.5 py-1.5 rounded-xl text-xs transition shadow-xs active:scale-95"
              >
                Schedule Interview
              </button>
              <button
                onClick={() => handleDecision('Assessment Sent')}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-3.5 py-1.5 rounded-xl text-xs transition shadow-xs active:scale-95"
              >
                Send Assessment
              </button>
              <button
                onClick={() => handleDecision('Offer Extended')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3.5 py-1.5 rounded-xl text-xs transition shadow-xs active:scale-95"
              >
                Extend Offer
              </button>
              <button
                onClick={() => handleDecision('On Hold')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-semibold px-3.5 py-1.5 rounded-xl text-xs transition shadow-xs active:scale-95"
              >
                Put on Hold
              </button>
              <button
                onClick={() => handleDecision('Rejected')}
                className="bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-semibold px-3.5 py-1.5 rounded-xl text-xs transition shadow-xs active:scale-95"
              >
                Reject Candidate
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* DELETE CANDIDATE CONFIRMATION MODAL */}
      {/* ======================================================== */}
      {showDeleteConfirm && (
        <div
          id="candidate-delete-confirm-overlay"
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150"
        >
          <div
            id="candidate-delete-confirm-dialog"
            className="bg-white border border-rose-200 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 text-slate-900"
          >
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">Delete Candidate Profile?</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Are you sure you want to permanently delete candidate{' '}
                <strong className="text-slate-900 font-semibold">{displayName}</strong>? This will remove the candidate from Supabase, candidate records, and the screening pipeline.
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
                id="candidate-confirm-delete-btn"
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
                <span>Delete Candidate</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
