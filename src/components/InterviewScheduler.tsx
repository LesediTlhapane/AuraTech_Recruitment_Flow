import React, { useEffect, useState } from 'react';
import { ApplicationRecord, InterviewSlot } from '../types';
import { Calendar, Clock, Video, UserCheck, Plus, Download, CheckCircle, RefreshCw } from 'lucide-react';

interface InterviewSchedulerProps {
  candidates: ApplicationRecord[];
  interviews: InterviewSlot[];
  onAddInterview: (slot: InterviewSlot) => void;
  preselectedCandidate?: ApplicationRecord | null;
}

export const InterviewScheduler: React.FC<InterviewSchedulerProps> = ({
  candidates,
  interviews,
  onAddInterview,
  preselectedCandidate,
}) => {
  const [candidateId, setCandidateId] = useState(preselectedCandidate?.id || candidates[0]?.id || '');
  const [interviewerName, setInterviewerName] = useState('Dr. Kobus Venter (Head of Engineering)');
  const [date, setDate] = useState('2026-08-14');
  const [startTime, setStartTime] = useState('11:00');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [isModalOpen, setIsModalOpen] = useState(Boolean(preselectedCandidate));

  useEffect(() => {
    if (preselectedCandidate) {
      setCandidateId(preselectedCandidate.id);
      setIsModalOpen(true);
    }
  }, [preselectedCandidate?.id]);

  const selectedCandidate = candidates.find((c) => c.id === candidateId) || candidates[0];

  const handleCreateInterview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate) return;

    const startH = Number(startTime.split(':')[0]);
    const startM = Number(startTime.split(':')[1]);
    const endTotal = startH * 60 + startM + durationMinutes;
    const endH = Math.floor(endTotal / 60);
    const endM = endTotal % 60;
    const endTimeStr = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

    const candidateName = selectedCandidate?.extractedData
      ? `${selectedCandidate.extractedData.name} ${selectedCandidate.extractedData.surname}`
      : 'Candidate';
    const candidateFirstName = selectedCandidate?.extractedData?.name?.toLowerCase() || 'candidate';

    const meetingLink = `https://teams.microsoft.com/l/meetup-join/talentflow-${candidateFirstName}-${Date.now()}`;

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Aura Recruitment Flow AI//Recruitment System//EN
BEGIN:VEVENT
SUMMARY:Technical Interview - ${candidateName}
DESCRIPTION:Interview for ${selectedCandidate?.jobTitle || 'Position'} position at FinTech Dynamics SA.
LOCATION:${meetingLink}
DTSTART:${date.replace(/-/g, '')}T${startTime.replace(':', '')}00Z
DTEND:${date.replace(/-/g, '')}T${endTimeStr.replace(':', '')}00Z
END:VEVENT
END:VCALENDAR`;

    const newSlot: InterviewSlot = {
      id: `int-${Date.now()}`,
      candidateId: selectedCandidate?.id || candidateId,
      candidateName,
      jobTitle: selectedCandidate?.jobTitle || 'Role',
      interviewerName,
      date,
      startTime,
      endTime: endTimeStr,
      meetingLink,
      status: 'Confirmed',
      icsContent,
    };

    onAddInterview(newSlot);
    setIsModalOpen(false);
  };

  const handleDownloadIcs = (slot: InterviewSlot) => {
    const blob = new Blob([slot.icsContent || ''], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-${slot.candidateName.replace(/\s+/g, '_')}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            Interview Scheduling & Calendar Engine <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-0.5 rounded-full border border-indigo-200/80">Calendar Coordination</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Propose interview slots, generate standard .ics calendar invitations, and coordinate recruiter-candidate availability.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-sm shadow-indigo-500/20 transition flex items-center space-x-1.5 active:scale-95"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Schedule New Interview</span>
        </button>
      </div>

      {/* Scheduled Interviews Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {interviews.map((slot) => (
          <div
            key={slot.id}
            className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-6 hover:shadow-[0_20px_40px_rgba(15,23,42,0.07)] hover:-translate-y-0.5 transition-all duration-300 space-y-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-cyan-600" /> {slot.candidateName}
                </span>
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                  slot.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                  slot.status === 'Proposed' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                  'bg-slate-100 text-slate-700 border-slate-200'
                }`}>
                  {slot.status}
                </span>
              </div>

              <p className="text-xs text-slate-500 mt-1 font-medium">{slot.jobTitle}</p>

              <div className="mt-4 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80 space-y-2 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Date: <strong className="text-slate-900">{slot.date}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Time: <strong className="text-slate-900">{slot.startTime} - {slot.endTime} (SAST)</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Video className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Interviewer: <strong className="text-slate-800">{slot.interviewerName}</strong></span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
              <a
                href={slot.meetingLink}
                target="_blank"
                rel="noreferrer"
                className="text-cyan-700 hover:text-cyan-800 underline font-bold text-[11px]"
              >
                Join Video Call →
              </a>

              <button
                onClick={() => handleDownloadIcs(slot)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-3 py-1 rounded-lg text-[10px] font-semibold flex items-center gap-1 transition shadow-xs"
              >
                <Download className="w-3 h-3 text-emerald-600" /> Download .ICS
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* New Interview Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 text-slate-800 shadow-[0_20px_60px_rgba(15,23,42,0.12)] space-y-5">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyan-600" /> Schedule Interview Slot
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 text-xl font-bold">&times;</button>
            </div>

            <form onSubmit={handleCreateInterview} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Candidate *</label>
                <select
                  value={candidateId}
                  onChange={(e) => setCandidateId(e.target.value)}
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
                <label className="block text-slate-700 font-medium mb-1">Interviewer Name / Title</label>
                <input
                  type="text"
                  value={interviewerName}
                  onChange={(e) => setInterviewerName(e.target.value)}
                  className="w-full bg-slate-50/80 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:bg-white focus:border-cyan-500 shadow-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-50/80 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:bg-white focus:border-cyan-500 shadow-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Start Time (SAST)</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-slate-50/80 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:bg-white focus:border-cyan-500 shadow-xs font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-4 py-2 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded-xl shadow-xs transition active:scale-95"
                >
                  Confirm & Generate .ICS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
