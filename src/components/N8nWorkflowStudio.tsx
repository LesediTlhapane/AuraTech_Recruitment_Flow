import React, { useState, useEffect } from 'react';
import { ApplicationRecord } from '../types';
import { triggerN8nWebhook, N8nWebhookResponse } from '../services/api';
import { 
  Workflow, 
  Play, 
  CheckCircle2, 
  Layers, 
  Sparkles,
  ShieldCheck,
  BrainCircuit,
  Zap,
  GitFork,
  Database,
  Mail,
  Calendar,
  Check,
  Clock,
  UserCheck,
  RefreshCw,
  FileText,
  ArrowRight,
  ShieldAlert,
  Sliders,
  CheckCircle,
  Eye,
  Link,
  Send,
  Copy,
  Download,
  Globe,
  Key,
  Terminal,
  ExternalLink,
  AlertCircle
} from 'lucide-react';

interface N8nWorkflowStudioProps {
  candidates: ApplicationRecord[];
}

export const N8nWorkflowStudio: React.FC<N8nWorkflowStudioProps> = ({ candidates }) => {
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(candidates[0]?.id || '');
  const [activeSection, setActiveSection] = useState<number>(4); // Default to AI Analysis section
  const [activeNodeName, setActiveNodeName] = useState<string>('🤖 Gemini Flash · Candidate Analysis');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState<number>(0);
  const [simulationLog, setSimulationLog] = useState<string[]>([]);

  // Live n8n Connection States
  const defaultWebhookUrl = 'https://leseditlhapane.app.n8n.cloud/webhook-test/aura/candidate-application';
  const [webhookUrl, setWebhookUrl] = useState<string>(
    () => localStorage.getItem('aura_n8n_webhook_url') || defaultWebhookUrl
  );
  const [apiKeyHeader, setApiKeyHeader] = useState<string>(
    () => localStorage.getItem('aura_n8n_api_key') || ''
  );
  const [autoForward, setAutoForward] = useState<boolean>(
    () => localStorage.getItem('aura_n8n_autoforward') !== 'false'
  );
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [webhookTestResult, setWebhookTestResult] = useState<N8nWebhookResponse | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Sync settings to localStorage
  useEffect(() => {
    localStorage.setItem('aura_n8n_webhook_url', webhookUrl);
  }, [webhookUrl]);

  useEffect(() => {
    localStorage.setItem('aura_n8n_api_key', apiKeyHeader);
  }, [apiKeyHeader]);

  useEffect(() => {
    localStorage.setItem('aura_n8n_autoforward', String(autoForward));
  }, [autoForward]);

  const selectedCandidate = candidates.find((c) => c.id === selectedCandidateId) || candidates[0];
  const candidateName = selectedCandidate?.extractedData 
    ? `${selectedCandidate.extractedData.name} ${selectedCandidate.extractedData.surname}` 
    : 'Selected Candidate';

  // Sample n8n Workflow Blueprint JSON for export
  const n8nWorkflowBlueprintJson = {
    name: "Aura AI Recruitment Candidate Ingestion Pipeline",
    nodes: [
      {
        parameters: {
          httpMethod: "POST",
          path: "aura-candidate-intake",
          options: {}
        },
        id: "node-1-webhook",
        name: "Aura Ingestion Webhook Listener",
        type: "n8n-nodes-base.webhook",
        typeVersion: 1,
        position: [250, 300]
      },
      {
        parameters: {
          keepOnlySet: false,
          values: {
            string: [
              { name: "popiaStatus", value: "VERIFIED_CONSENT" },
              { name: "sanitizedCv", value: "={{ $json.body.rawCvText.replace(/\\b\\d{13}\\b/g, '[REDACTED-ID]') }}" }
            ]
          }
        },
        id: "node-2-popia",
        name: "POPIA Redaction & Sanitizer",
        type: "n8n-nodes-base.set",
        typeVersion: 1,
        position: [480, 300]
      },
      {
        parameters: {
          url: "https://api.aistudio.google.com/v1/models/gemini-2.5-flash:generateContent",
          options: {}
        },
        id: "node-3-gemini",
        name: "Gemini Flash AI Evaluator",
        type: "n8n-nodes-base.httpRequest",
        typeVersion: 3,
        position: [710, 300]
      },
      {
        parameters: {
          dataType: "number",
          value1: "={{ $json.overallScore }}",
          rules: {
            rules: [
              { operation: "gte", value2: 85 },
              { operation: "gte", value2: 70 }
            ]
          }
        },
        id: "node-4-switch",
        name: "Candidate Tier Router",
        type: "n8n-nodes-base.switch",
        typeVersion: 1,
        position: [940, 300]
      }
    ],
    connections: {
      "Aura Ingestion Webhook Listener": {
        main: [[{ node: "POPIA Redaction & Sanitizer", type: "main", index: 0 }]]
      },
      "POPIA Redaction & Sanitizer": {
        main: [[{ node: "Gemini Flash AI Evaluator", type: "main", index: 0 }]]
      },
      "Gemini Flash AI Evaluator": {
        main: [[{ node: "Candidate Tier Router", type: "main", index: 0 }]]
      }
    }
  };

  const handleCopyBlueprintJson = () => {
    navigator.clipboard.writeText(JSON.stringify(n8nWorkflowBlueprintJson, null, 2));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadBlueprintJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(n8nWorkflowBlueprintJson, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "Aura_n8n_Recruitment_Workflow_Blueprint.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleTestLiveWebhook = async () => {
    if (!webhookUrl.trim()) return;
    setIsTestingWebhook(true);
    setWebhookTestResult(null);

    const testPayload = {
      event: "CANDIDATE_INGESTION_TEST",
      timestamp: new Date().toISOString(),
      candidate: {
        id: selectedCandidate?.id || "cand-test-101",
        name: candidateName,
        email: selectedCandidate?.extractedData?.email || "candidate@test.co.za",
        phone: selectedCandidate?.extractedData?.phone || "+27 82 555 0192",
        jobTitle: selectedCandidate?.jobTitle || "Software Engineer",
        rawCvText: selectedCandidate?.rawCvText || "Sample candidate resume text for n8n evaluation...",
        skills: selectedCandidate?.extractedData?.technicalSkills || ["Java", "React", "TypeScript", "PostgreSQL"],
        popiaConsent: true,
      },
      sourceSystem: "Aura Enterprise AI Recruitment Platform"
    };

    const headers: Record<string, string> = {};
    if (apiKeyHeader.trim()) {
      headers['X-N8N-API-KEY'] = apiKeyHeader.trim();
      headers['Authorization'] = `Bearer ${apiKeyHeader.trim()}`;
    }

    const result = await triggerN8nWebhook(webhookUrl.trim(), testPayload, headers);
    setWebhookTestResult(result);
    setIsTestingWebhook(false);
  };

  // 8 Defined Pipeline Modules
  const sections = [
    {
      id: 1,
      title: "1 · Application Intake",
      color: "border-blue-500 text-blue-700 bg-blue-50/50",
      icon: Zap,
      nodes: [
        "📥 Receive Candidate Application",
        "🧪 Sanitize & Standardize Payload",
        "✅ Validate Required Fields",
        "🧾 Generate Unique Application ID"
      ],
      description: "Webhook listener catches new applications, validates essential contact fields, and issues a trackable application ID."
    },
    {
      id: 2,
      title: "2 · CV Text Processing",
      color: "border-cyan-500 text-cyan-700 bg-cyan-50/50",
      icon: FileText,
      nodes: [
        "🗄️ Secure Document Storage",
        "📄 OCR & Resume Text Extraction",
        "👤 Parse Contact Details",
        "🛠️ Skill Keyword Normalizer",
        "💼 Experience Timeline Extractor",
        "🎓 NQF Qualification Classifier"
      ],
      description: "Parses PDF/Word resumes into structured data, mapping skills, job histories, and South African NQF qualification levels."
    },
    {
      id: 3,
      title: "3 · POPIA & Privacy Shield",
      color: "border-emerald-500 text-emerald-700 bg-emerald-50/50",
      icon: ShieldCheck,
      nodes: [
        "⚖️ POPIA Consent Verification",
        "🕵️ 13-Digit SA ID Detection",
        "🧹 PII Masking & Redaction",
        "🗂️ Audit Log Logging"
      ],
      description: "Verifies POPIA consent, detects SA ID numbers, and replaces sensitive PII with [REDACTED-ID] prior to model inference."
    },
    {
      id: 4,
      title: "4 · Gemini AI Evaluation",
      color: "border-indigo-500 text-indigo-700 bg-indigo-50/50",
      icon: BrainCircuit,
      nodes: [
        "🤖 Gemini Flash · Candidate Analysis",
        "🧩 AI Result Normalizer",
        "📊 12-Factor Fit Matrix Calculator"
      ],
      description: "Invokes Gemini 2.5 Flash to evaluate candidate fit across 12 competencies, returning a confidence score, strengths, and risks."
    },
    {
      id: 5,
      title: "5 · Job Matching Engine",
      color: "border-purple-500 text-purple-700 bg-purple-50/50",
      icon: Sparkles,
      nodes: [
        "📋 Retrieve Job Description Spec",
        "🎯 Skill Gap & Overlap Analysis",
        "🧮 Composite Suitability Score"
      ],
      description: "Blends deterministic skill matching with AI qualitative feedback to compute a final 0–100 candidate suitability rating."
    },
    {
      id: 6,
      title: "6 · Decision Switch Matrix",
      color: "border-amber-500 text-amber-700 bg-amber-50/50",
      icon: GitFork,
      nodes: [
        "🧠 Automated Threshold Routing"
      ],
      description: "Evaluates score against decision bands: ELITE (90%+), SHORTLIST (75-89%), RECRUITER REVIEW (60-74%), and REJECT (<60%)."
    },
    {
      id: 7,
      title: "7 · Automated Action Router",
      color: "border-pink-500 text-pink-700 bg-pink-50/50",
      icon: Workflow,
      nodes: [
        "🌟 Priority Interview Invitation",
        "📅 Calendar Slot Availability Check",
        "✉️ Tailored Candidate Email Dispatch",
        "📣 Hiring Manager Alert"
      ],
      description: "Triggers automated actions based on candidate tier: priority calendar links, custom email templates, and team alerts."
    },
    {
      id: 8,
      title: "8 · Database & Audit Persistence",
      color: "border-slate-500 text-slate-700 bg-slate-50/50",
      icon: Database,
      nodes: [
        "🧱 Candidate Profile Builder",
        "💾 Database Synchronization",
        "📐 Recruitment Velocity Analytics",
        "📁 Immutable Audit Trace Log"
      ],
      description: "Persists enriched candidate records to Supabase / Firestore, updates live funnel metrics, and generates audit logs."
    }
  ];

  const getNodeDetails = (nodeName: string) => {
    const c = selectedCandidate;
    const name = candidateName;

    switch (nodeName) {
      case "📥 Receive Candidate Application":
        return {
          purpose: "Ingest candidate submission via secure API endpoint",
          executionTime: "12 ms",
          status: "Active / Listening",
          inputSchema: {
            source: "Careers Portal / Email Ingestion",
            candidateName: name,
            jobTitle: c?.jobTitle || "Software Engineer",
            timestamp: new Date().toISOString()
          },
          aiTransformation: "Validates incoming HTTP payload headers and rate-limits requests.",
          outputSchema: {
            ingestionStatus: "SUCCESS",
            rawPayloadReceived: true,
            processingQueue: "Intake-Worker-01"
          }
        };

      case "🧹 PII Masking & Redaction":
        return {
          purpose: "Protect candidate privacy in accordance with POPIA & GDPR regulations",
          executionTime: "45 ms",
          status: "Compliance Passed",
          inputSchema: {
            candidateName: name,
            detectedPiiTypes: ["South African ID Number", "Home Address"],
            consentStatus: "VERIFIED"
          },
          aiTransformation: "Replaces 13-digit SA national ID numbers with [REDACTED-ID] before sending text to external LLMs.",
          outputSchema: {
            redactedText: `CV Text for ${name} [REDACTED-ID]`,
            popiaCompliant: true,
            auditTimestamp: new Date().toISOString()
          }
        };

      case "🤖 Gemini Flash · Candidate Analysis":
        return {
          purpose: "Deep semantic analysis of qualifications, technical skills, and experience alignment",
          executionTime: "840 ms",
          status: "AI Execution Completed",
          inputSchema: {
            model: "Gemini 2.5 Flash",
            candidateName: name,
            targetRole: c?.jobTitle || "Target Vacancy",
            requiredSkills: c?.extractedData?.technicalSkills || ["Java", "TypeScript", "SQL"]
          },
          aiTransformation: "Evaluates CV against 12 key recruitment dimensions including skill depth, experience relevance, and career growth.",
          outputSchema: {
            overallMatchScore: `${c?.scores?.overallScore || 88}%`,
            confidenceLevel: "96%",
            keyStrengths: [
              c?.summary?.technicalAlignment || "Strong technical alignment with stack requirements",
              c?.summary?.leadershipAndSoftSkills || "Demonstrated project ownership"
            ],
            riskFlags: c?.summary?.keyConcerns || ["Verify notice period requirements"],
            recommendation: (c?.scores?.overallScore || 88) >= 85 ? "SHORTLIST" : "REVIEW"
          }
        };

      case "🧠 Automated Threshold Routing":
        return {
          purpose: "Instantly branch candidate into the appropriate recruitment pipeline stage",
          executionTime: "18 ms",
          status: "Routed",
          inputSchema: {
            candidateId: c?.id || "AURA-CAND-001",
            calculatedScore: c?.scores?.overallScore || 88,
            popiaCleared: true
          },
          aiTransformation: "Compares score against organizational thresholds to determine next automated step.",
          outputSchema: {
            assignedBranch: (c?.scores?.overallScore || 88) >= 90 
              ? "ELITE (Auto-Invite)" 
              : (c?.scores?.overallScore || 88) >= 75 
                ? "SHORTLIST (Recruiter Review)" 
                : "REJECT (Polite Decline)",
            triggeredNextStep: "Prepare Tailored Email & Interview Slot"
          }
        };

      default:
        return {
          purpose: "Automated pipeline step in the n8n recruitment workflow",
          executionTime: "30 ms",
          status: "Completed",
          inputSchema: {
            candidateName: name,
            jobTitle: c?.jobTitle || "Role",
            currentStage: "Automated Screening"
          },
          aiTransformation: "Executes rule-based logic to process candidate data efficiently.",
          outputSchema: {
            stepExecuted: nodeName,
            success: true,
            nextStage: "Database Sync"
          }
        };
    }
  };

  const runSimulation = () => {
    setIsSimulating(true);
    setSimulationStep(0);
    setSimulationLog([]);

    const logMessages = [
      `📥 [MODULE 1 · INTAKE]: Ingested application for ${candidateName} via Webhook...`,
      `📄 [MODULE 2 · PARSER]: Extracted text, skills (${(selectedCandidate?.extractedData?.technicalSkills || []).slice(0,3).join(', ')}) & NQF qualifications...`,
      `⚖️ [MODULE 3 · POPIA]: Verified consent & applied [REDACTED-ID] sanitization...`,
      `🤖 [MODULE 4 · GEMINI FLASH]: Invoked 12-factor evaluation (Confidence: 96%)...`,
      `🎯 [MODULE 5 · MATCHING]: Calculated composite suitability score (${selectedCandidate?.scores?.overallScore || 88}/100)...`,
      `🧠 [MODULE 6 · SWITCH]: Routed candidate to ${selectedCandidate?.category || 'SHORTLIST'} pipeline branch...`,
      `✉️ [MODULE 7 · ACTIONS]: Generated personalized candidate communication draft...`,
      `💾 [MODULE 8 · AUDIT]: Persisted record to database with TRACE-${selectedCandidate?.id.replace('cand-', '') || '9821'}.`
    ];

    logMessages.forEach((msg, idx) => {
      setTimeout(() => {
        setSimulationStep(idx + 1);
        setSimulationLog((prev) => [...prev, msg]);
        if (idx === logMessages.length - 1) {
          setIsSimulating(false);
        }
      }, (idx + 1) * 550);
    });
  };

  const activeNodeDetail = getNodeDetails(activeNodeName);

  return (
    <div className="space-y-8">
      {/* Top Header Banner */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-7 text-slate-800 shadow-[0_10px_30px_rgba(15,23,42,0.04)] relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-0.5 rounded-full border border-indigo-200/80 flex items-center gap-1">
                <Workflow className="w-3.5 h-3.5 text-indigo-600" /> n8n Enterprise Workflow Integration
              </span>
              <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200/80">
                Live Webhook Connector
              </span>
              <span className="text-xs bg-cyan-50 text-cyan-800 font-semibold px-2.5 py-0.5 rounded-full border border-cyan-200">
                Gemini 2.5 Flash Engine
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              Aura AI Recruitment Automation & n8n Studio
            </h1>
            <p className="text-sm text-slate-600 mt-1.5 max-w-2xl leading-relaxed">
              Connect your external n8n workflow webhook endpoint, trigger live candidate test payloads, download importable n8n workflow blueprints, and inspect pipeline modules.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={runSimulation}
              disabled={isSimulating}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-indigo-500/20 transition flex items-center space-x-2 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isSimulating ? (
                <>
                  <RefreshCw className="w-4 h-4 text-white animate-spin" />
                  <span>Simulating Workflow... ({simulationStep}/8)</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-white fill-white" />
                  <span>Simulate Internal Run</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 🚀 LIVE N8N WEBHOOK CONNECTOR & TEST SUITE */}
      <div className="bg-slate-900 text-white rounded-2xl p-7 shadow-xl border border-indigo-900/50 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Connect External n8n Webhook Endpoint
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Provide your n8n Production or Test Webhook URL to send real candidate applications directly into your n8n workflow canvas.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyBlueprintJson}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 cursor-pointer active:scale-95"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-indigo-300" />}
              <span>{isCopied ? 'Blueprint Copied!' : 'Copy n8n Blueprint JSON'}</span>
            </button>

            <button
              onClick={handleDownloadBlueprintJson}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 cursor-pointer active:scale-95 shadow-md shadow-indigo-600/20"
            >
              <Download className="w-3.5 h-3.5 text-white" />
              <span>Download n8n_Workflow.json</span>
            </button>
          </div>
        </div>

        {/* Webhook Configuration Inputs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-1.5">
            <label className="block text-xs font-bold text-slate-300 flex items-center gap-1">
              <Link className="w-3.5 h-3.5 text-indigo-400" /> n8n Webhook URL (Production or Test) *
            </label>
            <input
              type="text"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://n8n.yourcompany.com/webhook/aura-candidate-intake"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-cyan-300 font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300 flex items-center gap-1">
              <Key className="w-3.5 h-3.5 text-amber-400" /> Custom API Key Header (Optional)
            </label>
            <input
              type="text"
              value={apiKeyHeader}
              onChange={(e) => setApiKeyHeader(e.target.value)}
              placeholder="e.g. n8n_sec_key_984312"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-amber-200 font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Auto Forward Toggle + Action Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={autoForward}
              onChange={(e) => setAutoForward(e.target.checked)}
              className="w-4 h-4 rounded accent-indigo-500 cursor-pointer"
            />
            <div>
              <span className="font-bold text-white block">Auto-Forward All Ingested Applications</span>
              <span className="text-[11px] text-slate-400">
                Whenever a new CV is submitted on Aura, post the JSON payload to your n8n Webhook URL automatically.
              </span>
            </div>
          </label>

          <button
            onClick={handleTestLiveWebhook}
            disabled={isTestingWebhook || !webhookUrl.trim()}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-50 cursor-pointer shrink-0 shadow-lg shadow-emerald-600/20"
          >
            {isTestingWebhook ? (
              <>
                <RefreshCw className="w-4 h-4 text-white animate-spin" />
                <span>Posting Webhook Payload...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 text-white" />
                <span>Trigger Live Webhook Test</span>
              </>
            )}
          </button>
        </div>

        {/* Webhook Response Output Inspector */}
        {webhookTestResult && (
          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-2 font-mono text-xs animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-slate-300 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-indigo-400" /> n8n HTTP Response Log
              </span>
              <div className="flex items-center space-x-3 text-[11px]">
                <span className={`px-2 py-0.5 rounded font-bold ${webhookTestResult.success ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'}`}>
                  {webhookTestResult.status ? `HTTP ${webhookTestResult.status} ${webhookTestResult.statusText || ''}` : 'Execution Error'}
                </span>
                <span className="text-slate-400">⚡ {webhookTestResult.durationMs || 0} ms</span>
              </div>
            </div>

            <div className="pt-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Response Body Output from n8n:</span>
              <pre className="bg-slate-900 p-3 rounded-lg text-cyan-300 overflow-x-auto text-[11px]">
                {JSON.stringify(webhookTestResult.response || webhookTestResult.error || webhookTestResult, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Live Simulation Trace Drawer */}
      {simulationLog.length > 0 && (
        <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-xl space-y-3 animate-in fade-in duration-300">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-2">
              <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
              Live n8n Execution Trace Log
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Candidate: {candidateName}</span>
          </div>
          <div className="space-y-1.5 font-mono text-xs">
            {simulationLog.map((log, i) => (
              <div key={i} className="flex items-start gap-2 text-slate-300">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{log}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Visual n8n Flowchart Sketch Graph */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-6 space-y-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Workflow className="w-4 h-4 text-indigo-600" /> Interactive n8n Visual Workflow Blueprint
            </h2>
            <p className="text-xs text-slate-500">
              Interactive flowchart showing how candidate data flows sequentially through the automated n8n pipeline.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-3 py-1 rounded-full self-start sm:self-auto">
            Click any block to inspect node specification
          </span>
        </div>

        {/* Visual Connecting Nodes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {sections.map((sec) => {
            const Icon = sec.icon;
            const isSecActive = activeSection === sec.id;

            return (
              <div
                key={sec.id}
                onClick={() => {
                  setActiveSection(sec.id);
                  setActiveNodeName(sec.nodes[0]);
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between space-y-3 ${
                  isSecActive
                    ? `${sec.color} ring-2 ring-indigo-500/40 shadow-md`
                    : 'bg-slate-50/80 border-slate-200/80 hover:bg-slate-100/70 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-900 text-white">
                    STEP {sec.id}
                  </span>
                  <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] text-slate-500 font-semibold">Active</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Icon className="w-4 h-4 text-slate-800" />
                    <h3 className="font-bold text-xs text-slate-900">{sec.title.split(' · ')[1]}</h3>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-tight">
                    {sec.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                  <span className="font-semibold text-slate-500">{sec.nodes.length} Configured Nodes</span>
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Complete n8n Pipeline Architecture (8 Modules) */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-6 space-y-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" /> Complete n8n Pipeline Architecture (8 Modules)
          </h2>
          <p className="text-xs text-slate-500">
            Select a module to filter its nodes in the Active Module Node Selector.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sections.map((s) => {
            const Icon = s.icon;
            const isSelected = activeSection === s.id;

            return (
              <div
                key={s.id}
                onClick={() => {
                  setActiveSection(s.id);
                  setActiveNodeName(s.nodes[0]);
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? `${s.color} ring-2 ring-indigo-500/30 shadow-md`
                    : 'bg-slate-50/80 border-slate-200/80 hover:border-slate-300 hover:bg-slate-100/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider">{s.nodes.length} Nodes</span>
                    <Icon className="w-4 h-4 text-slate-600" />
                  </div>
                  <h3 className="font-bold text-xs text-slate-900">{s.title}</h3>
                  <p className="text-[10px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">{s.description}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                  <span className="font-bold text-slate-700">Inspect Module Nodes</span>
                  <ArrowRight className="w-3 h-3 text-slate-500" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Node Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Active Module Node Selector */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-6 space-y-5 text-xs shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-1">
              <Sliders className="w-4 h-4 text-cyan-600" /> Active Module Node Selector
            </h2>
            <p className="text-slate-500 text-[11px]">Choose a node in Module #{activeSection} to view functional specifications:</p>
          </div>

          <div className="space-y-1.5">
            {sections.find((s) => s.id === activeSection)?.nodes.map((nodeName) => {
              const isNodeActive = activeNodeName === nodeName;
              return (
                <button
                  key={nodeName}
                  onClick={() => setActiveNodeName(nodeName)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs font-semibold transition flex items-center justify-between cursor-pointer ${
                    isNodeActive
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-slate-50 text-slate-800 border-slate-200/80 hover:bg-slate-100'
                  }`}
                >
                  <span className="truncate max-w-[200px]">{nodeName}</span>
                  {isNodeActive && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-200/80 space-y-2">
            <label htmlFor="test-candidate-select" className="block text-slate-700 font-semibold">Test Candidate Dataset:</label>
            <select
              id="test-candidate-select"
              aria-label="Select test candidate dataset for simulation preview"
              value={selectedCandidateId}
              onChange={(e) => setSelectedCandidateId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium cursor-pointer"
            >
              {candidates.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.extractedData ? `${c.extractedData.name} ${c.extractedData.surname}` : 'Candidate'} ({c.scores?.overallScore || 0}% Score)
                </option>
              ))}
            </select>
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-50/80 border border-indigo-200/80 text-slate-800 space-y-1">
            <span className="text-indigo-900 font-bold block flex items-center gap-1.5 text-[11px]">
              <UserCheck className="w-3.5 h-3.5 text-indigo-700" /> Enterprise Reliability
            </span>
            <p className="text-slate-700 text-[11px] leading-relaxed">
              This node operates within n8n’s sandboxed environment, ensuring end-to-end trace logging without exposing raw database credentials.
            </p>
          </div>
        </div>

        {/* Right Column: High-Level Node Inspector Specification */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-6 space-y-5 text-xs shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Node Specification</span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">{activeNodeName}</h3>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                {activeNodeDetail.status}
              </span>
              <span className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-slate-200">
                ⚡ {activeNodeDetail.executionTime}
              </span>
            </div>
          </div>

          {/* Node Purpose */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Node Objective</span>
            <p className="text-xs text-slate-800 font-medium leading-relaxed">{activeNodeDetail.purpose}</p>
          </div>

          {/* Input Payload Sketch & AI Logic */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold uppercase text-indigo-600 tracking-wider flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" /> Sample Input Structure
              </span>
              <pre className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-cyan-300 text-[11px] font-mono overflow-x-auto max-h-[180px]">
                {JSON.stringify(activeNodeDetail.inputSchema, null, 2)}
              </pre>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-extrabold uppercase text-emerald-600 tracking-wider flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Output Payload
              </span>
              <pre className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-emerald-400 text-[11px] font-mono overflow-x-auto max-h-[180px]">
                {JSON.stringify(activeNodeDetail.outputSchema, null, 2)}
              </pre>
            </div>
          </div>

          {/* AI Transformation Summary */}
          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200/60 space-y-1 text-slate-800">
            <span className="text-[10px] font-extrabold uppercase text-indigo-700 tracking-wider block">Automation Logic Summary</span>
            <p className="text-xs text-slate-700 leading-relaxed">{activeNodeDetail.aiTransformation}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
