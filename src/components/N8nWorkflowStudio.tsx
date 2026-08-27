import React, { useState } from 'react';
import { ApplicationRecord } from '../types';
import {
  Activity, ArrowRight, BellRing, BrainCircuit, CheckCircle2, ChevronRight,
  CircleDot, Database, FileCheck2, FileText, Mail, PauseCircle, PlayCircle,
  ShieldCheck, Sparkles, Users, Workflow,
} from 'lucide-react';

interface N8nWorkflowStudioProps {
  candidates: ApplicationRecord[];
}

const getCandidateName = (candidate: ApplicationRecord) =>
  candidate.extractedData
    ? `${candidate.extractedData.name} ${candidate.extractedData.surname}`.trim()
    : 'Candidate';

export const N8nWorkflowStudio: React.FC<N8nWorkflowStudioProps> = ({ candidates }) => {
  const [selectedCandidateId, setSelectedCandidateId] = useState(candidates[0]?.id || '');
  const [pausedSteps, setPausedSteps] = useState<string[]>([]);
  const selectedCandidate = candidates.find((candidate) => candidate.id === selectedCandidateId);
  const screenedCount = candidates.filter((candidate) => candidate.status !== 'New').length;
  const shortlistedCount = candidates.filter((candidate) => candidate.category === 'Excellent Match' || candidate.category === 'Strong Match').length;
  const activeCount = candidates.filter((candidate) => candidate.status !== 'Rejected' && candidate.status !== 'On Hold').length;

  const steps = [
    { id: 'intake', label: 'Application intake', description: 'Capture candidate details and CV content', icon: FileText },
    { id: 'privacy', label: 'POPIA privacy check', description: 'Confirm consent and protect personal information', icon: ShieldCheck },
    { id: 'screening', label: 'AI screening', description: 'Evaluate the application across 12 fit factors', icon: BrainCircuit },
    { id: 'decision', label: 'Recruiter decision', description: 'Route the candidate to the next hiring stage', icon: CircleDot },
    { id: 'follow-up', label: 'Follow-up actions', description: 'Coordinate interviews, emails, and notifications', icon: BellRing },
    { id: 'persistence', label: 'Database record', description: 'Keep candidate, screening, and audit data in sync', icon: Database },
  ];

  const toggleStep = (stepId: string) => {
    setPausedSteps((current) => current.includes(stepId)
      ? current.filter((id) => id !== stepId)
      : [...current, stepId]
    );
  };

  return (
    <div className="space-y-6 pb-8">
      <section className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-8 text-white shadow-xl sm:px-8">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border border-cyan-400/20 bg-cyan-400/10 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 h-64 w-64 rounded-full border border-emerald-400/20 bg-emerald-400/10 blur-3xl" />
        <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-300"><Workflow className="h-4 w-4" /> Internal recruitment operations</div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Recruitment Automation</h1>
            <p className="text-sm leading-relaxed text-slate-300">A clear view of how applications move from intake to recruiter decision, with privacy, AI screening, communication, and database updates working together.</p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-xs font-semibold text-emerald-200"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> System operational</div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: 'Applications', value: candidates.length, icon: Users, tone: 'text-cyan-700' },
          { label: 'AI screened', value: screenedCount, icon: BrainCircuit, tone: 'text-indigo-700' },
          { label: 'Priority matches', value: shortlistedCount, icon: Sparkles, tone: 'text-amber-700' },
          { label: 'Active pipeline', value: activeCount, icon: Activity, tone: 'text-emerald-700' },
        ].map((metric) => (
          <div key={metric.label} className="rounded-2xl border border-slate-200/80 bg-white/85 p-4 shadow-sm"><div className="flex items-center justify-between"><span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{metric.label}</span><metric.icon className={`h-4 w-4 ${metric.tone}`} /></div><p className={`mt-3 text-2xl font-extrabold ${metric.tone}`}>{metric.value}</p></div>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <section className="rounded-2xl border border-slate-200/80 bg-white/85 p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-start justify-between gap-4"><div><h2 className="flex items-center gap-2 text-base font-bold text-slate-900"><Workflow className="h-4 w-4 text-cyan-600" /> Application workflow</h2><p className="mt-1 text-xs text-slate-500">Each step reflects a live operation in the recruitment platform.</p></div><span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">6 stages</span></div>
          <div className="space-y-2">
            {steps.map((step, index) => { const Icon = step.icon; const isPaused = pausedSteps.includes(step.id); return <div key={step.id} className="group flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 transition hover:border-cyan-300 hover:bg-cyan-50/30"><div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isPaused ? 'bg-slate-200 text-slate-500' : 'bg-white text-cyan-700'} border border-slate-200 shadow-sm`}><Icon className="h-4 w-4" /></div><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><span className="text-[10px] font-bold text-slate-400">0{index + 1}</span><h3 className="text-xs font-bold text-slate-900">{step.label}</h3><span className={`h-1.5 w-1.5 rounded-full ${isPaused ? 'bg-amber-400' : 'bg-emerald-400'}`} /></div><p className="mt-0.5 truncate text-[11px] text-slate-500">{step.description}</p></div><button type="button" onClick={() => toggleStep(step.id)} className="rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-slate-700" title={isPaused ? 'Resume stage' : 'Pause stage'}>{isPaused ? <PlayCircle className="h-4 w-4" /> : <PauseCircle className="h-4 w-4" />}</button>{index < steps.length - 1 && <ChevronRight className="hidden h-4 w-4 text-slate-300 sm:block" />}</div>; })}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200/80 bg-white/85 p-5 shadow-sm sm:p-6">
          <div className="mb-5"><h2 className="flex items-center gap-2 text-base font-bold text-slate-900"><FileCheck2 className="h-4 w-4 text-emerald-600" /> Candidate journey</h2><p className="mt-1 text-xs text-slate-500">Preview a candidate&apos;s current position in the workflow.</p></div>
          <select value={selectedCandidateId} onChange={(event) => setSelectedCandidateId(event.target.value)} className="mb-5 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-800 focus:border-cyan-500 focus:outline-none"><option value="">{candidates.length ? 'Select a candidate' : 'No candidates available'}</option>{candidates.map((candidate) => <option key={candidate.id} value={candidate.id}>{getCandidateName(candidate)} · {candidate.jobTitle}</option>)}</select>
          {selectedCandidate ? <div className="space-y-4"><div className="rounded-xl border border-cyan-200 bg-cyan-50/60 p-4"><p className="text-sm font-bold text-slate-900">{getCandidateName(selectedCandidate)}</p><p className="mt-1 text-xs text-slate-600">{selectedCandidate.jobTitle}</p><div className="mt-3 flex items-center justify-between text-xs"><span className="font-semibold text-slate-500">Current stage</span><span className="rounded-full bg-white px-2.5 py-1 font-bold text-cyan-700 shadow-sm">{selectedCandidate.status}</span></div></div><div className="space-y-3">{[{ label: 'Profile captured', complete: true }, { label: 'AI evaluation complete', complete: selectedCandidate.status !== 'New' }, { label: 'Recruiter review', complete: ['Shortlisted', 'Interview Scheduled', 'Assessment Sent', 'Offer Extended', 'Rejected'].includes(selectedCandidate.status) }, { label: 'Next action assigned', complete: ['Interview Scheduled', 'Assessment Sent', 'Offer Extended', 'Rejected'].includes(selectedCandidate.status) }].map((stage) => <div key={stage.label} className="flex items-center gap-3 text-xs"><CheckCircle2 className={`h-4 w-4 ${stage.complete ? 'text-emerald-500' : 'text-slate-300'}`} /><span className={stage.complete ? 'font-semibold text-slate-700' : 'text-slate-400'}>{stage.label}</span></div>)}</div></div> : <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-xs text-slate-500">Add a candidate to preview their journey.</div>}
        </section>
      </div>

      <section className="rounded-2xl border border-slate-200/80 bg-white/85 p-5 shadow-sm sm:p-6"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="flex items-center gap-2 text-base font-bold text-slate-900"><Activity className="h-4 w-4 text-rose-600" /> Recent operations</h2><p className="mt-1 text-xs text-slate-500">The latest work completed by the recruitment platform.</p></div><span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700"><CheckCircle2 className="h-3.5 w-3.5" /> Live activity</span></div><div className="mt-5 grid gap-3 md:grid-cols-3">{[{ icon: FileText, label: 'CV intake', detail: `${candidates.length} application${candidates.length === 1 ? '' : 's'} captured`, tone: 'text-cyan-600' }, { icon: BrainCircuit, label: 'AI screening', detail: `${screenedCount} profile${screenedCount === 1 ? '' : 's'} evaluated`, tone: 'text-indigo-600' }, { icon: Mail, label: 'Recruiter actions', detail: 'Communication and decisions ready', tone: 'text-emerald-600' }].map((item) => <div key={item.label} className="flex items-center gap-3 rounded-xl bg-slate-50/80 p-3"><item.icon className={`h-4 w-4 ${item.tone}`} /><div><p className="text-xs font-bold text-slate-800">{item.label}</p><p className="mt-0.5 text-[11px] text-slate-500">{item.detail}</p></div></div>)}</div></section>
    </div>
  );
};
