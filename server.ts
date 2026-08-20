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
    const { rawCvText, coverLetterText, jobProfile } = req.body;

    if (!rawCvText || !jobProfile) {
      return res.status(400).json({ error: 'Missing rawCvText or jobProfile' });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are a Senior Enterprise AI Solutions Architect and HR Technology Consultant with 20 years of experience in recruitment systems and South African / Global HR technology.
Your task is to analyze a candidate CV and cover letter against a Job Profile and return a structured JSON screening analysis.

CRITICAL INSTRUCTION:
1. DO NOT use naive keyword matching. Use deep semantic reasoning.
2. Understand synonyms and equivalent roles (e.g., Software Engineer = Backend Developer = Full Stack Developer).
3. Recognize equivalent South African and international qualifications (e.g. BTech IT = BSc Computer Science = NQF Level 7).
4. Evaluate salary alignment, notice periods, and career stability accurately.
5. Identify explicit or hidden risks (e.g. employment gaps > 6 months, job hopping, missing core qualifications, relocation needs).
6. Calculate scores strictly between 0 and 100 for each category.
7. Return a clean JSON output matching the required format.`;

    const prompt = `JOB PROFILE:
Title: ${jobProfile.jobTitle}
Company: ${jobProfile.company}
Location: ${jobProfile.location}
Salary Range: R${jobProfile.salaryMinZar.toLocaleString()} - R${jobProfile.salaryMaxZar.toLocaleString()} per annum
Required Skills: ${jobProfile.requiredSkills.join(', ')}
Preferred Skills: ${jobProfile.preferredSkills ? jobProfile.preferredSkills.join(', ') : 'None'}
Min Experience Years: ${jobProfile.minimumExperienceYears}
Qualifications Required: ${jobProfile.qualifications.join(', ')}
Description: ${jobProfile.jobDescription}

CANDIDATE CV / RESUME TEXT:
${rawCvText}

${coverLetterText ? `COVER LETTER:\n${coverLetterText}` : ''}

Evaluate this application completely and output JSON containing:
1. extractedData: name, surname, email, phone, location, nationality, education (array of {degree, institution, fieldOfStudy, yearGraduated, nqfLevelEquivalent}), qualifications, certifications, workExperience (array of {title, company, durationMonths, startDate, endDate, keyResponsibilities, achievements}), technicalSkills, softSkills, languages, totalYearsExperience, currentEmployer, noticePeriodDays, expectedSalaryZar, availability, linkedInUrl, portfolioUrl, referencesCount
2. scores: educationMatch, skillsMatch, experienceMatch, industryMatch, certificationMatch, leadershipExperience, communicationSkills, careerStability, employmentGapsScore, locationSuitability, salaryAlignment, availabilityScore, overallScore (all 0-100)
3. category: 'Excellent Match' | 'Strong Match' | 'Suitable' | 'Potential' | 'Not Suitable'
4. risks: array of {id, category, severity ('High'|'Medium'|'Low'), description, mitigationSuggestion}
5. summary: {headline, experienceOverview, technicalAlignment, leadershipAndSoftSkills, salaryAndNoticeFit, keyConcerns (array of strings), overallRecommendation ('Strong Interview Candidate' | 'Suitable Candidate' | 'Potential Match - Further Info Needed' | 'Overbudget Candidate' | 'Not Recommended')}
6. n8nPayload: object containing predictable n8n node outputs for step3_extraction, step4_scoring, step5_riskanalysis, step6_summary with fields status, timestamp, confidence, reasoning, recommendation, data.`;

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
