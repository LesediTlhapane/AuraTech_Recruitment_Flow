import express from 'express';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';

const app = express();
app.use(express.json({ limit: '10mb' }));

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

// Step 3, 4, 5, 6, 7 AI Screening Endpoint
app.post('/api/gemini/screen-candidate', async (req, res) => {
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

    const systemInstruction = `You are a Senior Enterprise AI Solutions Architect and HR Technology Consultant with 20 years of experience in recruitment systems and South African / Global HR technology.
Your task is to analyze the candidate application against the Job Profile and return a structured JSON screening analysis.

CRITICAL INSTRUCTIONS ON CANDIDATE DATA INTEGRITY & EVIDENCE:
1. Evaluate ONLY the supplied candidate profile data and CV text.
2. DO NOT invent, hallucinate, or assume missing candidate information. If any information is unavailable, record it as "Not provided" or an empty list. Never manufacture years of experience, skills, qualifications, employment history, certifications, job titles, education, or achievements.
3. The explicitly provided candidate profile (Name, Experience, Skills, Qualification, Salary, Location) represents the verified source of truth.
4. EXPERIENCE ADVANTAGE EVALUATION:
   - Vacancy Minimum Experience: ${vacancyMinExpYears} years.
   - Candidate Experience: ${candidateExpYears !== undefined && candidateExpYears !== null ? `${candidateExpYears} years` : 'Extracted from CV / Not specified'}.
   ${expDiff !== null && expDiff > 0 ? `- The candidate has an Experience Advantage of +${expDiff} years over the requirement. Treat this as a positive factor and key strength in candidate evaluation (while still evaluating required skills, qualifications, and role fit).` : ''}
   ${expDiff !== null && expDiff < 0 ? `- The candidate has an experience deficit of ${Math.abs(expDiff)} years below the minimum requirement. Reflect this accurately in the evaluation and risk flags.` : ''}
5. Calculate objective scores between 0 and 100 for each category based purely on actual evidence.
6. Return a clean JSON output matching the requested schema.`;

    const candidateDetailsText = candidateProfile ? `
AUTHORITATIVE CANDIDATE PROFILE:
- Full Name: ${candidateProfile.firstName || ''} ${candidateProfile.lastName || ''} ${candidateProfile.fullName || ''}`.trim() + `
- Email: ${candidateProfile.email || 'Not provided'}
- Phone: ${candidateProfile.phone || 'Not provided'}
- Location: ${candidateProfile.location || 'Not provided'}
- Qualification: ${candidateProfile.qualification || 'Not provided'}
- Total Years Experience: ${candidateExpYears !== undefined && candidateExpYears !== null ? `${candidateExpYears} Years` : 'Not provided'}
- Technical Skills: ${Array.isArray(candidateProfile.skills) ? candidateProfile.skills.join(', ') : candidateProfile.skills || 'Not provided'}
- Notice Period: ${candidateProfile.noticePeriod || 'Not provided'}
- Expected Salary: ${candidateProfile.expectedSalary || 'Not provided'}
` : '';

    const prompt = `JOB PROFILE:
Title: ${jobProfile.jobTitle}
Company: ${jobProfile.company}
Location: ${jobProfile.location}
Salary Range: R${(jobProfile.salaryMinZar || 0).toLocaleString()} - R${(jobProfile.salaryMaxZar || 0).toLocaleString()} per month
Required Skills: ${Array.isArray(jobProfile.requiredSkills) ? jobProfile.requiredSkills.join(', ') : jobProfile.requiredSkills || 'None specified'}
Preferred Skills: ${Array.isArray(jobProfile.preferredSkills) ? jobProfile.preferredSkills.join(', ') : 'None'}
Min Experience Years Required: ${vacancyMinExpYears}
Qualifications Required: ${Array.isArray(jobProfile.qualifications) ? jobProfile.qualifications.join(', ') : jobProfile.qualifications || 'Relevant qualification'}
Description: ${jobProfile.jobDescription}

${candidateDetailsText}

RAW CV / RESUME TEXT:
${rawCvText || 'No separate raw text provided. Refer to Authoritative Candidate Profile above.'}

${coverLetterText ? `COVER LETTER:\n${coverLetterText}` : ''}

Evaluate this application strictly based on the supplied data and output JSON containing:
1. extractedData: {
     name: string,
     surname: string,
     email: string,
     phone: string,
     location: string,
     nationality: string,
     education: array of {degree, institution, fieldOfStudy, yearGraduated, nqfLevelEquivalent},
     qualifications: array of strings,
     certifications: array of strings,
     workExperience: array of {title, company, durationMonths, startDate, endDate, keyResponsibilities, achievements},
     technicalSkills: array of strings,
     softSkills: array of strings,
     languages: array of strings,
     totalYearsExperience: number,
     currentEmployer: string,
     noticePeriodDays: number,
     expectedSalaryZar: number,
     availability: string,
     linkedInUrl: string (or "Not provided"),
     portfolioUrl: string (or "Not provided"),
     referencesCount: number
   }
2. scores: {
     educationMatch: number (0-100),
     skillsMatch: number (0-100),
     experienceMatch: number (0-100),
     industryMatch: number (0-100),
     certificationMatch: number (0-100),
     leadershipExperience: number (0-100),
     communicationSkills: number (0-100),
     careerStability: number (0-100),
     employmentGapsScore: number (0-100),
     locationSuitability: number (0-100),
     salaryAlignment: number (0-100),
     availabilityScore: number (0-100),
     overallScore: number (0-100)
   }
3. experienceAnalysis: {
     requiredYears: number,
     candidateYears: number,
     experienceAdvantageYears: number (positive if candidate exceeds requirement, 0 if equal, negative if deficit),
     hasAdvantage: boolean,
     statement: string (e.g. "Experience requirement: 3 years | Candidate experience: 7 years | Experience advantage: +4 years")
   }
4. category: 'Excellent Match' | 'Strong Match' | 'Suitable' | 'Potential' | 'Not Suitable'
5. risks: array of {id, category, severity ('High'|'Medium'|'Low'), description, mitigationSuggestion}
6. summary: {
     headline: string,
     experienceOverview: string (include the experience advantage statement if candidate exceeds requirement),
     technicalAlignment: string,
     leadershipAndSoftSkills: string,
     salaryAndNoticeFit: string,
     keyConcerns: array of strings,
     overallRecommendation: 'Strong Interview Candidate' | 'Suitable Candidate' | 'Potential Match - Further Info Needed' | 'Overbudget Candidate' | 'Not Recommended'
   }
7. n8nPayload: object containing predictable n8n node outputs for step3_extraction, step4_scoring, step5_riskanalysis, step6_summary with fields status, timestamp, confidence, reasoning, recommendation, data.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '{}';
    const parsedData = JSON.parse(responseText);

    return res.json({
      success: true,
      timestamp: new Date().toISOString(),
      result: parsedData,
    });
  } catch (error: any) {
    console.error('Error in /api/gemini/screen-candidate:', error);
    return res.status(500).json({
      error: 'Failed to process candidate screening',
      details: error.message || String(error),
    });
  }
});

// Step 8 AI Email Generator Endpoint
app.post('/api/gemini/generate-email', async (req, res) => {
  try {
    const { candidateName, jobTitle, companyName, emailType, customNotes } = req.body;

    const ai = getGeminiClient();

    const prompt = `Write a highly professional, friendly, and personalized email for a recruitment process.
Candidate Name: ${candidateName}
Job Title: ${jobTitle}
Company: ${companyName || 'TalentFlow Enterprise'}
Email Type: ${emailType}
Additional Recruiter Context: ${customNotes || 'Standard recruitment template'}

Email Types include:
- 'Acknowledgement': Confirm receipt of application.
- 'Interview Invitation': Invite candidate to technical or cultural fit interview with slot options.
- 'Assessment Invitation': Request candidate to complete coding or domain assessment.
- 'Additional Information Request': Request missing certificates, portfolio, or references.
- 'Reference Check Request': Ask candidate's approval and details for reference calls.
- 'Offer Letter Draft': Formal job offer draft with salary and start date details.
- 'Rejection Email': Empathetic, polite rejection keeping talent in candidate pool for future roles.

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

// Step 1 AI Job Profile Generator Endpoint
app.post('/api/gemini/analyze-job', async (req, res) => {
  try {
    const { rawJobText } = req.body;
    const ai = getGeminiClient();

    const prompt = `Extract a structured enterprise Job Profile from this raw vacancy text:
${rawJobText}

IMPORTANT SALARY RULES:
- The salary MUST be extracted as MONTHLY ZAR values in salaryMinZar and salaryMaxZar (e.g. if text says "R20 000 per month" or "R20k pm", salaryMinZar is 20000).
- If an annual salary is specified (e.g. "R600 000 per annum"), convert it to monthly by dividing by 12.
- If only one monthly amount is stated (e.g. R20 000), set salaryMinZar to 20000 and salaryMaxZar to 25000 (or reasonable range).

Return JSON strictly matching this schema:
{
  "jobTitle": "...",
  "department": "...",
  "company": "...",
  "location": "...",
  "locationType": "On-Site" | "Remote" | "Hybrid",
  "employmentType": "Full Time" | "Part Time" | "Contract",
  "salaryMinZar": number (monthly salary in ZAR, e.g. 20000),
  "salaryMaxZar": number (monthly salary in ZAR, e.g. 28000),
  "requiredSkills": ["..."],
  "preferredSkills": ["..."],
  "minimumExperienceYears": number,
  "qualifications": ["..."],
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

// n8n Webhook Proxy Endpoint
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

    // Smart fallback if test URL returns 404 (workflow inactive in test mode, try production URL)
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

    console.log(`[n8n Proxy] Webhook responded with status ${response.status} in ${durationMs}ms (URL: ${actualUrlUsed})`);

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
    console.log(`TalentFlow AI Recruitment Platform running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
