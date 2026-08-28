import React, { useEffect, useState } from 'react';
import { ApplicationRecord, EmailCommunication, InterviewSlot } from '../types';
import { generateEmailWithAi } from '../services/api';
import { Mail, Sparkles, Send, Copy, CheckCircle, FileText, RefreshCw, UserCheck, Paperclip, X } from 'lucide-react';

const getCandidateName = (candidate?: ApplicationRecord) =>
  candidate?.extractedData
    ? `${candidate.extractedData.name} ${candidate.extractedData.surname}`.trim()
    : 'Candidate';

const buildEmailDraft = (
  emailType: EmailCommunication['type'],
  candidate?: ApplicationRecord,
  interview?: InterviewSlot
) => {
  const candidateName = getCandidateName(candidate);
  const jobTitle = candidate?.jobTitle || 'the position';
  const greeting = `Dear ${candidateName},`;
  const closing = '\n\nKind regards,\nTalent Acquisition Team';
  const interviewDetails = interview
    ? `\n\nInterview details:\nDate: ${new Date(`${interview.date}T00:00:00`).toLocaleDateString('en-ZA', { day: '2-digit', month: 'long', year: 'numeric' })}\nTime: ${interview.startTime} - ${interview.endTime}\nInterviewer: ${interview.interviewerName}\nMeeting link: ${interview.meetingLink}`
    : '\n\nInterview details:\nDate and time: To be confirmed';

  const drafts: Record<EmailCommunication['type'], { subject: string; body: string }> = {
    Acknowledgement: {
      subject: `Application Received: ${jobTitle}`,
      body: `${greeting}\n\nThank you for applying for the ${jobTitle} position. We confirm that we have received your application and our recruitment team will review your profile.\n\nWe will contact you with an update once the next stage of the process has been determined.${closing}`,
    },
    'Interview Invitation': {
      subject: `Interview Invitation: ${jobTitle}`,
      body: `${greeting}\n\nWe were impressed by your application for the ${jobTitle} position and would like to invite you to an interview.${interviewDetails}\n\nPlease confirm your availability and let us know if you have any questions.${closing}`,
    },
    'Assessment Invitation': {
      subject: `Assessment Invitation: ${jobTitle}`,
      body: `${greeting}\n\nAs the next step in our selection process for the ${jobTitle} position, please complete the assessment shared with this email.\n\nPlease submit your completed assessment by the agreed deadline. Contact us if you need any clarification.${closing}`,
    },
    'Additional Information Request': {
      subject: `Additional Information Required: ${jobTitle}`,
      body: `${greeting}\n\nThank you for your application for the ${jobTitle} position. To continue our review, please provide the additional information or documents requested below.\n\nRequested information:\n- [Add details here]${closing}`,
    },
    'Reference Check Request': {
      subject: `Reference Check Request: ${jobTitle}`,
      body: `${greeting}\n\nWe are progressing your application for the ${jobTitle} position and would like to complete a reference check.\n\nPlease confirm the names, roles, and contact details of your nominated referees, and confirm that we have permission to contact them.${closing}`,
    },
    'Offer Letter Draft': {
      subject: `Offer Letter: ${jobTitle}`,
      body: `${greeting}\n\nWe are pleased to let you know that we would like to make you an offer for the ${jobTitle} position.\n\nThe formal offer will include the agreed compensation, start date, employment conditions, and any applicable requirements. Please review the attached details and let us know if you have any questions.${closing}`,
    },
    'Rejection Email': {
      subject: `Application Update: ${jobTitle}`,
      body: `${greeting}\n\nThank you for the time and effort you invested in applying for the ${jobTitle} position. After careful consideration, we have decided not to progress your application on this occasion.\n\nWe appreciate your interest and wish you every success in your future career.${closing}`,
    },
  };

  return drafts[emailType];
};

interface CommunicationsProps {
  candidates: ApplicationRecord[];
  emails: EmailCommunication[];
  interviews: InterviewSlot[];
  onAddEmail: (email: EmailCommunication) => void;
  preselectedCandidate?: ApplicationRecord | null;
  initialEmailType?: EmailCommunication['type'];
}

export const Communications: React.FC<CommunicationsProps> = ({
  candidates,
  emails,
  interviews,
  onAddEmail,
  preselectedCandidate,
  initialEmailType,
}) => {
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(
    preselectedCandidate?.id || candidates[0]?.id || ''
  );

  const [emailType, setEmailType] = useState<EmailCommunication['type']>(initialEmailType || 'Interview Invitation');
  const [customNotes, setCustomNotes] = useState('Suggest interview slots for Tuesday 10:00 AM or Wednesday 02:00 PM SAST.');
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedCandidate = candidates.find((c) => c.id === selectedCandidateId) || candidates[0];
  const selectedInterview = interviews.find((interview) => interview.candidateId === selectedCandidate?.id);
  const initialDraft = buildEmailDraft('Interview Invitation', selectedCandidate, selectedInterview);
  const [subject, setSubject] = useState(initialDraft.subject);
  const [body, setBody] = useState(initialDraft.body);
  const [assessmentFile, setAssessmentFile] = useState<File | null>(null);
  const [copied, setCopied] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  useEffect(() => {
    if (initialEmailType) {
      setEmailType(initialEmailType);
    }
  }, [initialEmailType]);

  useEffect(() => {
    const draft = buildEmailDraft(emailType, selectedCandidate, selectedInterview);
    setSubject(draft.subject);
    setBody(draft.body);
  }, [emailType, selectedCandidate?.id, selectedInterview?.id, selectedInterview?.date, selectedInterview?.startTime]);

  const handleGenerateAiEmail = async () => {
    if (!selectedCandidate) return;
    setIsGenerating(true);
    setSentSuccess(false);

    try {
      const candidateName = getCandidateName(selectedCandidate);

      const generated = await generateEmailWithAi(
        candidateName,
        selectedCandidate.jobTitle,
        'FinTech Dynamics South Africa',
        emailType,
        customNotes
      );

      setSubject(generated.subject);
      const generatedBody = emailType === 'Interview Invitation'
        ? `${generated.body}${selectedInterview ? `\n\nInterview details:\nDate: ${new Date(`${selectedInterview.date}T00:00:00`).toLocaleDateString('en-ZA', { day: '2-digit', month: 'long', year: 'numeric' })}\nTime: ${selectedInterview.startTime} - ${selectedInterview.endTime}\nInterviewer: ${selectedInterview.interviewerName}\nMeeting link: ${selectedInterview.meetingLink}` : '\n\nInterview details:\nDate and time: To be confirmed'}`
        : generated.body;
      setBody(generatedBody);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendEmail = async () => {
    if (!selectedCandidate) return;

    const candidateName = getCandidateName(selectedCandidate);

    let attachment: EmailCommunication['attachment'];
    if (emailType === 'Assessment Invitation' && assessmentFile) {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(assessmentFile);
      });
      attachment = {
        name: assessmentFile.name,
        type: assessmentFile.type || 'application/octet-stream',
        size: assessmentFile.size,
        dataUrl,
      };
    }

    const newEmail: EmailCommunication = {
      id: `email-${Date.now()}`,
      candidateId: selectedCandidate.id,
      candidateName,
      candidateEmail: selectedCandidate.extractedData?.email || '',
      type: emailType,
      subject,
      body,
      attachment,
      sentDate: new Date().toISOString(),
      status: 'Sent',
    };

    onAddEmail(newEmail);
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 3000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          Candidate Communication Studio <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-0.5 rounded-full border border-indigo-200/80">Automated Messaging</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Draft personalized, professional emails for invitations, assessments, reference checks, offers, and rejections.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form: Parameters & Controls */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-6 space-y-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)] text-xs">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Mail className="w-4 h-4 text-cyan-600" /> Email Generation Config
          </h2>

          <div>
            <label className="block text-slate-700 font-medium mb-1">Select Candidate *</label>
            <select
              value={selectedCandidateId}
              onChange={(e) => setSelectedCandidateId(e.target.value)}
              className="w-full bg-slate-50/80 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:bg-white focus:border-cyan-500 shadow-xs font-medium"
            >
              {candidates.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.extractedData ? `${c.extractedData.name} ${c.extractedData.surname}` : 'Candidate'} ({c.jobTitle})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">Communication Type *</label>
            <select
              value={emailType}
              onChange={(e) => setEmailType(e.target.value as EmailCommunication['type'])}
              className="w-full bg-slate-50/80 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:bg-white focus:border-cyan-500 font-medium shadow-xs"
            >
              <option value="Acknowledgement">Acknowledgement Email</option>
              <option value="Interview Invitation">Interview Invitation</option>
              <option value="Assessment Invitation">Assessment Invitation</option>
              <option value="Additional Information Request">Additional Info Request</option>
              <option value="Reference Check Request">Reference Check Request</option>
              <option value="Offer Letter Draft">Offer Letter Draft</option>
              <option value="Rejection Email">Rejection Email (Empathetic)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">Recruiter Custom Notes / Specifics</label>
            <textarea
              rows={3}
              placeholder="e.g. Include Microsoft Teams link, mention salary band R950k..."
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              className="w-full bg-slate-50/80 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:bg-white focus:border-cyan-500 shadow-xs"
            />
          </div>

          {emailType === 'Assessment Invitation' && (
            <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-3 space-y-2">
              <label htmlFor="assessment-attachment" className="flex items-center gap-2 text-xs font-bold text-indigo-900">
                <Paperclip className="w-3.5 h-3.5 text-indigo-600" /> Attach Assessment
              </label>
              <input
                id="assessment-attachment"
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.zip"
                onChange={(event) => setAssessmentFile(event.target.files?.[0] || null)}
                className="block w-full text-[11px] text-slate-600 file:mr-2 file:rounded-lg file:border-0 file:bg-indigo-600 file:px-2.5 file:py-1.5 file:text-[11px] file:font-semibold file:text-white hover:file:bg-indigo-700"
              />
              {assessmentFile && (
                <div className="flex items-center justify-between gap-2 rounded-lg bg-white px-2.5 py-2 text-[11px] text-slate-700 border border-indigo-100">
                  <span className="truncate font-semibold">{assessmentFile.name}</span>
                  <button type="button" onClick={() => setAssessmentFile(null)} title="Remove assessment attachment" className="shrink-0 rounded-md p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              <p className="text-[10px] text-indigo-700">The selected file will be included with this candidate communication record.</p>
            </div>
          )}

          <button
            onClick={handleGenerateAiEmail}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-semibold py-2.5 rounded-xl shadow-sm shadow-indigo-500/20 transition flex items-center justify-center space-x-2 active:scale-95"
          >
            {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin text-white" /> : <Sparkles className="w-4 h-4 text-white" />}
            <span>{isGenerating ? 'Generating Email...' : 'Generate Personalized Email'}</span>
          </button>

          {/* Candidate Card Summary */}
          {selectedCandidate && (
            <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Selected Recipient:</span>
              <p className="text-slate-900 font-bold">{selectedCandidate.extractedData ? `${selectedCandidate.extractedData.name} ${selectedCandidate.extractedData.surname}` : 'Candidate'}</p>
              <p className="text-slate-600">{selectedCandidate.extractedData?.email || 'N/A'}</p>
              <p className="text-slate-600">Score: <span className="text-emerald-700 font-bold">{selectedCandidate.scores.overallScore}%</span> ({selectedCandidate.category})</p>
            </div>
          )}
        </div>

        {/* Right Editor: Live Email Preview */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-6 space-y-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)] text-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-600" /> Live Email Preview & Editor
              </h2>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopy}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1 transition shadow-xs"
                >
                  <Copy className="w-3.5 h-3.5" /> {copied ? 'Copied!' : 'Copy Text'}
                </button>

                <button
                  onClick={handleSendEmail}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xs transition active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" /> Dispatch Email
                </button>
              </div>
            </div>

            {sentSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-3 rounded-xl flex items-center gap-2 font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Email dispatched successfully and logged in candidate communication audit history.</span>
              </div>
            )}

            <div>
              <label className="block text-slate-800 font-bold mb-1">Subject Line</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-50/80 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-semibold focus:outline-none focus:bg-white focus:border-cyan-500 shadow-xs"
              />
            </div>

            <div>
              <label className="block text-slate-800 font-bold mb-1">Email Body</label>
              <textarea
                rows={12}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full bg-slate-50/80 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:bg-white focus:border-cyan-500 leading-relaxed font-sans shadow-xs"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200/80 text-[11px] text-slate-500">
            <span>ℹ️ Emails are personalized using candidate education, work experience, and job title context.</span>
          </div>
        </div>
      </div>

      {/* Dispatched Emails Audit History */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-6 space-y-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
        <h2 className="text-base font-bold text-slate-900">Dispatched Email Audit Log</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 rounded-l-xl font-bold">Candidate</th>
                <th className="px-4 py-3 font-bold">Type</th>
                <th className="px-4 py-3 font-bold">Subject</th>
                <th className="px-4 py-3 font-bold">Sent Timestamp</th>
                <th className="px-4 py-3 rounded-r-xl font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {emails.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-4 py-3 font-semibold text-slate-900">{e.candidateName}</td>
                  <td className="px-4 py-3">
                    <span className="bg-indigo-50 text-indigo-700 text-[10px] px-2.5 py-0.5 rounded-full font-bold border border-indigo-200/80">
                      {e.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-800 font-medium">{e.subject}</td>
                  <td className="px-4 py-3 text-slate-500">{e.sentDate || 'Just now'}{e.attachment && <span className="ml-2 inline-flex items-center gap-1 text-indigo-600" title={e.attachment.name}><Paperclip className="w-3 h-3" /> Attached</span>}</td>
                  <td className="px-4 py-3">
                    <span className="bg-emerald-50 text-emerald-800 text-[10px] px-2.5 py-0.5 rounded-full font-bold border border-emerald-200">
                      {e.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
