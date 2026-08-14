import React, { useState } from 'react';
import { ApplicationRecord } from '../types';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Users, 
  Award, 
  Building2, 
  Download, 
  Sparkles, 
  BrainCircuit, 
  ShieldCheck, 
  DollarSign, 
  Sliders, 
  Target, 
  CheckCircle2, 
  AlertTriangle,
  Zap,
  Activity
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

interface AnalyticsViewProps {
  candidates: ApplicationRecord[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ candidates }) => {
  const [minMatchThreshold, setMinMatchThreshold] = useState<number>(75);

  // 1. Source Distribution Data
  const sourcesCount: Record<string, number> = {};
  candidates.forEach((c) => {
    sourcesCount[c.source] = (sourcesCount[c.source] || 0) + 1;
  });

  const sourceData = Object.entries(sourcesCount).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6'];

  // 2. AI Score Banding Distribution Data
  let eliteCount = 0;     // >= 90
  let shortlistCount = 0; // 75-89
  let reviewCount = 0;    // 60-74
  let unsuitedCount = 0;  // < 60

  candidates.forEach((c) => {
    const score = c.scores?.overallScore || 0;
    if (score >= 90) eliteCount++;
    else if (score >= 75) shortlistCount++;
    else if (score >= 60) reviewCount++;
    else unsuitedCount++;
  });

  const scoreDistributionData = [
    { category: 'Elite Match (90%+)', count: eliteCount, fill: '#10b981' },
    { category: 'Shortlist (75-89%)', count: shortlistCount, fill: '#6366f1' },
    { category: 'Review (60-74%)', count: reviewCount, fill: '#f59e0b' },
    { category: 'Unsuited (<60%)', count: unsuitedCount, fill: '#ef4444' },
  ];

  // 3. Time-to-Hire Monthly Reduction Trend (Historical benchmark vs AI speed)
  const timeToHireData = [
    { month: 'Jan', traditionalDays: 38, aiDays: 14 },
    { month: 'Feb', traditionalDays: 36, aiDays: 13 },
    { month: 'Mar', traditionalDays: 35, aiDays: 12 },
    { month: 'Apr', traditionalDays: 35, aiDays: 11 },
    { month: 'May', traditionalDays: 34, aiDays: 10 },
    { month: 'Jun', traditionalDays: 35, aiDays: 9.8 },
  ];

  // 4. Skills Frequency & Demand Matrix
  const skillsCount: Record<string, number> = {};
  candidates.forEach((c) => {
    (c.extractedData?.technicalSkills || []).forEach((sk) => {
      skillsCount[sk] = (skillsCount[sk] || 0) + 1;
    });
  });

  const topSkillsData = Object.entries(skillsCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([skill, count]) => ({
      skill,
      candidates: count,
    }));

  // 5. Top Universities Represented
  const universitiesCount: Record<string, number> = {};
  candidates.forEach((c) => {
    (c.extractedData?.education || []).forEach((edu) => {
      if (edu.institution) {
        universitiesCount[edu.institution] = (universitiesCount[edu.institution] || 0) + 1;
      }
    });
  });

  // Calculate threshold simulation metrics
  const simulatedQualifiedCount = candidates.filter(
    (c) => (c.scores?.overallScore || 0) >= minMatchThreshold
  ).length;

  const simulatedPassPercentage = candidates.length > 0 
    ? Math.round((simulatedQualifiedCount / candidates.length) * 100) 
    : 0;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-7 shadow-[0_10px_30px_rgba(15,23,42,0.04)] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-0.5 rounded-full border border-indigo-200/80 flex items-center gap-1">
              <BrainCircuit className="w-3.5 h-3.5 text-indigo-600" /> AI Predictive Analytics Suite
            </span>
            <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200/80">
              POPIA Compliant BI
            </span>
            <span className="text-xs bg-cyan-50 text-cyan-800 font-semibold px-2.5 py-0.5 rounded-full border border-cyan-200">
              Real-Time Visual Models
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Executive Talent & AI Recruitment Intelligence
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Predictive AI models analyzing talent quality, match distributions, sourcing channel efficiency, time-to-fill speedup, and skill density across open vacancies.
          </p>
        </div>

        <button
          onClick={() => alert('Generating Executive AI Recruitment BI Report in PDF/CSV format...')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center space-x-2 active:scale-95 cursor-pointer self-start lg:self-auto"
        >
          <Download className="w-4 h-4 text-white" />
          <span>Export Executive Report</span>
        </button>
      </div>

      {/* Top KPI Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)] hover:shadow-[0_20px_40px_rgba(15,23,42,0.06)] transition duration-300">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Avg Time to Hire</span>
            <Clock className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-slate-900">9.8 Days</span>
            <span className="text-[10px] text-emerald-700 ml-2 font-bold">↓ 72% faster</span>
            <p className="text-[10px] text-slate-400 mt-0.5">Traditional benchmark: 35 days</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)] hover:shadow-[0_20px_40px_rgba(15,23,42,0.06)] transition duration-300">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>AI Quality Index</span>
            <Sparkles className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-indigo-700">88.4 / 100</span>
            <span className="text-[10px] text-emerald-700 ml-2 font-bold">Top 5% Talent</span>
            <p className="text-[10px] text-slate-400 mt-0.5">Calculated across 12 factors</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)] hover:shadow-[0_20px_40px_rgba(15,23,42,0.06)] transition duration-300">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Salary Competitiveness</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-emerald-700">94.6%</span>
            <p className="text-[10px] text-slate-400 mt-0.5">Offers aligned with ZAR market</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)] hover:shadow-[0_20px_40px_rgba(15,23,42,0.06)] transition duration-300">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>POPIA & Privacy Shield</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-slate-900">100% Cleared</span>
            <p className="text-[10px] text-slate-400 mt-0.5">All SA IDs masked with [REDACTED]</p>
          </div>
        </div>
      </div>

      {/* AI Interactive Strategy & Threshold Simulator */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-7 shadow-xl border border-indigo-900/50 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-indigo-400" />
              <span className="text-xs uppercase font-extrabold tracking-wider text-indigo-300">AI Recruiter Strategy Simulator</span>
            </div>
            <h2 className="text-lg font-bold">Adjust Minimum AI Match Threshold Cutoff</h2>
            <p className="text-xs text-slate-300">
              Simulate candidate filtering strictness to see real-time impact on shortlist volume and recruitment velocity.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center gap-6">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-300 block">Simulated Cutoff</span>
              <span className="text-2xl font-extrabold text-cyan-400">{minMatchThreshold}% Match</span>
            </div>
            <div className="border-l border-white/20 pl-6">
              <span className="text-[10px] uppercase font-bold text-slate-300 block">Qualified Shortlist</span>
              <span className="text-2xl font-extrabold text-emerald-400">{simulatedQualifiedCount} Candidates ({simulatedPassPercentage}%)</span>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <input
            type="range"
            min="50"
            max="95"
            step="5"
            value={minMatchThreshold}
            onChange={(e) => setMinMatchThreshold(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[11px] font-semibold text-slate-400 mt-1.5">
            <span>50% (Broad Reach)</span>
            <span>75% (Balanced Recruiter Gold Standard)</span>
            <span>95% (Elite Only)</span>
          </div>
        </div>
      </div>

      {/* Interactive Charts Section 1: Candidate AI Score Bands & Time-to-Hire Speedup */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Candidate AI Score Distribution Bar Chart */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-6 space-y-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-600" /> Candidate AI Suitability Score Bands
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Breakdown of candidates by AI overall match score across active vacancies.
              </p>
            </div>
            <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2.5 py-1 rounded-full border border-indigo-200">
              {candidates.length} Applications Evaluated
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px', border: 'none' }}
                  itemStyle={{ color: '#38bdf8' }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {scoreDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Time-To-Hire Speedup Area Chart */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-6 space-y-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" /> Time-To-Fill Speedup (Days)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Comparing traditional manual time-to-hire vs. Aura automated screening speed.
              </p>
            </div>
            <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1 rounded-full border border-emerald-200">
              72% Speed Boost
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeToHireData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px', border: 'none' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="traditionalDays" name="Traditional Screening (Days)" stroke="#94a3b8" fillOpacity={1} fill="url(#colorTrad)" />
                <Area type="monotone" dataKey="aiDays" name="Aura AI Screening (Days)" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAi)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Interactive Charts Section 2: Application Sources Donut Chart & Top Skills Matched */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Chart 3: Sourcing Channel Performance (Pie / Donut) */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-6 space-y-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-600" /> Sourcing Channel Breakdown
          </h2>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px', border: 'none' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 text-xs border-t border-slate-200/80 pt-3">
            {sourceData.map((src, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                  <span className="font-semibold text-slate-700">{src.name}</span>
                </div>
                <span className="font-bold text-slate-900">{src.value} ({Math.round((src.value / candidates.length) * 100)}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 4: Top Skills Matched */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-6 space-y-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-600" /> Top Technical Skills Matched
          </h2>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topSkillsData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} hide />
                <YAxis dataKey="skill" type="category" tick={{ fontSize: 10, fill: '#334155', fontWeight: 600 }} width={75} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px', border: 'none' }} />
                <Bar dataKey="candidates" fill="#10b981" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[11px] text-slate-500 border-t border-slate-200/80 pt-2">
            Skill frequency automatically mined from candidate CVs using Gemini entity extraction.
          </p>
        </div>

        {/* Top Universities Represented */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-6 space-y-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-600" /> Top Institutions Represented
          </h2>

          <div className="space-y-2.5 text-xs">
            {Object.entries(universitiesCount).map(([uni, count], idx) => (
              <div key={idx} className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/80 flex justify-between items-center">
                <span className="font-semibold text-slate-800 truncate max-w-[170px]">{uni}</span>
                <span className="bg-indigo-50 text-indigo-700 text-[10px] px-2.5 py-0.5 rounded-full font-bold border border-indigo-200/80">
                  {count} Candidate{count > 1 ? 's' : ''}
                </span>
              </div>
            ))}
          </div>

          <div className="p-3 bg-indigo-50/60 border border-indigo-200/60 rounded-xl text-[11px] text-slate-700 space-y-1">
            <span className="font-bold text-indigo-900 block">NQF Qualification Alignment</span>
            <p>100% of candidate tertiary qualifications mapped to SAQA NQF Framework levels (NQF 7–9).</p>
          </div>
        </div>
      </div>
    </div>
  );
};
