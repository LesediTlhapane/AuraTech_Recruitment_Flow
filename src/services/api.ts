import { JobProfile, ApplicationRecord, ExtractedCandidateData, ScoreCategoryBreakdown, RiskConcern, ExecutiveSummary, N8nNodeOutput } from '../types';

export interface ScreenCandidateResponse {
  extractedData: ExtractedCandidateData;
  scores: ScoreCategoryBreakdown;
  category: 'Excellent Match' | 'Strong Match' | 'Suitable' | 'Potential' | 'Not Suitable';
  risks: RiskConcern[];
  summary: ExecutiveSummary;
  n8nPayload?: {
    step3_extraction: N8nNodeOutput<ExtractedCandidateData>;
    step4_scoring: N8nNodeOutput<ScoreCategoryBreakdown>;
    step5_riskanalysis: N8nNodeOutput<RiskConcern[]>;
    step6_summary: N8nNodeOutput<ExecutiveSummary>;
  };
}

export interface ExtractedCvFormDetails {
  name?: string;
  surname?: string;
  email?: string;
  phone?: string;
  location?: string;
  qualification?: string;
  yearsExperience?: number;
  skills?: string[];
  skillsString?: string;
  noticePeriod?: string;
  expectedSalary?: string;
  currentRole?: string;
  currentCompany?: string;
  rawTextSummary?: string;
}

export async function extractCvWithAi(params: {
  rawCvText?: string;
  fileBase64?: string;
  mimeType?: string;
  fileName?: string;
}): Promise<ExtractedCvFormDetails> {
  const res = await fetch('/api/gemini/extract-cv', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const errorMessage = err.details || err.error || `HTTP ${res.status}: Failed to extract details from CV`;
    throw new Error(errorMessage);
  }

  const data = await res.json();
  if (data.success && data.data) {
    return data.data;
  }
  throw new Error('Invalid response structure received from CV extractor');
}

export async function screenCandidateWithAi(
  rawCvText: string,
  coverLetterText: string | undefined,
  jobProfile: JobProfile,
  candidateProfile?: {
    candidateId?: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    location?: string;
    qualification?: string;
    yearsExperience?: number;
    skills?: string[] | string;
    noticePeriod?: string;
    expectedSalary?: string;
  }
): Promise<ScreenCandidateResponse> {
  const res = await fetch('/api/gemini/screen-candidate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rawCvText, coverLetterText, jobProfile, candidateProfile }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const errorMessage = err.details || err.error || `HTTP ${res.status}: Failed to screen candidate with AI`;
    console.error('[AI Screening Error]:', errorMessage);
    throw new Error(errorMessage);
  }

  const data = await res.json();
  if (data.success && data.result) {
    return data.result;
  }
  throw new Error('Invalid response structure received from AI screening engine');
}

export async function generateEmailWithAi(
  candidateName: string,
  jobTitle: string,
  companyName: string,
  emailType: string,
  customNotes?: string
): Promise<{ subject: string; body: string }> {
  try {
    const res = await fetch('/api/gemini/generate-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ candidateName, jobTitle, companyName, emailType, customNotes }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.email) return data.email;
    }
  } catch (e) {
    console.warn('AI Email Generation fallback triggered:', e);
  }

  // Fallback template generator
  return {
    subject: `${emailType}: ${jobTitle} at ${companyName}`,
    body: `Dear ${candidateName},\n\nThank you for your application for the position of ${jobTitle} at ${companyName}.\n\n${customNotes || 'We are pleased to inform you that our talent acquisition team is reviewing your profile.'}\n\nBest regards,\nRecruitment Team\n${companyName}`,
  };
}

export async function analyzeJobWithAi(rawJobText: string): Promise<Partial<JobProfile>> {
  try {
    const res = await fetch('/api/gemini/analyze-job', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rawJobText }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.jobProfile) {
        const p = data.jobProfile;
        // Normalize any annual salaries that might have been returned
        if (p.salaryMinZar && p.salaryMinZar > 150000) {
          p.salaryMinZar = Math.round(p.salaryMinZar / 12);
        }
        if (p.salaryMaxZar && p.salaryMaxZar > 150000) {
          p.salaryMaxZar = Math.round(p.salaryMaxZar / 12);
        }
        return p;
      }
    }
  } catch (e) {
    console.warn('AI Job analysis fallback triggered, running smart heuristic extractor:', e);
  }

  // Smart heuristic extractor for quick natural language prompts
  const text = rawJobText.trim();
  const textLower = text.toLowerCase();

  // 1. Detect Employment Type
  let employmentType: JobProfile['employmentType'] = 'Full Time';
  if (textLower.includes('part time') || textLower.includes('part-time')) {
    employmentType = 'Part Time';
  } else if (textLower.includes('contract') || textLower.includes('freelance')) {
    employmentType = 'Contract';
  }

  // 2. Detect Location Type
  let locationType: 'On-Site' | 'Remote' | 'Hybrid' = 'Hybrid';
  if (textLower.includes('remote') || textLower.includes('work from home') || textLower.includes('wfh')) {
    locationType = 'Remote';
  } else if (textLower.includes('on-site') || textLower.includes('onsite') || textLower.includes('in-office') || textLower.includes('office')) {
    locationType = 'On-Site';
  } else if (textLower.includes('hybrid')) {
    locationType = 'Hybrid';
  }

  // 3. Detect Locations
  let location = 'Pretoria';
  if (textLower.includes('pretoria') || textLower.includes('tshwane')) location = 'Pretoria';
  else if (textLower.includes('sandton')) location = 'Sandton, Johannesburg';
  else if (textLower.includes('johannesburg') || textLower.includes('joburg') || textLower.includes('gauteng')) location = 'Johannesburg, Gauteng';
  else if (textLower.includes('cape town') || textLower.includes('western cape')) location = 'Cape Town, Western Cape';
  else if (textLower.includes('stellenbosch')) location = 'Stellenbosch, Western Cape';
  else if (textLower.includes('durban') || textLower.includes('kwazulu')) location = 'Durban, KwaZulu-Natal';
  else if (textLower.includes('midrand')) location = 'Midrand, Gauteng';
  else if (textLower.includes('centurion')) location = 'Centurion, Gauteng';

  // 4. Detect Experience
  let minimumExperienceYears = 2;
  const expMatch = text.match(/(\d+)\+?\s*(?:years?|yrs?|yr)/i);
  if (expMatch && expMatch[1]) {
    minimumExperienceYears = parseInt(expMatch[1], 10);
  }

  // 5. Detect Monthly Salary
  let salaryMinZar = 20000;
  let salaryMaxZar = 28000;
  
  // Look for R xx xxx or xx 000
  const salaryMatches = text.match(/R?\s*(\d{1,3}(?:[\s,]\d{3})*|\d+)(?:k)?\s*(?:-|to)?\s*(?:R?\s*(\d{1,3}(?:[\s,]\d{3})*|\d+)(?:k)?)?\s*(?:per\s*month|p\.?m\.?|monthly|per\s*annum|p\.?a\.?|annual)?/i);
  
  // Specific R value regex
  const rValues = Array.from(text.matchAll(/R\s*([0-9][0-9\s,]*)/gi)).map(m => parseInt(m[1].replace(/[\s,]/g, ''), 10)).filter(n => !isNaN(n) && n > 500);
  
  if (rValues.length >= 2) {
    let min = Math.min(rValues[0], rValues[1]);
    let max = Math.max(rValues[0], rValues[1]);
    if (min > 150000) min = Math.round(min / 12);
    if (max > 150000) max = Math.round(max / 12);
    salaryMinZar = min;
    salaryMaxZar = max;
  } else if (rValues.length === 1) {
    let val = rValues[0];
    if (val > 150000) val = Math.round(val / 12);
    salaryMinZar = val;
    salaryMaxZar = Math.round(val * 1.25);
  } else if (textLower.includes('20 000') || textLower.includes('20000') || textLower.includes('20k')) {
    salaryMinZar = 20000;
    salaryMaxZar = 25000;
  }

  // 6. Detect Job Title & Department
  let jobTitle = 'Software Developer';
  let department = 'Engineering';

  if (textLower.includes('junior react developer') || textLower.includes('react developer')) {
    jobTitle = textLower.includes('junior') ? 'Junior React Developer' : 'React Developer';
    department = 'Frontend Engineering';
  } else if (textLower.includes('full stack') || textLower.includes('fullstack')) {
    jobTitle = 'Full Stack Developer';
    department = 'Software Engineering';
  } else if (textLower.includes('frontend') || textLower.includes('front-end')) {
    jobTitle = 'Frontend Engineer';
    department = 'Software Engineering';
  } else if (textLower.includes('backend') || textLower.includes('back-end')) {
    jobTitle = 'Backend Engineer';
    department = 'Software Engineering';
  } else if (textLower.includes('recruitment') || textLower.includes('hr') || textLower.includes('talent')) {
    jobTitle = 'Talent Acquisition Specialist';
    department = 'Human Resources';
  } else if (textLower.includes('learning designer') || textLower.includes('instructional')) {
    jobTitle = 'Instructional Designer';
    department = 'Learning & Development';
  } else {
    // Take first clause before commas
    const firstPart = text.split(/,|\bin\b|\bwith\b|\bat\b/i)[0].trim();
    if (firstPart.length > 3 && firstPart.length < 50) {
      jobTitle = firstPart.charAt(0).toUpperCase() + firstPart.slice(1);
    }
  }

  // 7. Detect Skills
  const skills: string[] = [];
  if (textLower.includes('react')) skills.push('React');
  if (textLower.includes('typescript')) skills.push('TypeScript');
  if (textLower.includes('javascript') || textLower.includes('js')) skills.push('JavaScript');
  if (textLower.includes('node')) skills.push('Node.js');
  if (textLower.includes('python')) skills.push('Python');
  if (textLower.includes('java')) skills.push('Java');
  if (textLower.includes('sql') || textLower.includes('postgres')) skills.push('SQL / PostgreSQL');
  if (textLower.includes('tailwind') || textLower.includes('css')) skills.push('Tailwind CSS');
  if (textLower.includes('git')) skills.push('Git / GitHub');
  if (skills.length === 0) {
    skills.push('Frontend Development', 'Web Applications', 'Problem Solving', 'Agile');
  }

  // 8. Closing Date: Default 30 days from today
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 30);
  const closingDate = futureDate.toISOString().split('T')[0];

  return {
    jobTitle,
    department,
    company: 'eStudy South Africa',
    location,
    locationType,
    employmentType,
    salaryMinZar,
    salaryMaxZar,
    requiredSkills: skills,
    preferredSkills: ['REST APIs', 'Modern UI/UX', 'CI/CD Pipelines'],
    minimumExperienceYears,
    qualifications: ['BSc / BTech Degree in Computer Science or National Diploma (NQF 6/7)'],
    jobDescription: `${jobTitle} position based in ${location} (${locationType}). Minimum ${minimumExperienceYears} years experience required. Seeking proficiency in ${skills.join(', ')}.`,
    closingDate,
    status: 'Open',
  };
}

export interface N8nWebhookResponse {
  success: boolean;
  status?: number;
  statusText?: string;
  durationMs?: number;
  response?: any;
  error?: string;
  details?: string;
}

export async function triggerN8nWebhook(
  webhookUrl: string,
  payload: any,
  customHeaders?: Record<string, string>
): Promise<N8nWebhookResponse> {
  try {
    const res = await fetch('/api/n8n/trigger-webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ webhookUrl, payload, customHeaders }),
    });

    const data = await res.json();
    return data;
  } catch (err: any) {
    return {
      success: false,
      error: 'Network or server error reaching proxy',
      details: err.message || String(err),
    };
  }
}

export async function generateJobDescriptionWithAi(params: {
  jobTitle: string;
  department?: string;
  company?: string;
  industry?: string;
  requiredSkills?: string[];
  preferredSkills?: string[];
  minimumExperienceYears?: number;
  minimumQualification?: string;
  workArrangement?: string;
  employmentType?: string;
  location?: string;
  salaryMinMonthly?: number;
  salaryMaxMonthly?: number;
}): Promise<{
  aboutRole?: string;
  responsibilities?: string[];
  essentialRequirements?: string[];
  preferredRequirements?: string[];
  experienceDescription?: string;
  jobDescription?: string;
}> {
  const res = await fetch('/api/ai/generate-job-description', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.details || err.error || 'Failed to generate job description with AI');
  }

  const data = await res.json();
  return data.data || {};
}

export async function getJobSuggestionsWithAi(params: {
  jobTitle: string;
  department?: string;
}): Promise<{
  suggestedSkills?: string[];
  preferredSkills?: string[];
  suggestedQualifications?: string[];
  suggestedCertifications?: string[];
  suggestedExperienceYears?: number;
  suggestedResponsibilities?: string[];
  suggestedBenefits?: string[];
}> {
  const res = await fetch('/api/ai/job-suggestions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.details || err.error || 'Failed to fetch job suggestions with AI');
  }

  const data = await res.json();
  return data.data || {};
}

