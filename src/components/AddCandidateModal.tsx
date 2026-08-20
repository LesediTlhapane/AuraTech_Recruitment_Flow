import React, { useState } from 'react';
import { JobProfile, ApplicationRecord, ApplicationSource } from '../types';
import { screenCandidateWithAi, triggerN8nWebhook } from '../services/api';
import { Sparkles, FileText, Upload, BrainCircuit, CheckCircle2, Paperclip, User, Mail, Phone, MapPin, GraduationCap, Briefcase, DollarSign, Clock, AlertCircle, AlertTriangle } from 'lucide-react';

interface AddCandidateModalProps {
  jobs: JobProfile[];
  onClose: () => void;
  onAddCandidate: (candidate: ApplicationRecord) => void;
}

export const AddCandidateModal: React.FC<AddCandidateModalProps> = ({
  jobs,
  onClose,
  onAddCandidate,
}) => {
  const [selectedJobId, setSelectedJobId] = useState(jobs[0]?.id || '');
  const [source, setSource] = useState<ApplicationSource>('LinkedIn');
  const [rawCvText, setRawCvText] = useState('');
  const [coverLetterText, setCoverLetterText] = useState('');
  
  // Attached CV File
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);
  const [attachedFileSize, setAttachedFileSize] = useState<string | null>(null);

  // Detailed Candidate Form State (extracted or manually entered)
  const [candidateName, setCandidateName] = useState('');
  const [candidateSurname, setCandidateSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [qualification, setQualification] = useState('');
  const [yearsExperience, setYearsExperience] = useState<number | undefined>(undefined);
  const [skillsString, setSkillsString] = useState('');
  const [noticePeriod, setNoticePeriod] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');

  const [isExtracting, setIsExtracting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const sampleCvPresets = [
    {
      name: 'Senior Dev: Sipho Ndlovu',
      text: `SIPHO NDLOVU\nSandton, Johannesburg | +27 82 555 0192 | sipho.ndlovu@techsa.co.za\nSenior Software Engineer with 8 years Java, Spring Boot, React, and Azure cloud experience.\nEDUCATION: BSc Computer Science (Wits, NQF 7)\nEXPERIENCE: Senior Java Developer at Nedbank Digital (2022-Present)\nSKILLS: Java, React, TypeScript, Azure, PostgreSQL, Microservices.\nNOTICE: 30 Days | SALARY: R980,000`,
      extracted: {
        name: 'Sipho',
        surname: 'Ndlovu',
        email: 'sipho.ndlovu@techsa.co.za',
        phone: '+27 82 555 0192',
        location: 'Sandton, Johannesburg',
        qual: 'BSc Computer Science (Wits, NQF 7)',
        exp: 8,
        skills: 'Java, Spring Boot, React, TypeScript, Azure, PostgreSQL, Microservices',
        notice: '30 Days',
        salary: 'R980,000 / annum'
      }
    },
    {
      name: 'Cloud Dev: Liezel van der Merwe',
      text: `LIEZEL VAN DER MERWE\nPretoria East / Sandton | +27 83 412 8890 | liezel.vdm@cloud.co.za\nCloud Solutions Developer with 7 years experience.\nEXPERIENCE: CloudCraft SA (2023-Present), Parental Sabbatical & Freelance (Feb 2021-Dec 2022), Standard Bank (2017-2021)\nEDUCATION: BTech IT (TUT)\nSKILLS: Azure, Kubernetes, Docker, C#, .NET Core, Terraform\nNOTICE: 60 Days | SALARY: R1,050,000`,
      extracted: {
        name: 'Liezel',
        surname: 'van der Merwe',
        email: 'liezel.vdm@cloud.co.za',
        phone: '+27 83 412 8890',
        location: 'Pretoria East, Gauteng',
        qual: 'BTech Information Technology (TUT, NQF 7)',
        exp: 7,
        skills: 'Azure, Kubernetes, Docker, C#, .NET Core, Terraform',
        notice: '60 Days',
        salary: 'R1,050,000 / annum'
      }
    }
  ];

  // Handle File Upload & Extraction
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAttachedFileName(file.name);
    setAttachedFileSize(`${(file.size / 1024).toFixed(1)} KB`);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setRawCvText(text);
        autoExtractFromText(text, file.name);
      }
    };
    reader.readAsText(file);
  };

  const autoExtractFromText = (text: string, fileName?: string) => {
    setIsExtracting(true);

    setTimeout(() => {
      // Basic heuristics / parser simulation
      const lines = text.split('\n').filter(l => l.trim().length > 0);
      const nameParts = (lines[0] || '').trim().split(' ');
      
      const parsedName = candidateName || nameParts[0] || '';
      const parsedSurname = candidateSurname || nameParts.slice(1).join(' ') || '';
      
      const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      const phoneMatch = text.match(/(?:\+27|0)\s?\d{2}\s?\d{3}\s?\d{4}/);
      
      if (!candidateName && parsedName) setCandidateName(parsedName);
      if (!candidateSurname && parsedSurname) setCandidateSurname(parsedSurname);
      if (emailMatch) setEmail(emailMatch[0]);
      if (phoneMatch) setPhone(phoneMatch[0]);

      setIsExtracting(false);
    }, 600);
  };

  const loadPreset = (preset: typeof sampleCvPresets[0]) => {
    setRawCvText(preset.text);
    setAttachedFileName(`CV_${preset.extracted.name}_${preset.extracted.surname}.pdf`);
    setAttachedFileSize('245 KB');
    setCandidateName(preset.extracted.name);
    setCandidateSurname(preset.extracted.surname);
    setEmail(preset.extracted.email);
    setPhone(preset.extracted.phone);
    setLocation(preset.extracted.location);
    setQualification(preset.extracted.qual);
    setYearsExperience(preset.extracted.exp);
    setSkillsString(preset.extracted.skills);
    setNoticePeriod(preset.extracted.notice);
    setExpectedSalary(preset.extracted.salary);
  };

  const handleIngestAndScreen = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const targetJob = jobs.find((j) => j.id === selectedJobId) || jobs[0];
    if (!targetJob) {
      setErrorMessage('Please select a valid job vacancy to screen candidate against.');
      return;
    }

    const candidateId = `cand-${Date.now()}`;
    const trimmedFirstName = candidateName.trim();
    const trimmedLastName = candidateSurname.trim();
    const fullCandidateName = `${trimmedFirstName} ${trimmedLastName}`.trim() || 'Candidate';
    const parsedSkills = skillsString
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const parsedExp = yearsExperience !== undefined && yearsExperience !== null && !isNaN(Number(yearsExperience))
      ? Number(yearsExperience)
      : undefined;

    const authoritativeCandidateProfile = {
      candidateId,
      firstName: trimmedFirstName,
      lastName: trimmedLastName,
      fullName: fullCandidateName,
      email: email.trim(),
      phone: phone.trim(),
      location: location.trim(),
      qualification: qualification.trim(),
      yearsExperience: parsedExp,
      skills: parsedSkills,
      noticePeriod: noticePeriod.trim(),
      expectedSalary: expectedSalary.trim(),
      rawCvText: rawCvText.trim() || undefined,
      coverLetterText: coverLetterText.trim() || undefined,
    };

    // Logging around the screening request
    console.log(`[Screening candidate]: ${candidateId}`);
    console.log(`[Candidate name]: ${fullCandidateName}`);
    console.log(`[Candidate experience]: ${parsedExp !== undefined ? `${parsedExp} years` : 'Not provided'}`);
    console.log(`[Candidate skills]: ${parsedSkills.length > 0 ? parsedSkills.join(', ') : 'Not provided'}`);
    console.log(`[Vacancy]: ${targetJob.id}`);
    console.log(`[Job title]: ${targetJob.jobTitle}`);

    const cvContentToProcess = rawCvText.trim() || `CANDIDATE: ${fullCandidateName}\nEMAIL: ${email}\nPHONE: ${phone}\nLOCATION: ${location}\nQUALIFICATION: ${qualification}\nEXPERIENCE: ${parsedExp ?? 'Not provided'} Years\nSKILLS: ${skillsString}\nNOTICE: ${noticePeriod}\nSALARY: ${expectedSalary}`;

    setIsProcessing(true);
    setProcessingStep(1); // Extracting Data

    try {
      setTimeout(() => setProcessingStep(2), 700); // Scoring
      setTimeout(() => setProcessingStep(3), 1400); // Risk Analysis
      setTimeout(() => setProcessingStep(4), 2100); // Summary Generation

      const aiResult = await screenCandidateWithAi(
        cvContentToProcess,
        coverLetterText.trim() || undefined,
        targetJob,
        authoritativeCandidateProfile
      );

      // Override AI extracted details with authoritative user entered fields
      const finalExtractedData = {
        ...aiResult.extractedData,
        name: trimmedFirstName || aiResult.extractedData?.name || 'Applicant',
        surname: trimmedLastName || aiResult.extractedData?.surname || '',
        email: email.trim() || aiResult.extractedData?.email || '',
        phone: phone.trim() || aiResult.extractedData?.phone || '',
        location: location.trim() || aiResult.extractedData?.location || '',
        qualifications: qualification.trim() ? [qualification.trim()] : (aiResult.extractedData?.qualifications || []),
        technicalSkills: parsedSkills.length > 0 ? parsedSkills : (aiResult.extractedData?.technicalSkills || []),
        totalYearsExperience: parsedExp !== undefined ? parsedExp : (aiResult.extractedData?.totalYearsExperience || 0),
        noticePeriodDays: parseInt(noticePeriod) || aiResult.extractedData?.noticePeriodDays || 30,
        expectedSalaryZar: parseInt(expectedSalary.replace(/[^0-9]/g, '')) || aiResult.extractedData?.expectedSalaryZar || 0,
      };

      const now = new Date().toISOString();
      const newRecord: ApplicationRecord = {
        id: candidateId,
        jobId: targetJob.id,
        jobTitle: targetJob.jobTitle,
        candidateId,
        source,
        appliedDate: now,
        rawCvText: cvContentToProcess,
        coverLetterText: coverLetterText.trim() || undefined,
        extractedData: finalExtractedData,
        scores: aiResult.scores,
        category: aiResult.category,
        risks: aiResult.risks,
        summary: aiResult.summary,
        status: 'Screened',
        popiaConsent: {
          consented: true,
          timestamp: now,
          ipAddress: '102.132.214.12',
        },
        n8nPayload: aiResult.n8nPayload,
      };

      // Auto-Forward to n8n webhook if URL is set
      const defaultN8nUrl = 'https://leseditlhapane.app.n8n.cloud/webhook-test/aura/candidate-application';
      const webhookUrl = localStorage.getItem('aura_n8n_webhook_url') || defaultN8nUrl;
      const apiKeyHeader = localStorage.getItem('aura_n8n_api_key');

      const n8nDispatchPayload = {
        event: 'CANDIDATE_SCREENING_COMPLETED',
        timestamp: now,
        candidate_id: newRecord.id,
        vacancy_id: targetJob.id,
        candidate: {
          id: newRecord.id,
          name: `${finalExtractedData.name} ${finalExtractedData.surname}`.trim(),
          firstName: finalExtractedData.name,
          lastName: finalExtractedData.surname,
          email: finalExtractedData.email,
          phone: finalExtractedData.phone,
          location: finalExtractedData.location,
          yearsOfExperience: finalExtractedData.totalYearsExperience,
          skills: finalExtractedData.technicalSkills,
          qualifications: finalExtractedData.qualifications,
          education: finalExtractedData.education,
          workExperience: finalExtractedData.workExperience,
          certifications: finalExtractedData.certifications,
          noticePeriodDays: finalExtractedData.noticePeriodDays,
          expectedSalaryZar: finalExtractedData.expectedSalaryZar,
          rawCvText: cvContentToProcess,
          coverLetterText: coverLetterText.trim() || undefined,
          source,
        },
        vacancy: {
          id: targetJob.id,
          jobTitle: targetJob.jobTitle,
          department: targetJob.department,
          company: targetJob.company,
          location: targetJob.location,
          employmentType: targetJob.employmentType,
          salaryMinZar: targetJob.salaryMinZar,
          salaryMaxZar: targetJob.salaryMaxZar,
          minimumExperienceYears: targetJob.minimumExperienceYears,
          requiredSkills: targetJob.requiredSkills,
          preferredSkills: targetJob.preferredSkills,
          qualifications: targetJob.qualifications,
          jobDescription: targetJob.jobDescription,
        },
        screening: {
          overallScore: newRecord.scores.overallScore,
          category: newRecord.category,
          scores: newRecord.scores,
          risks: newRecord.risks,
          summary: newRecord.summary,
        },
        system: {
          platform: 'Aura Recruitment Flow AI',
          sourceSystem: 'Aura Enterprise Portal',
        },
      };

      console.log('[n8n Screening Request Payload]:', n8nDispatchPayload);

      if (webhookUrl && webhookUrl.trim()) {
        const headers: Record<string, string> = {};
        if (apiKeyHeader && apiKeyHeader.trim()) {
          headers['X-N8N-API-KEY'] = apiKeyHeader.trim();
        }

        try {
          const webhookResult = await triggerN8nWebhook(webhookUrl.trim(), n8nDispatchPayload, headers);
          console.log('[Aura -> n8n Ingestion Webhook Dispatch Result]:', webhookResult);
        } catch (e) {
          console.warn('[Aura -> n8n Webhook Warning]:', e);
        }
      }

      setTimeout(() => {
        setIsProcessing(false);
        onAddCandidate(newRecord);
        onClose();
      }, 2500);
    } catch (err: any) {
      console.error('[Candidate Ingestion & Screening Error]:', err);
      setIsProcessing(false);
      setErrorMessage(err.message || 'Failed to screen candidate. Please check that input data is valid and try again.');
    }
  };

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white border border-slate-200/90 rounded-2xl max-w-3xl w-full p-6 text-slate-800 shadow-[0_25px_70px_rgba(15,23,42,0.15)] my-8 space-y-5 animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex justify-between items-center border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Upload className="w-5 h-5 text-indigo-600" /> Ingest & Screen Application
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Attach CV document or paste text to extract candidate details and run AI screening.</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-700 text-xl font-bold transition"
          >
            &times;
          </button>
        </div>

        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-rose-800 animate-in fade-in">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold block">Candidate Screening Failed</span>
              <p className="mt-0.5 text-rose-700">{errorMessage}</p>
            </div>
            <button 
              type="button" 
              onClick={() => setErrorMessage(null)} 
              className="text-rose-500 hover:text-rose-800 font-bold ml-1"
            >
              &times;
            </button>
          </div>
        )}

        {isProcessing ? (
          <div className="py-12 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center mx-auto text-indigo-600 animate-pulse shadow-sm">
              <BrainCircuit className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-slate-900">Aura AI Screening Engine Processing...</h3>
              <p className="text-xs text-slate-500">Evaluating candidate background against role parameters & compliance rules</p>
            </div>

            <div className="max-w-md mx-auto space-y-2 text-xs text-left">
              <div className={`p-2.5 rounded-xl border flex items-center space-x-2 ${processingStep >= 1 ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-medium' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Extracting candidate entities, qualifications & experience...</span>
              </div>
              <div className={`p-2.5 rounded-xl border flex items-center space-x-2 ${processingStep >= 2 ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-medium' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Evaluating 12 suitability metrics against Job Spec...</span>
              </div>
              <div className={`p-2.5 rounded-xl border flex items-center space-x-2 ${processingStep >= 3 ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-medium' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Performing career stability & risk concern analysis...</span>
              </div>
              <div className={`p-2.5 rounded-xl border flex items-center space-x-2 ${processingStep >= 4 ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-medium' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Generating Executive Summary & Integration Payload...</span>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleIngestAndScreen} className="space-y-4 text-xs">
            {/* Vacancy and Source */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Target Vacancy *</label>
                <select
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="w-full bg-slate-50/80 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium shadow-xs"
                >
                  {jobs.map((j) => (
                    <option key={j.id} value={j.id}>{j.jobTitle} ({j.company})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Application Source *</label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value as ApplicationSource)}
                  className="w-full bg-slate-50/80 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium shadow-xs"
                >
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Careers Website">Careers Website</option>
                  <option value="Email">Email</option>
                  <option value="Job Portals">Job Portals</option>
                  <option value="Manual Upload">Manual Upload</option>
                </select>
              </div>
            </div>

            {/* CV Attachment Dropzone */}
            <div className="border-2 border-dashed border-indigo-200/80 hover:border-indigo-400 rounded-2xl p-4 bg-indigo-50/30 transition text-center space-y-2">
              <div className="flex justify-center items-center gap-2 text-indigo-700 font-semibold text-xs">
                <Paperclip className="w-4 h-4" />
                <span>Attach CV File (PDF, DOCX, TXT)</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Upload a candidate CV to automatically extract details into the form below.
              </p>
              
              <div className="flex items-center justify-center gap-3 pt-1">
                <label className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition cursor-pointer shadow-xs">
                  <span>Browse File...</span>
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {sampleCvPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => loadPreset(preset)}
                    className="bg-white hover:bg-slate-50 text-indigo-700 border border-indigo-200 px-3 py-2 rounded-xl text-[11px] font-semibold transition shadow-xs"
                  >
                    Preset: {preset.extracted.name}
                  </button>
                ))}
              </div>

              {attachedFileName && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-center justify-between text-xs mt-2 text-emerald-900">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold">{attachedFileName}</span>
                    <span className="text-slate-500 text-[10px]">({attachedFileSize})</span>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                    CV Text Parsed
                  </span>
                </div>
              )}
            </div>

            {/* Detailed Form Fields */}
            <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 space-y-3">
              <span className="text-xs font-bold text-slate-900 block flex items-center gap-1.5 border-b border-slate-200 pb-2">
                <User className="w-4 h-4 text-indigo-600" /> Candidate Extracted Profile Details
                {isExtracting && <span className="text-[10px] text-indigo-600 animate-pulse ml-auto">Extracting data...</span>}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Surname *</label>
                  <input
                    type="text"
                    required
                    value={candidateSurname}
                    onChange={(e) => setCandidateSurname(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Highest Qualification / NQF</label>
                  <input
                    type="text"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Years Experience</label>
                  <input
                    type="number"
                    value={yearsExperience ?? ''}
                    onChange={(e) => setYearsExperience(e.target.value === '' ? undefined : Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Notice Period</label>
                  <input
                    type="text"
                    value={noticePeriod}
                    onChange={(e) => setNoticePeriod(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Expected Salary (ZAR)</label>
                  <input
                    type="text"
                    value={expectedSalary}
                    onChange={(e) => setExpectedSalary(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Key Technical Skills (Comma Separated)</label>
                <input
                  type="text"
                  value={skillsString}
                  onChange={(e) => setSkillsString(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Raw CV Text (Editable)</label>
              <textarea
                rows={3}
                value={rawCvText}
                onChange={(e) => setRawCvText(e.target.value)}
                className="w-full bg-slate-50/80 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 font-mono text-[11px] shadow-xs"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-4 py-2 rounded-xl font-semibold shadow-xs transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-semibold px-6 py-2 rounded-xl shadow-xs flex items-center space-x-1.5 transition active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>Run AI Screening Engine</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

