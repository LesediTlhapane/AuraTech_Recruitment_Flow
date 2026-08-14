import React, { useState } from 'react';
import { ApplicationRecord, ApplicationStatus } from '../types';
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
  Workflow 
} from 'lucide-react';

interface CandidateDetailModalProps {
  candidate: ApplicationRecord;
  onClose: () => void;
  onUpdateStatus: (candidateId: string, newStatus: ApplicationStatus, notes?: string) => void;
  isAnonymizedView: boolean;
  onNavigateToEmail?: (candidate: ApplicationRecord) => void;
  onNavigateToInterview?: (candidate: ApplicationRecord) => void;
}

export const CandidateDetailModal: React.FC<CandidateDetailModalProps> = ({
  candidate,
  onClose,
  onUpdateStatus,
  isAnonymizedView,
  onNavigateToEmail,
  onNavigateToInterview,
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'scores' | 'risks' | 'profile' | 'n8n'>('summary');
  const [recruiterNote, setRecruiterNote] = useState(candidate.recruiterNotes || '');
  const [copiedJson, setCopiedJson] = useState(false);

  const displayName = isAnonymizedView
    ? `Candidate #${candidate.id.replace('cand-', '')}`
    : candidate.extractedData
      ? `${candidate.extractedData.name} ${candidate.extractedData.surname}`
      : `Candidate #${candidate.id}`;

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

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-slate-200/90 rounded-2xl max-w-4xl w-full text-slate-800 shadow-[0_25px_70px_rgba(15,23,42,0.15)] flex flex-col max-h-[90vh] my-auto overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-white/90 backdrop-blur-md sticky top-0 z-10">
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-bold text-slate-900">{displayName}</h2>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                candidate.category === 'Excellent Match' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                candidate.category === 'Strong Match' ? 'bg-indigo-50 text-indigo-700 border-indigo-200/80' :
                candidate.category === 'Suitable' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                candidate.category === 'Potential' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                'bg-rose-50 text-rose-800 border-rose-200'
              }`}>
                {candidate.category}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Applied for: <strong className="text-slate-800">{candidate.jobTitle}</strong> • Score: <strong className="text-emerald-700 font-bold">{candidate.scores.overallScore}%</strong>
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 border-b border-slate-200 bg-slate-50/80 px-5 pt-2 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-3.5 py-2.5 rounded-t-xl border-b-2 transition font-bold ${
              activeTab === 'summary' ? 'border-cyan-600 text-cyan-800 bg-white shadow-xs' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Executive Summary
          </button>
          <button
            onClick={() => setActiveTab('scores')}
            className={`px-3.5 py-2.5 rounded-t-xl border-b-2 transition font-bold ${
              activeTab === 'scores' ? 'border-cyan-600 text-cyan-800 bg-white shadow-xs' : 'border-transparent text-slate-500 hover:text-slate-800'
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
            onClick={() => setActiveTab('profile')}
            className={`px-3.5 py-2.5 rounded-t-xl border-b-2 transition font-bold ${
              activeTab === 'profile' ? 'border-cyan-600 text-cyan-800 bg-white shadow-xs' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Extracted Profile
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
          {/* TAB 1: EXECUTIVE SUMMARY */}
          {activeTab === 'summary' && (
            <div className="space-y-5">
              <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 space-y-2">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-cyan-600" /> AI Executive Summary
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

          {/* TAB 2: 12-FACTOR SCORING */}
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

          {/* TAB 3: RISK ANALYSIS */}
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

          {/* TAB 4: EXTRACTED PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/80">
                  <span className="text-slate-500 block text-[10px]">Email</span>
                  <span className="text-slate-900 font-semibold">{candidate.extractedData?.email || 'N/A'}</span>
                </div>
                <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/80">
                  <span className="text-slate-500 block text-[10px]">Phone</span>
                  <span className="text-slate-900 font-semibold">{candidate.extractedData?.phone || 'N/A'}</span>
                </div>
                <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/80">
                  <span className="text-slate-500 block text-[10px]">Notice Period</span>
                  <span className="text-slate-900 font-semibold">{candidate.extractedData?.noticePeriodDays ?? 30} Days</span>
                </div>
                <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/80">
                  <span className="text-slate-500 block text-[10px]">Expected Salary</span>
                  <span className="text-emerald-700 font-semibold">R{(candidate.extractedData?.expectedSalaryZar || 0).toLocaleString()} p.a.</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-indigo-600" /> Education & Qualifications
                </h4>
                {(candidate.extractedData?.education || []).map((edu, idx) => (
                  <div key={idx} className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/80 mb-2">
                    <div className="flex justify-between text-slate-900 font-semibold">
                      <span>{edu.degree}</span>
                      <span className="text-indigo-700 font-bold">{edu.nqfLevelEquivalent || 'NQF Level 7'}</span>
                    </div>
                    <p className="text-slate-500 text-[11px]">{edu.institution} ({edu.yearGraduated || 'Completed'})</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: RAW INTEGRATION JSON */}
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

          {/* Recruiter Decision Panel */}
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
                onClick={() => handleStatusChange('Shortlisted')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-3.5 py-1.5 rounded-xl text-xs transition shadow-xs active:scale-95"
              >
                Mark Shortlisted
              </button>
              <button
                onClick={() => handleStatusChange('Interview Scheduled')}
                className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-3.5 py-1.5 rounded-xl text-xs transition shadow-xs active:scale-95"
              >
                Schedule Interview
              </button>
              <button
                onClick={() => handleStatusChange('Assessment Sent')}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-3.5 py-1.5 rounded-xl text-xs transition shadow-xs active:scale-95"
              >
                Send Assessment
              </button>
              <button
                onClick={() => handleStatusChange('Offer Extended')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3.5 py-1.5 rounded-xl text-xs transition shadow-xs active:scale-95"
              >
                Extend Offer
              </button>
              <button
                onClick={() => handleStatusChange('On Hold')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-semibold px-3.5 py-1.5 rounded-xl text-xs transition shadow-xs active:scale-95"
              >
                Put on Hold
              </button>
              <button
                onClick={() => handleStatusChange('Rejected')}
                className="bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-semibold px-3.5 py-1.5 rounded-xl text-xs transition shadow-xs active:scale-95"
              >
                Reject Candidate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
