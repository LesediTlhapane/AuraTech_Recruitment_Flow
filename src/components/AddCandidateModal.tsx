import React, { useState } from 'react';
import { JobProfile, ApplicationRecord, ApplicationSource } from '../types';
import { screenCandidateWithAi, extractCvWithAi, triggerN8nWebhook } from '../services/api';
import { Sparkles, FileText, Upload, BrainCircuit, CheckCircle2, Paperclip, User, Mail, Phone, MapPin, GraduationCap, Briefcase, DollarSign, Clock, AlertCircle, AlertTriangle, Wand2, RefreshCw } from 'lucide-react';

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
  const [isDragging, setIsDragging] = useState(false);
  const [autoFillSuccessMessage, setAutoFillSuccessMessage] = useState<string | null>(null);

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

  // Client-side heuristic fallback extractor
  const fallbackExtractFromText = (text: string, fileName?: string) => {
    if (!text || text.trim().length === 0) return;

    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const firstLine = lines[0] || '';
    const cleanFirstLine = firstLine.replace(/^(cv|curriculum vitae|resume)\s*[:\-]?\s*/i, '');
    const nameParts = cleanFirstLine.split(/\s+/);

    if (nameParts.length >= 2) {
      if (!candidateName) setCandidateName(nameParts[0]);
      if (!candidateSurname) setCandidateSurname(nameParts.slice(1).join(' '));
    } else if (nameParts.length === 1 && nameParts[0] && !candidateName) {
      setCandidateName(nameParts[0]);
    }

    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) setEmail(emailMatch[0]);

    const phoneMatch = text.match(/(?:\+27|0)\s?\d{2}\s?\d{3}\s?\d{4}/);
    if (phoneMatch) setPhone(phoneMatch[0]);

    // Location heuristics
    const locationMatch = text.match(/(?:Location|Address|City|Residing in|Based in)[:\s]*([^\n,]+(?:,\s*[^\n]+)?)/i) ||
      text.match(/(Johannesburg|Pretoria|Sandton|Cape Town|Durban|Centurion|Midrand|Gauteng|Western Cape|KwaZulu-Natal)/i);
    if (locationMatch && !location) {
      setLocation(locationMatch[1] || locationMatch[0]);
    }

    // Qualification heuristics
    const qualMatch = text.match(/(?:Education|Qualification|Degree|Diploma)[:\s]*([^\n]+)/i) ||
      text.match(/(BSc|BCom|BTech|BA|National Diploma|Diploma|Matric|Master|PhD|BEng)[^\n,]*/i);
    if (qualMatch && !qualification) {
      setQualification(qualMatch[1] || qualMatch[0]);
    }

    // Experience years heuristics
    const expMatch = text.match(/(\d+)\+?\s*(?:years?|yrs?)(?:\s+of)?\s+(?:experience|exp)/i) ||
      text.match(/(?:Experience|Total Experience)[:\s]*(\d+)\+?\s*(?:years?|yrs?)/i);
    if (expMatch && (yearsExperience === undefined || isNaN(Number(yearsExperience)))) {
      const parsedNum = parseInt(expMatch[1], 10);
      if (!isNaN(parsedNum)) setYearsExperience(parsedNum);
    }

    // Notice period heuristics
    const noticeMatch = text.match(/(?:Notice|Notice Period)[:\s]*([^\n,]+)/i) ||
      text.match(/(\d+\s*days|immediate|calendar month|30\s*days|60\s*days)/i);
    if (noticeMatch && !noticePeriod) {
      setNoticePeriod(noticeMatch[1] || noticeMatch[0]);
    }

    // Salary heuristics
    const salaryMatch = text.match(/(?:Salary|Expected Salary|CTC|Remuneration)[:\s]*([^\n,]+)/i) ||
      text.match(/(?:R|ZAR)\s?[\d\s,]+(?:pm|per month|per annum|\/ annum)?/i);
    if (salaryMatch && !expectedSalary) {
      setExpectedSalary(salaryMatch[1] || salaryMatch[0]);
    }

    // Skills heuristics
    const skillsMatch = text.match(/(?:Skills|Technical Skills|Competencies|Tech Stack)[:\s]*([^\n]+(?:\n[^\n]+)?)/i);
    if (skillsMatch && !skillsString) {
      setSkillsString(skillsMatch[1].replace(/[\n\r]+/g, ', ').trim());
    }
  };

  // Main CV File & Text Processor
  const processCvFile = async (file: File) => {
    setAttachedFileName(file.name);
    setAttachedFileSize(`${(file.size / 1024).toFixed(1)} KB`);
    setIsExtracting(true);
    setAutoFillSuccessMessage(null);
    setErrorMessage(null);

    let base64Data: string | undefined;
    let textContent = '';

    // 1. Read Base64 Data URL (for PDF, Word, Images, etc.)
    try {
      base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    } catch (e) {
      console.warn('Failed to read file as data URL:', e);
    }

    // 2. Also attempt plain text read if text-like
    if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.rtf') || file.name.endsWith('.md')) {
      try {
        textContent = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = reject;
          reader.readAsText(file);
        });
        if (textContent) {
          setRawCvText(textContent);
        }
      } catch (e) {
        console.warn('Failed to read file as text:', e);
      }
    }

    // 3. Call AI Auto-Extraction Endpoint
    try {
      const lowerFileName = file.name.toLowerCase();
      let mimeType = file.type;
      if (!mimeType) {
        if (lowerFileName.endsWith('.pdf')) mimeType = 'application/pdf';
        else if (lowerFileName.endsWith('.docx')) mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        else if (lowerFileName.endsWith('.doc')) mimeType = 'application/msword';
        else if (lowerFileName.endsWith('.txt')) mimeType = 'text/plain';
        else if (lowerFileName.endsWith('.rtf')) mimeType = 'application/rtf';
        else if (lowerFileName.endsWith('.png')) mimeType = 'image/png';
        else if (lowerFileName.endsWith('.jpg') || lowerFileName.endsWith('.jpeg')) mimeType = 'image/jpeg';
      }

      const extracted = await extractCvWithAi({
        rawCvText: textContent || undefined,
        fileBase64: base64Data,
        mimeType,
        fileName: file.name,
      });

      let autoFilledCount = 0;

      if (extracted.name) {
        setCandidateName(extracted.name);
        autoFilledCount++;
      }
      if (extracted.surname) {
        setCandidateSurname(extracted.surname);
        autoFilledCount++;
      }
      if (extracted.email) {
        setEmail(extracted.email);
        autoFilledCount++;
      }
      if (extracted.phone) {
        setPhone(extracted.phone);
        autoFilledCount++;
      }
      if (extracted.location) {
        setLocation(extracted.location);
        autoFilledCount++;
      }
      if (extracted.qualification) {
        setQualification(typeof extracted.qualification === 'string' ? extracted.qualification : String(extracted.qualification));
        autoFilledCount++;
      }
      
      const parsedExp = extracted.yearsExperience !== undefined && extracted.yearsExperience !== null
        ? (typeof extracted.yearsExperience === 'number' ? extracted.yearsExperience : parseFloat(String(extracted.yearsExperience).replace(/[^\d.]/g, '')))
        : undefined;

      if (parsedExp !== undefined && !isNaN(parsedExp)) {
        setYearsExperience(parsedExp);
        autoFilledCount++;
      }

      const skillsFormatted = extracted.skillsString || (Array.isArray(extracted.skills) ? extracted.skills.join(', ') : (extracted.skills ? String(extracted.skills) : ''));
      if (skillsFormatted) {
        setSkillsString(skillsFormatted);
        autoFilledCount++;
      }

      if (extracted.noticePeriod) {
        setNoticePeriod(extracted.noticePeriod);
        autoFilledCount++;
      }
      if (extracted.expectedSalary) {
        setExpectedSalary(extracted.expectedSalary);
        autoFilledCount++;
      }
      if (extracted.rawTextSummary) {
        setRawCvText(extracted.rawTextSummary);
      } else if (textContent) {
        setRawCvText(textContent);
      }

      setAutoFillSuccessMessage(`Extracted & auto-filled ${autoFilledCount} profile fields from "${file.name}"`);
    } catch (aiError: any) {
      console.warn('AI Extraction server error, applying smart local heuristic extraction:', aiError);
      if (textContent) {
        fallbackExtractFromText(textContent, file.name);
        setAutoFillSuccessMessage(`Auto-filled candidate fields from file text (Local Parser)`);
      } else {
        // Simple name from file name e.g. "John_Doe_CV.pdf"
        const cleanBase = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
        const parts = cleanBase.split(' ').filter(p => !['cv', 'resume', 'curriculum', 'vitae', 'draft'].includes(p.toLowerCase()));
        if (parts.length >= 2) {
          if (!candidateName) setCandidateName(parts[0]);
          if (!candidateSurname) setCandidateSurname(parts.slice(1).join(' '));
        }
        setAutoFillSuccessMessage(`Attached "${file.name}". Please confirm candidate details below.`);
      }
    } finally {
      setIsExtracting(false);
    }
  };

  // Handle File Input Change
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processCvFile(file);
  };

  // Handle Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processCvFile(file);
    }
  };

  // Manual trigger to extract fields from whatever text is in rawCvText
  const handleManualExtractFromText = async () => {
    if (!rawCvText.trim()) {
      setErrorMessage('Please paste or type CV text into the Raw CV Text box first.');
      return;
    }

    setIsExtracting(true);
    setAutoFillSuccessMessage(null);
    setErrorMessage(null);

    try {
      const extracted = await extractCvWithAi({
        rawCvText: rawCvText.trim(),
        fileName: attachedFileName || 'Candidate CV',
      });

      let autoFilledCount = 0;
      if (extracted.name) { setCandidateName(extracted.name); autoFilledCount++; }
      if (extracted.surname) { setCandidateSurname(extracted.surname); autoFilledCount++; }
      if (extracted.email) { setEmail(extracted.email); autoFilledCount++; }
      if (extracted.phone) { setPhone(extracted.phone); autoFilledCount++; }
      if (extracted.location) { setLocation(extracted.location); autoFilledCount++; }
      if (extracted.qualification) { setQualification(typeof extracted.qualification === 'string' ? extracted.qualification : String(extracted.qualification)); autoFilledCount++; }
      
      const parsedExp = extracted.yearsExperience !== undefined && extracted.yearsExperience !== null
        ? (typeof extracted.yearsExperience === 'number' ? extracted.yearsExperience : parseFloat(String(extracted.yearsExperience).replace(/[^\d.]/g, '')))
        : undefined;
      if (parsedExp !== undefined && !isNaN(parsedExp)) {
        setYearsExperience(parsedExp);
        autoFilledCount++;
      }

      const skillsFormatted = extracted.skillsString || (Array.isArray(extracted.skills) ? extracted.skills.join(', ') : (extracted.skills ? String(extracted.skills) : ''));
      if (skillsFormatted) {
        setSkillsString(skillsFormatted);
        autoFilledCount++;
      }

      if (extracted.noticePeriod) { setNoticePeriod(extracted.noticePeriod); autoFilledCount++; }
      if (extracted.expectedSalary) { setExpectedSalary(extracted.expectedSalary); autoFilledCount++; }

      setAutoFillSuccessMessage(`Extracted & auto-filled ${autoFilledCount} fields from text`);
    } catch (err: any) {
      fallbackExtractFromText(rawCvText);
      setAutoFillSuccessMessage('Auto-filled fields using pattern parser');
    } finally {
      setIsExtracting(false);
    }
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
        name: trimmedFirstName || aiResult.extractedData?.name || 'Candidate',
        surname: trimmedLastName || aiResult.extractedData?.surname || '',
        email: email.trim() || aiResult.extractedData?.email || '',
        phone: phone.trim() || aiResult.extractedData?.phone || '',
        location: location.trim() || aiResult.extractedData?.location || '',
        totalYearsExperience: parsedExp !== undefined ? parsedExp : (aiResult.extractedData?.totalYearsExperience || 0),
        qualifications: qualification.trim() ? [qualification.trim(), ...(aiResult.extractedData?.qualifications || []).filter(q => q !== qualification.trim())] : aiResult.extractedData?.qualifications || [],
        technicalSkills: parsedSkills.length > 0 ? parsedSkills : aiResult.extractedData?.technicalSkills || [],
        noticePeriodDays: noticePeriod.trim() ? (parseInt(noticePeriod.replace(/\D/g, ''), 10) || 30) : (aiResult.extractedData?.noticePeriodDays || 30),
      };

      const newApplication: ApplicationRecord = {
        id: candidateId,
        candidateId,
        jobId: targetJob.id,
        jobTitle: targetJob.jobTitle,
        appliedDate: new Date().toISOString(),
        source: source,
        scores: aiResult.scores,
        category: aiResult.category,
        extractedData: finalExtractedData,
        risks: aiResult.risks,
        summary: aiResult.summary,
        status: 'Screened',
        isPaused: false,
        popiaConsent: {
          consented: true,
          timestamp: new Date().toISOString(),
        },
        rawCvText: rawCvText.trim() || cvContentToProcess,
        attachedCvFile: attachedFileName ? {
          fileName: attachedFileName,
          fileSize: attachedFileSize || 'Unknown',
          uploadedAt: new Date().toISOString()
        } : undefined,
        n8nPayload: aiResult.n8nPayload,
      };

      // Trigger n8n webhook asynchronously if configured
      const savedWebhookUrl = localStorage.getItem('talentflow_n8n_url') || 'https://n8n.workflow.internal/webhook/screen-candidate';
      triggerN8nWebhook(savedWebhookUrl, newApplication).catch((err) => {
        console.warn('n8n background webhook call notification:', err);
      });

      onAddCandidate(newApplication);
      onClose();
    } catch (err: any) {
      console.error('Candidate screening error:', err);
      setErrorMessage(err.message || 'Failed to screen candidate. Please try again.');
    } finally {
      setIsProcessing(false);
      setProcessingStep(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full p-6 space-y-5 my-8 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Upload className="w-5 h-5 text-indigo-600" /> Ingest & Screen Application
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Attach a candidate's CV (PDF, DOCX, TXT) or paste text to auto-fill details and screen with AI.</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-700 text-xl font-bold transition p-1.5 rounded-lg hover:bg-slate-100"
          >
            &times;
          </button>
        </div>

        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-rose-800 animate-in fade-in">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold block">Notice</span>
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

            {/* CV Attachment Dropzone with Drag & Drop */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-4 transition text-center space-y-2 ${
                isDragging
                  ? 'border-indigo-600 bg-indigo-100/60 scale-[1.01]'
                  : 'border-indigo-200/80 hover:border-indigo-400 bg-indigo-50/30'
              }`}
            >
              <div className="flex justify-center items-center gap-2 text-indigo-700 font-semibold text-xs">
                <Paperclip className="w-4 h-4" />
                <span>Attach CV File (PDF, DOCX, TXT, RTF)</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Drag & drop or upload a CV. AI will instantly parse the document and auto-fill the form fields below.
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                <label className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer shadow-xs inline-flex items-center gap-2 active:scale-95">
                  <Upload className="w-4 h-4" />
                  <span>{isExtracting ? 'Extracting CV...' : 'Browse & Upload CV File...'}</span>
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc,.txt,.rtf,image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {isExtracting && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 flex items-center justify-center space-x-2 text-xs text-indigo-800 animate-pulse mt-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
                  <span className="font-semibold">AI is analyzing CV and auto-filling candidate fields...</span>
                </div>
              )}

              {autoFillSuccessMessage && !isExtracting && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-center justify-between text-xs mt-2 text-emerald-900">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold">{autoFillSuccessMessage}</span>
                  </div>
                  {attachedFileName && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                      {attachedFileSize}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Detailed Form Fields */}
            <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-indigo-600" /> Candidate Profile Details (Auto-filled)
                </span>
                {isExtracting ? (
                  <span className="text-[10px] text-indigo-600 animate-pulse font-semibold flex items-center gap-1">
                    <RefreshCw className="w-3 h-3 animate-spin" /> Auto-filling from CV...
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500">Edit or refine any fields if needed</span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 flex items-center justify-between">
                    <span>First Name *</span>
                    {candidateName && <span className="text-[10px] text-emerald-600 font-medium">✓ filled</span>}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sipho or Liezel"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium transition shadow-2xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 flex items-center justify-between">
                    <span>Surname *</span>
                    {candidateSurname && <span className="text-[10px] text-emerald-600 font-medium">✓ filled</span>}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ndlovu or van der Merwe"
                    value={candidateSurname}
                    onChange={(e) => setCandidateSurname(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium transition shadow-2xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 flex items-center justify-between">
                    <span>Email Address *</span>
                    {email && <span className="text-[10px] text-emerald-600 font-medium">✓ filled</span>}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. candidate@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium transition shadow-2xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 flex items-center justify-between">
                    <span>Phone Number</span>
                    {phone && <span className="text-[10px] text-emerald-600 font-medium">✓ filled</span>}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +27 82 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium transition shadow-2xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 flex items-center justify-between">
                    <span>Location / City</span>
                    {location && <span className="text-[10px] text-emerald-600 font-medium">✓ filled</span>}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sandton, Johannesburg"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium transition shadow-2xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 flex items-center justify-between">
                    <span>Highest Qualification & NQF</span>
                    {qualification && <span className="text-[10px] text-emerald-600 font-medium">✓ filled</span>}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BSc Computer Science (Wits, NQF 7)"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium transition shadow-2xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 flex items-center justify-between">
                    <span>Years Experience</span>
                    {yearsExperience !== undefined && <span className="text-[10px] text-emerald-600 font-medium">✓ {yearsExperience} yrs</span>}
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 5"
                    value={yearsExperience ?? ''}
                    onChange={(e) => setYearsExperience(e.target.value === '' ? undefined : Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium transition shadow-2xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 flex items-center justify-between">
                    <span>Notice Period</span>
                    {noticePeriod && <span className="text-[10px] text-emerald-600 font-medium">✓ filled</span>}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 30 Days or Immediate"
                    value={noticePeriod}
                    onChange={(e) => setNoticePeriod(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium transition shadow-2xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 flex items-center justify-between">
                    <span>Expected Salary (ZAR)</span>
                    {expectedSalary && <span className="text-[10px] text-emerald-600 font-medium">✓ filled</span>}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. R950,000 / annum or R45,000 pm"
                    value={expectedSalary}
                    onChange={(e) => setExpectedSalary(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium transition shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1 flex items-center justify-between">
                  <span>Key Technical Skills & Competencies (Comma Separated)</span>
                  {skillsString && <span className="text-[10px] text-emerald-600 font-medium">✓ filled</span>}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Java, Spring Boot, React, TypeScript, Azure, PostgreSQL, Docker"
                  value={skillsString}
                  onChange={(e) => setSkillsString(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium transition shadow-2xs"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-slate-700 font-semibold">Raw CV / Resume Text</label>
                <button
                  type="button"
                  onClick={handleManualExtractFromText}
                  disabled={isExtracting || !rawCvText.trim()}
                  className="inline-flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold disabled:opacity-40 transition"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Re-extract Form Fields from Text</span>
                </button>
              </div>
              <textarea
                rows={3}
                placeholder="Paste CV text here or let the attachment auto-populate this box..."
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
                disabled={isExtracting}
                className="bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-semibold px-6 py-2 rounded-xl shadow-xs flex items-center space-x-1.5 transition active:scale-95 disabled:opacity-50"
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
