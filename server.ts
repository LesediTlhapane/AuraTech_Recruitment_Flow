import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import mammoth from 'mammoth';
import * as pdfParseNamespace from 'pdf-parse';
const pdfParse: any = (pdfParseNamespace as any).default || (pdfParseNamespace as any).pdfParse || pdfParseNamespace;

const app = express();
app.use(express.json({ limit: '25mb' }));

const PORT = 3000;

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not configured.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================================================
// 1. AI CANDIDATE / CV EXTRACTION ENDPOINT
// ============================================================================
async function handleExtractCv(req: express.Request, res: express.Response) {
  try {
    const { rawCvText, fileBase64, mimeType, fileName } = req.body;

    if (!rawCvText && !fileBase64) {
      return res.status(400).json({ error: 'Missing CV text or file content to extract.' });
    }

    let parsedDocumentText = rawCvText || '';
    let fileBuffer: Buffer | null = null;

    if (fileBase64) {
      try {
        const cleanBase64 = fileBase64.includes('base64,') ? fileBase64.split('base64,')[1] : fileBase64;
        fileBuffer = Buffer.from(cleanBase64, 'base64');

        const lowerFileName = (fileName || '').toLowerCase();
        const effectiveMime = (mimeType || '').toLowerCase();

        // 1. DOCX Parsing with mammoth
        if (
          lowerFileName.endsWith('.docx') ||
          lowerFileName.endsWith('.doc') ||
          effectiveMime.includes('word') ||
          effectiveMime.includes('officedocument')
        ) {
          try {
            const docxResult = await mammoth.extractRawText({ buffer: fileBuffer });
            if (docxResult && docxResult.value && docxResult.value.trim().length > 0) {
              parsedDocumentText = docxResult.value.trim();
              console.log(`[CV Extractor] Successfully extracted ${parsedDocumentText.length} chars from DOCX: ${fileName}`);
            }
          } catch (docxErr) {
            console.warn('[CV Extractor] Mammoth docx parse warning:', docxErr);
          }
        }

        // 2. PDF Parsing with pdf-parse
        if (
          lowerFileName.endsWith('.pdf') ||
          effectiveMime.includes('pdf')
        ) {
          try {
            const parserFn = typeof pdfParse === 'function' ? pdfParse : (pdfParse as any)?.default;
            if (typeof parserFn === 'function') {
              const pdfData = await parserFn(fileBuffer);
              if (pdfData && pdfData.text && pdfData.text.trim().length > 0) {
                parsedDocumentText = pdfData.text.trim();
                console.log(`[CV Extractor] Successfully extracted ${parsedDocumentText.length} chars from PDF: ${fileName}`);
              }
            }
          } catch (pdfErr) {
            console.log('[CV Extractor] Using native multimodal PDF processing for Gemini model.');
          }
        }

        // 3. Plain text or RTF or markdown
        if (
          !parsedDocumentText &&
          (lowerFileName.endsWith('.txt') ||
            lowerFileName.endsWith('.rtf') ||
            lowerFileName.endsWith('.md') ||
            effectiveMime.includes('text'))
        ) {
          parsedDocumentText = fileBuffer.toString('utf-8');
        }
      } catch (bufErr) {
        console.warn('[CV Extractor] Error processing file buffer:', bufErr);
      }
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are a Senior Talent Acquisition Specialist and AI Recruitment Data Extraction Engine.
Your task is to extract structured, accurate candidate details from the provided CV / Resume with 100% fidelity.

STRICT ZERO-HALLUCINATION EXTRACTION RULES:
1. Extract ONLY the information that is explicitly stated in the document or text.
2. If any field (such as email, phone, location, qualification, salary, or notice period) is NOT in the CV, set it to "" (empty string) or [] (empty array) or 0 (for numbers). NEVER invent fake names, universities, companies, dates, or contact info.
3. Calculate the total years of relevant professional experience accurately from the candidate's career timeline.
4. Separate technical skills, soft skills, tools, and platforms into clean arrays.
5. Extract all education records with degree, institution, field of study, graduation year, and NQF level if applicable.
6. Extract all employment history items with title, company, dates, key responsibilities, and achievements.
7. Return a strictly valid JSON object.`;

    const prompt = `Extract all candidate profile details from this CV document (${fileName || 'Candidate Resume'}).
Return a JSON object strictly matching this schema:
{
  "name": "First Name (e.g. John or Thabo)",
  "surname": "Last Name / Surname (e.g. Smith or Nkosi)",
  "fullName": "Full Name",
  "email": "candidate email or empty string if not found",
  "phone": "candidate phone or empty string if not found",
  "location": "City, Province / Country or empty string if not found",
  "province": "Province name if in South Africa, otherwise empty string",
  "city": "City name if specified, otherwise empty string",
  "currentRole": "Current or most recent job title",
  "currentJobTitle": "Current or most recent job title",
  "currentCompany": "Current or most recent employer company",
  "professionalSummary": "Brief summary of candidate background based strictly on CV",
  "qualification": "Highest qualification and institution (e.g. BSc Computer Science - University of Pretoria)",
  "qualifications": ["Qualification 1", "Qualification 2"],
  "yearsExperience": 5,
  "experienceCalculationAudit": "Explanation of how total experience years was calculated from employment timeline",
  "technicalSkills": ["Skill 1", "Skill 2", "Skill 3"],
  "softSkills": ["Soft skill 1", "Soft skill 2"],
  "tools": ["Tool 1", "Tool 2"],
  "technologies": ["Tech 1", "Tech 2"],
  "platforms": ["Platform 1"],
  "skills": ["Skill 1", "Skill 2", "Skill 3"],
  "skillsString": "Comma-separated string of top skills",
  "education": [
    {
      "degree": "Degree or Diploma name",
      "institution": "University / College name",
      "fieldOfStudy": "Field of study",
      "yearGraduated": 2020,
      "nqfLevelEquivalent": "NQF 7"
    }
  ],
  "certifications": ["Certification name"],
  "workExperience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "startDate": "2021",
      "endDate": "Present",
      "durationMonths": 36,
      "keyResponsibilities": ["Responsibility 1", "Responsibility 2"],
      "achievements": ["Achievement 1"],
      "technologies": ["Tech 1", "Tech 2"]
    }
  ],
  "noticePeriod": "Notice period (e.g. 30 Days, Immediate) or empty string",
  "noticePeriodDays": 30,
  "expectedSalary": "Expected or current salary or empty string",
  "expectedSalaryZar": 0,
  "rawTextSummary": "Full text or summary of CV"
}`;

    const contents: any[] = [];

    if (fileBase64 && mimeType) {
      const cleanBase64 = fileBase64.includes('base64,') ? fileBase64.split('base64,')[1] : fileBase64;
      const lowerFileName = (fileName || '').toLowerCase();

      if (mimeType.includes('pdf') || lowerFileName.endsWith('.pdf')) {
        contents.push({
          inlineData: {
            data: cleanBase64,
            mimeType: 'application/pdf',
          },
        });
      } else if (mimeType.startsWith('image/')) {
        contents.push({
          inlineData: {
            data: cleanBase64,
            mimeType,
          },
        });
      }
    }

    if (parsedDocumentText && parsedDocumentText.trim().length > 0) {
      contents.push({
        text: `CV DOCUMENT TEXT CONTENT:\n${parsedDocumentText.trim()}`,
      });
    }

    contents.push({
      text: prompt,
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '{}';
    let extractedData: any = {};
    try {
      extractedData = JSON.parse(responseText);
    } catch (parseErr) {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        extractedData = JSON.parse(jsonMatch[0]);
      }
    }

    if (!extractedData.rawTextSummary && parsedDocumentText) {
      extractedData.rawTextSummary = parsedDocumentText;
    }

    return res.json({
      success: true,
      data: extractedData,
    });
  } catch (error: any) {
    console.error('Error in handleExtractCv:', error);
    return res.status(500).json({
      error: 'Failed to extract CV details',
      details: error.message || String(error),
    });
  }
}

app.post('/api/ai/extract-candidate', handleExtractCv);
app.post('/api/gemini/extract-cv', handleExtractCv);

// ============================================================================
// 2. AI CANDIDATE SCREENING & REASONING ENGINE
// ============================================================================
async function handleScreenCandidate(req: express.Request, res: express.Response) {
  try {
    const { rawCvText, coverLetterText, jobProfile, candidateProfile } = req.body;

    if ((!rawCvText && !candidateProfile) || !jobProfile) {
      return res.status(400).json({ error: 'Missing candidate data or jobProfile' });
    }

    const ai = getGeminiClient();

    const candidateExpYears = candidateProfile?.yearsExperience ?? candidateProfile?.totalYearsExperience;
    const vacancyMinExpYears = jobProfile.minimumExperienceYears ?? 0;
    const expDiff = (typeof candidateExpYears === 'number' && typeof vacancyMinExpYears === 'number')
      ? candidateExpYears - vacancyMinExpYears
      : null;

    const candidateName = candidateProfile?.fullName || 
      `${candidateProfile?.firstName || ''} ${candidateProfile?.lastName || ''}`.trim() || 
      'Candidate';

    const systemInstruction = `You are a Senior Talent Acquisition Specialist and Principal HR Recruitment Architect.
You are evaluating a candidate application against an enterprise Job Profile.

ABSOLUTE SOURCE-OF-TRUTH RULES:
1. The supplied candidate profile and CV text are the sole sources of truth.
2. DO NOT invent, assume, or hallucinate qualifications, skills, companies, or experience not present in the record. If missing, record "Not provided" or empty arrays.
3. EXPERIENCE ADVANTAGE EVALUATION:
   - Job Vacancy Minimum Experience Required: ${vacancyMinExpYears} years.
   - Candidate Actual Experience: ${candidateExpYears !== undefined && candidateExpYears !== null ? `${candidateExpYears} years` : 'Determined from CV'}.
   ${expDiff !== null && expDiff > 0 ? `- EXPERIENCE ADVANTAGE: The candidate exceeds the minimum experience requirement by ${expDiff} years (${candidateExpYears} years vs required ${vacancyMinExpYears} years). Positively award high experienceMatch score and highlight "Experience Advantage: Candidate exceeds the minimum experience requirement by ${expDiff} years" in the summary.` : ''}
   ${expDiff !== null && expDiff < 0 ? `- EXPERIENCE DEFICIT: The candidate has ${Math.abs(expDiff)} years less than the required ${vacancyMinExpYears} years. Factor this into experienceMatch and add a note in risks.` : ''}
4. Objective Scoring: Score each of the 12 evaluation metrics from 0 to 100 based strictly on verified evidence.
5. Return a strict JSON response.`;

    const candidateDetailsText = candidateProfile ? `
AUTHORITATIVE CANDIDATE PROFILE (DATABASE RECORD):
- Full Name: ${candidateName}
- Email: ${candidateProfile.email || 'Not provided'}
- Phone: ${candidateProfile.phone || 'Not provided'}
- Location: ${candidateProfile.location || 'Not provided'}
- Qualification: ${candidateProfile.qualification || 'Not provided'}
- Total Years Experience: ${candidateExpYears !== undefined && candidateExpYears !== null ? `${candidateExpYears} Years` : 'Not provided'}
- Technical Skills: ${Array.isArray(candidateProfile.skills) ? candidateProfile.skills.join(', ') : candidateProfile.skills || 'Not provided'}
- Notice Period: ${candidateProfile.noticePeriod || 'Not provided'}
- Expected Salary: ${candidateProfile.expectedSalary || 'Not provided'}
` : '';

    const prompt = `JOB VACANCY PROFILE:
Title: ${jobProfile.jobTitle}
Company: ${jobProfile.company}
Department: ${jobProfile.department || 'General'}
Location: ${jobProfile.location} (${jobProfile.locationType || 'Hybrid'})
Salary Range: R${(jobProfile.salaryMinZar || 0).toLocaleString()} - R${(jobProfile.salaryMaxZar || 0).toLocaleString()} per month
Required Skills: ${Array.isArray(jobProfile.requiredSkills) ? jobProfile.requiredSkills.join(', ') : jobProfile.requiredSkills || 'None specified'}
Preferred Skills: ${Array.isArray(jobProfile.preferredSkills) ? jobProfile.preferredSkills.join(', ') : 'None'}
Minimum Experience Years Required: ${vacancyMinExpYears}
Qualifications Required: ${Array.isArray(jobProfile.qualifications) ? jobProfile.qualifications.join(', ') : jobProfile.qualifications || 'Relevant qualification'}
Job Description: ${jobProfile.jobDescription || jobProfile.aboutRole || 'Standard vacancy'}

${candidateDetailsText}

RAW CV / RESUME TEXT:
${rawCvText || 'No separate raw text provided. Refer to Authoritative Candidate Profile above.'}

${coverLetterText ? `COVER LETTER:\n${coverLetterText}` : ''}

Evaluate this candidate against the vacancy and return a JSON object with:
1. "extractedData": {
     "name": string,
     "surname": string,
     "email": string,
     "phone": string,
     "location": string,
     "nationality": string,
     "education": array of { "degree", "institution", "fieldOfStudy", "yearGraduated", "nqfLevelEquivalent" },
     "qualifications": array of strings,
     "certifications": array of strings,
     "workExperience": array of { "title", "company", "durationMonths", "startDate", "endDate", "keyResponsibilities", "achievements" },
     "technicalSkills": array of strings,
     "softSkills": array of strings,
     "languages": array of strings,
     "totalYearsExperience": number,
     "currentEmployer": string,
     "noticePeriodDays": number,
     "expectedSalaryZar": number,
     "availability": string,
     "linkedInUrl": string,
     "portfolioUrl": string,
     "referencesCount": number
   }
2. "scores": {
     "educationMatch": number (0-100),
     "skillsMatch": number (0-100),
     "experienceMatch": number (0-100),
     "industryMatch": number (0-100),
     "certificationMatch": number (0-100),
     "leadershipExperience": number (0-100),
     "communicationSkills": number (0-100),
     "careerStability": number (0-100),
     "employmentGapsScore": number (0-100),
     "locationSuitability": number (0-100),
     "salaryAlignment": number (0-100),
     "availabilityScore": number (0-100),
     "overallScore": number (0-100)
   }
3. "experienceAnalysis": {
     "requiredYears": number,
     "candidateYears": number,
     "experienceAdvantageYears": number,
     "hasAdvantage": boolean,
     "statement": string
   }
4. "category": "Excellent Match" | "Strong Match" | "Suitable" | "Potential" | "Not Suitable"
5. "risks": array of { "id": string, "category": string, "severity": "High"|"Medium"|"Low", "description": string, "mitigationSuggestion": string }
6. "summary": {
     "headline": string,
     "experienceOverview": string,
     "technicalAlignment": string,
     "leadershipAndSoftSkills": string,
     "salaryAndNoticeFit": string,
     "keyConcerns": array of strings,
     "overallRecommendation": "Strong Interview Candidate" | "Suitable Candidate" | "Potential Match - Further Info Needed" | "Overbudget Candidate" | "Not Recommended"
   }
7. "n8nPayload": structured object summarizing each step with timestamp and status for data export`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '{}';
    let parsedData: any = {};
    try {
      parsedData = JSON.parse(responseText);
    } catch {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
      }
    }

    return res.json({
      success: true,
      timestamp: new Date().toISOString(),
      result: parsedData,
    });
  } catch (error: any) {
    console.error('Error in handleScreenCandidate:', error);
    return res.status(500).json({
      error: 'Failed to process candidate screening',
      details: error.message || String(error),
    });
  }
}

app.post('/api/ai/screen-candidate', handleScreenCandidate);
app.post('/api/gemini/screen-candidate', handleScreenCandidate);

// ============================================================================
// 3. AI JOB DESCRIPTION & SPECIFICATION GENERATOR
// ============================================================================
async function handleGenerateJobDescription(req: express.Request, res: express.Response) {
  try {
    const {
      jobTitle,
      department,
      company,
      industry,
      requiredSkills,
      preferredSkills,
      minimumExperienceYears,
      minimumQualification,
      workArrangement,
      employmentType,
      location,
      salaryMinMonthly,
      salaryMaxMonthly,
    } = req.body;

    if (!jobTitle) {
      return res.status(400).json({ error: 'Job title is required.' });
    }

    const ai = getGeminiClient();

    const prompt = `You are a Principal Talent Acquisition Architect.
Generate a structured, high-quality, professional job description and vacancy specification for:
- Job Title: ${jobTitle}
- Department: ${department || 'General'}
- Company: ${company || 'Aura Tech Enterprise'}
- Industry: ${industry || 'Technology / Professional Services'}
- Location: ${location || 'South Africa'} (${workArrangement || 'Hybrid'})
- Employment Type: ${employmentType || 'Full Time'}
- Minimum Experience: ${minimumExperienceYears || 2} years
- Minimum Qualification: ${minimumQualification || "Bachelor's Degree or Equivalent"}
- Required Skills: ${Array.isArray(requiredSkills) ? requiredSkills.join(', ') : requiredSkills || 'Key domain skills'}
- Preferred Skills: ${Array.isArray(preferredSkills) ? preferredSkills.join(', ') : preferredSkills || 'Supplementary skills'}
- Salary Range: R${salaryMinMonthly || 25000} - R${salaryMaxMonthly || 40000} per month

Return JSON strictly matching this schema:
{
  "aboutRole": "A compelling 2-3 paragraph overview of the role, team purpose, and growth potential.",
  "responsibilities": [
    "Key responsibility 1",
    "Key responsibility 2",
    "Key responsibility 3",
    "Key responsibility 4",
    "Key responsibility 5",
    "Key responsibility 6"
  ],
  "essentialRequirements": [
    "Demonstrated experience in...",
    "Strong proficiency in..."
  ],
  "preferredRequirements": [
    "Familiarity with...",
    "Exposure to..."
  ],
  "experienceDescription": "Clear summary of experience expectation",
  "jobDescription": "Full formatted comprehensive job description text combining about role, responsibilities, and requirements."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error in handleGenerateJobDescription:', error);
    return res.status(500).json({ error: 'Failed to generate job description', details: error.message });
  }
}

app.post('/api/ai/generate-job-description', handleGenerateJobDescription);
app.post('/api/gemini/generate-job-description', handleGenerateJobDescription);

// ============================================================================
// 4. AI JOB SUGGESTIONS / INTELLIGENCE ENDPOINT
// ============================================================================
async function handleJobSuggestions(req: express.Request, res: express.Response) {
  try {
    const { jobTitle, department } = req.body;
    if (!jobTitle) {
      return res.status(400).json({ error: 'Job title is required.' });
    }

    const ai = getGeminiClient();

    const prompt = `Provide recruitment intelligence and recommendations for the role of "${jobTitle}" in the "${department || 'General'}" department.
Return JSON strictly matching:
{
  "suggestedSkills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Skill 6"],
  "preferredSkills": ["Pref Skill 1", "Pref Skill 2", "Pref Skill 3"],
  "suggestedQualifications": ["BSc in Computer Science / Information Systems", "National Diploma (NQF 6/7)"],
  "suggestedCertifications": ["Certification 1", "Certification 2"],
  "suggestedExperienceYears": 3,
  "suggestedResponsibilities": [
    "Primary responsibility 1",
    "Primary responsibility 2",
    "Primary responsibility 3",
    "Primary responsibility 4"
  ],
  "suggestedBenefits": ["Medical Aid Contribution", "Performance Bonus", "Flexible Work / Remote Option", "Retirement Fund"]
} `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error in handleJobSuggestions:', error);
    return res.status(500).json({ error: 'Failed to fetch job suggestions', details: error.message });
  }
}

app.post('/api/ai/job-suggestions', handleJobSuggestions);
app.post('/api/gemini/job-suggestions', handleJobSuggestions);

// ============================================================================
// 5. AI RAW JOB TEXT PARSER ENDPOINT
// ============================================================================
app.post('/api/gemini/analyze-job', async (req, res) => {
  try {
    const { rawJobText } = req.body;
    const ai = getGeminiClient();

    const prompt = `You are a Senior Talent Acquisition Specialist and Enterprise Recruitment Architect.
Extract a rich, structured enterprise Job Profile from this raw vacancy text or description:
${rawJobText}

IMPORTANT SALARY & STRUCTURAL RULES:
- The salary MUST be extracted as MONTHLY ZAR values in salaryMinZar and salaryMaxZar (e.g. if text says "R25 000 per month" or "R25k pm", salaryMinZar is 25000).
- If an annual salary is specified (e.g. "R600 000 per annum"), convert it to monthly by dividing by 12 (e.g. 50000).
- If only one monthly amount is stated (e.g. R35 000), set salaryMinZar to 35000 and salaryMaxZar to 42000 (or a reasonable 20% range).
- Ensure separate requiredSkills vs preferredSkills arrays.
- Extract structured responsibilities, minimum qualifications, field of study, certifications, and benefits.

Return JSON strictly matching this schema:
{
  "jobTitle": "Job Title (e.g. Senior Full Stack Developer)",
  "department": "Department (e.g. Information Technology)",
  "company": "Company Name (e.g. eStudy South Africa or FinTech Dynamics)",
  "industry": "Industry (e.g. Financial Technology / EdTech / E-Commerce)",
  "location": "City, Province (e.g. Pretoria, Gauteng)",
  "province": "Gauteng",
  "city": "Pretoria",
  "specificLocation": "Office park or specific area (e.g. Menlyn Maine or Sandton CBD)",
  "locationType": "On-Site" | "Remote" | "Hybrid",
  "workArrangement": "On-Site" | "Remote" | "Hybrid",
  "employmentType": "Full Time" | "Part Time" | "Contract" | "Temporary" | "Internship" | "Graduate / Entry Level",
  "salaryMinZar": 35000,
  "salaryMaxZar": 50000,
  "salaryMinMonthly": 35000,
  "salaryMaxMonthly": 50000,
  "requiredSkills": ["React", "TypeScript", "Node.js", "SQL", "Git"],
  "preferredSkills": ["AWS", "Docker", "Next.js", "PostgreSQL"],
  "minimumExperienceYears": 3,
  "preferredExperienceYears": 5,
  "experienceDescription": "3+ years professional experience developing full-stack web applications in enterprise environments.",
  "qualifications": ["Bachelor's Degree in Computer Science or National Diploma (NQF 6/7)"],
  "minimumQualification": "Bachelor's Degree (NQF 7)",
  "fieldOfStudy": "Computer Science / Information Technology / Software Engineering",
  "preferredQualification": "Honours Degree / Postgraduate Diploma (NQF 8)",
  "certifications": ["AWS Certified Developer", "Azure Certified"],
  "responsibilities": [
    "Design and develop responsive, robust web applications",
    "Collaborate with product designers and backend engineers",
    "Write unit and integration tests to ensure software reliability"
  ],
  "essentialRequirements": [
    "Demonstrated experience with React and modern TypeScript",
    "Solid understanding of relational databases and RESTful API architecture"
  ],
  "preferredRequirements": [
    "Experience with cloud deployments on AWS or Azure",
    "Familiarity with Agile and Scrum development methodologies"
  ],
  "benefits": [
    "Medical Aid Contribution",
    "Retirement Fund",
    "Annual Performance Bonus",
    "Remote Work Option",
    "Flexible Working Hours"
  ],
  "aboutRole": "Exciting opportunity to join a fast-growing team building modern digital platforms.",
  "jobDescription": "Full formatted job description text...",
  "closingDate": "YYYY-MM-DD"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, jobProfile: parsed });
  } catch (error: any) {
    console.error('Error in /api/gemini/analyze-job:', error);
    return res.status(500).json({ error: 'Failed to analyze job profile', details: error.message });
  }
});

// ============================================================================
// 6. AI EMAIL GENERATOR ENDPOINT
// ============================================================================
app.post('/api/gemini/generate-email', async (req, res) => {
  try {
    const { candidateName, jobTitle, companyName, emailType, customNotes } = req.body;
    const ai = getGeminiClient();

    const prompt = `Write a highly professional, friendly, and personalized email for a recruitment process.
Candidate Name: ${candidateName}
Job Title: ${jobTitle}
Company: ${companyName || 'Aura Tech Enterprise'}
Email Type: ${emailType}
Additional Recruiter Context: ${customNotes || 'Standard recruitment template'}

Return JSON with format:
{
  "subject": "Email Subject Line",
  "body": "Full body text of the email with appropriate greetings and sign-off"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, email: parsed });
  } catch (error: any) {
    console.error('Error in /api/gemini/generate-email:', error);
    return res.status(500).json({ error: 'Failed to generate email', details: error.message });
  }
});

// ============================================================================
// 7. OPTIONAL EXTERNAL N8N WEBHOOK PROXY (FOR AUTOMATION/NOTIFICATIONS)
// ============================================================================
app.post('/api/n8n/trigger-webhook', async (req, res) => {
  try {
    let { webhookUrl, payload, customHeaders } = req.body;

    if (!webhookUrl || typeof webhookUrl !== 'string') {
      return res.status(400).json({ error: 'Valid webhookUrl string is required' });
    }

    const startTime = Date.now();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'Aura-AI-Recruitment-Platform/1.0',
      ...(customHeaders || {}),
    };

    console.log(`[n8n Proxy] Triggering webhook: ${webhookUrl}`);

    let response = await fetch(webhookUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload || {}),
    });

    let actualUrlUsed = webhookUrl;
    if (!response.ok && response.status === 404 && webhookUrl.includes('/webhook-test/')) {
      const prodUrl = webhookUrl.replace('/webhook-test/', '/webhook/');
      console.log(`[n8n Proxy] Test URL 404, attempting fallback to production URL: ${prodUrl}`);
      const fallbackRes = await fetch(prodUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload || {}),
      });
      if (fallbackRes.ok) {
        response = fallbackRes;
        actualUrlUsed = prodUrl;
      }
    } else if (!response.ok && response.status === 404 && webhookUrl.includes('/webhook/')) {
      const testUrl = webhookUrl.replace('/webhook/', '/webhook-test/');
      console.log(`[n8n Proxy] Production URL 404, attempting fallback to test URL: ${testUrl}`);
      const fallbackRes = await fetch(testUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload || {}),
      });
      if (fallbackRes.ok) {
        response = fallbackRes;
        actualUrlUsed = testUrl;
      }
    }

    const durationMs = Date.now() - startTime;
    const responseText = await response.text();

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = responseText;
    }

    console.log(`[n8n Proxy] Webhook responded with status ${response.status} in ${durationMs}ms`);

    return res.json({
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      durationMs,
      response: responseData,
      triggeredUrl: actualUrlUsed,
    });
  } catch (error: any) {
    console.error('[n8n Proxy Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to dispatch n8n webhook',
      details: error.message || String(error),
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Aura Recruitment Flow AI running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

