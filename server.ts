import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

// ============================================================
// ENVIRONMENT CONFIGURATION
// ============================================================

// Explicitly load .env.local for local VS Code development.
// AI Studio may inject environment variables differently,
// but this ensures the local Node/Express server can access them.
dotenv.config({ path: '.env.local' });

// Also load .env as a fallback for variables that may exist there.
dotenv.config();

const app = express();

app.use(express.json({ limit: '10mb' }));

const PORT = Number(process.env.PORT) || 3000;

const GEMINI_MODEL =
  process.env.GEMINI_MODEL || 'gemini-3.6-flash';

// ============================================================
// ENVIRONMENT VALIDATION
// ============================================================

console.log('========================================');
console.log('TalentFlow AI - Server Configuration');
console.log('========================================');

console.log(`NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
console.log(`PORT: ${PORT}`);
console.log(`Gemini model: ${GEMINI_MODEL}`);

if (process.env.GEMINI_API_KEY) {
  console.log(
    `Gemini API key loaded: YES (${process.env.GEMINI_API_KEY.length} characters)`
  );
} else {
  console.error('Gemini API key loaded: NO');
  console.error(
    'Make sure GEMINI_API_KEY exists in your .env.local file.'
  );
}

console.log('========================================');

// ============================================================
// GEMINI CLIENT
// ============================================================

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY environment variable is not configured. ' +
        'Add your Gemini API key to .env.local and restart the server.'
    );
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

// ============================================================
// HEALTH CHECK
// ============================================================

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

// ============================================================
// STEP 3-7: AI CANDIDATE SCREENING
// ============================================================

app.post('/api/gemini/screen-candidate', async (req, res) => {
  try {
    const {
      rawCvText,
      coverLetterText,
      jobProfile,
    } = req.body;

    if (!rawCvText || !jobProfile) {
      return res.status(400).json({
        error: 'Missing rawCvText or jobProfile',
      });
    }

    const ai = getGeminiClient();

    const systemInstruction = `
You are a Senior Enterprise AI Solutions Architect and HR Technology Consultant with 20 years of experience in recruitment systems and South African / Global HR technology.

Your task is to analyze a candidate CV and cover letter against a Job Profile and return a structured JSON screening analysis.

CRITICAL INSTRUCTIONS:

1. DO NOT use naive keyword matching. Use deep semantic reasoning.
2. Understand synonyms and equivalent roles.
   Example:
   Software Engineer = Backend Developer = Full Stack Developer.
3. Recognize equivalent South African and international qualifications.
   Example:
   BTech IT = BSc Computer Science = NQF Level 7 equivalent where appropriate.
4. Evaluate salary alignment, notice periods, and career stability accurately.
5. Identify explicit and hidden risks.
   Examples:
   - Employment gaps greater than 6 months
   - Job hopping
   - Missing core qualifications
   - Relocation requirements
   - Salary mismatch
   - Notice period concerns
6. Calculate scores strictly between 0 and 100 for each category.
7. Return clean JSON matching the requested structure.
8. Do not include markdown code fences around the JSON.
`;

    const prompt = `
JOB PROFILE:

Title:
${jobProfile.jobTitle}

Company:
${jobProfile.company}

Location:
${jobProfile.location}

Salary Range:
R${Number(jobProfile.salaryMinZar || 0).toLocaleString()} -
R${Number(jobProfile.salaryMaxZar || 0).toLocaleString()} per annum

Required Skills:
${(jobProfile.requiredSkills || []).join(', ')}

Preferred Skills:
${
  jobProfile.preferredSkills?.length
    ? jobProfile.preferredSkills.join(', ')
    : 'None'
}

Minimum Experience Years:
${jobProfile.minimumExperienceYears}

Qualifications Required:
${(jobProfile.qualifications || []).join(', ')}

Description:
${jobProfile.jobDescription}


CANDIDATE CV / RESUME TEXT:

${rawCvText}


${
  coverLetterText
    ? `COVER LETTER:\n${coverLetterText}`
    : ''
}


Evaluate this application completely.

Return JSON containing:

1. extractedData:
{
  name,
  surname,
  email,
  phone,
  location,
  nationality,
  education: [
    {
      degree,
      institution,
      fieldOfStudy,
      yearGraduated,
      nqfLevelEquivalent
    }
  ],
  qualifications,
  certifications,
  workExperience: [
    {
      title,
      company,
      durationMonths,
      startDate,
      endDate,
      keyResponsibilities,
      achievements
    }
  ],
  technicalSkills,
  softSkills,
  languages,
  totalYearsExperience,
  currentEmployer,
  noticePeriodDays,
  expectedSalaryZar,
  availability,
  linkedInUrl,
  portfolioUrl,
  referencesCount
}

2. scores:
{
  educationMatch,
  skillsMatch,
  experienceMatch,
  industryMatch,
  certificationMatch,
  leadershipExperience,
  communicationSkills,
  careerStability,
  employmentGapsScore,
  locationSuitability,
  salaryAlignment,
  availabilityScore,
  overallScore
}

All scores must be between 0 and 100.

3. category:

"Excellent Match"
OR
"Strong Match"
OR
"Suitable"
OR
"Potential"
OR
"Not Suitable"

4. risks:

[
  {
    id,
    category,
    severity: "High" | "Medium" | "Low",
    description,
    mitigationSuggestion
  }
]

5. summary:

{
  headline,
  experienceOverview,
  technicalAlignment,
  leadershipAndSoftSkills,
  salaryAndNoticeFit,
  keyConcerns,
  overallRecommendation
}

overallRecommendation must be one of:

"Strong Interview Candidate"
"Suitable Candidate"
"Potential Match - Further Info Needed"
"Overbudget Candidate"
"Not Recommended"

6. n8nPayload:

{
  step3_extraction,
  step4_scoring,
  step5_riskanalysis,
  step6_summary
}

Each n8n step should contain predictable fields such as:

{
  status,
  timestamp,
  confidence,
  reasoning,
  recommendation,
  data
}
`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '{}';

    let parsedData;

    try {
      parsedData = JSON.parse(responseText);
    } catch (parseError) {
      console.error(
        'Gemini returned invalid JSON:',
        responseText
      );

      return res.status(500).json({
        error: 'Gemini returned invalid JSON',
        details:
          parseError instanceof Error
            ? parseError.message
            : String(parseError),
      });
    }

    return res.json({
      success: true,
      timestamp: new Date().toISOString(),
      result: parsedData,
    });
  } catch (error: any) {
    console.error(
      'Error in /api/gemini/screen-candidate:',
      error
    );

    return res.status(500).json({
      error: 'Failed to process candidate screening',
      details: error?.message || String(error),
    });
  }
});

// ============================================================
// STEP 8: AI EMAIL GENERATOR
// ============================================================

app.post('/api/gemini/generate-email', async (req, res) => {
  try {
    const {
      candidateName,
      jobTitle,
      companyName,
      emailType,
      customNotes,
    } = req.body;

    const ai = getGeminiClient();

    const prompt = `
Write a highly professional, friendly, and personalized email
for a recruitment process.

Candidate Name:
${candidateName}

Job Title:
${jobTitle}

Company:
${companyName || 'TalentFlow Enterprise'}

Email Type:
${emailType}

Additional Recruiter Context:
${customNotes || 'Standard recruitment template'}

Email Types include:

- Acknowledgement:
  Confirm receipt of application.

- Interview Invitation:
  Invite candidate to technical or cultural fit interview
  with slot options.

- Assessment Invitation:
  Request candidate to complete coding or domain assessment.

- Additional Information Request:
  Request missing certificates, portfolio, or references.

- Reference Check Request:
  Ask candidate's approval and details for reference calls.

- Offer Letter Draft:
  Formal job offer draft with salary and start date details.

- Rejection Email:
  Empathetic, polite rejection keeping talent in the
  candidate pool for future roles.

Return JSON:

{
  "subject": "Email Subject Line",
  "body": "Full body text of the email with appropriate greetings and sign-off"
}
`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');

    return res.json({
      success: true,
      email: parsed,
    });
  } catch (error: any) {
    console.error(
      'Error in /api/gemini/generate-email:',
      error
    );

    return res.status(500).json({
      error: 'Failed to generate email',
      details: error?.message || String(error),
    });
  }
});

// ============================================================
// STEP 1: AI JOB PROFILE GENERATOR
// ============================================================

app.post('/api/gemini/analyze-job', async (req, res) => {
  try {
    const { rawJobText } = req.body;

    if (!rawJobText) {
      return res.status(400).json({
        error: 'Missing rawJobText',
      });
    }

    const ai = getGeminiClient();

    const prompt = `
Extract a structured enterprise Job Profile from this
raw vacancy text:

${rawJobText}

Return JSON with this format:

{
  "jobTitle": "...",
  "department": "...",
  "company": "...",
  "location": "...",
  "employmentType": "Full-time" | "Contract" | "Hybrid" | "Remote",
  "salaryMinZar": number,
  "salaryMaxZar": number,
  "requiredSkills": ["..."],
  "preferredSkills": ["..."],
  "minimumExperienceYears": number,
  "qualifications": ["..."],
  "jobDescription": "Full formatted job description text..."
}
`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');

    return res.json({
      success: true,
      jobProfile: parsed,
    });
  } catch (error: any) {
    console.error(
      'Error in /api/gemini/analyze-job:',
      error
    );

    return res.status(500).json({
      error: 'Failed to analyze job profile',
      details: error?.message || String(error),
    });
  }
});

// ============================================================
// N8N WEBHOOK PROXY
// ============================================================

app.post('/api/n8n/trigger-webhook', async (req, res) => {
  try {
    let {
      webhookUrl,
      payload,
      customHeaders,
    } = req.body;

    if (
      !webhookUrl ||
      typeof webhookUrl !== 'string'
    ) {
      return res.status(400).json({
        error: 'Valid webhookUrl string is required',
      });
    }

    const startTime = Date.now();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent':
        'Aura-AI-Recruitment-Platform/1.0',
      ...(customHeaders || {}),
    };

    console.log(
      `[n8n Proxy] Triggering webhook: ${webhookUrl}`
    );

    let response = await fetch(webhookUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload || {}),
    });

    let actualUrlUsed = webhookUrl;

    // --------------------------------------------------------
    // Test URL -> Production URL fallback
    // --------------------------------------------------------

    if (
      !response.ok &&
      response.status === 404 &&
      webhookUrl.includes('/webhook-test/')
    ) {
      const prodUrl = webhookUrl.replace(
        '/webhook-test/',
        '/webhook/'
      );

      console.log(
        `[n8n Proxy] Test URL returned 404. Trying production URL: ${prodUrl}`
      );

      const fallbackResponse = await fetch(
        prodUrl,
        {
          method: 'POST',
          headers,
          body: JSON.stringify(payload || {}),
        }
      );

      if (fallbackResponse.ok) {
        response = fallbackResponse;
        actualUrlUsed = prodUrl;
      }
    }

    // --------------------------------------------------------
    // Production URL -> Test URL fallback
    // --------------------------------------------------------

    else if (
      !response.ok &&
      response.status === 404 &&
      webhookUrl.includes('/webhook/')
    ) {
      const testUrl = webhookUrl.replace(
        '/webhook/',
        '/webhook-test/'
      );

      console.log(
        `[n8n Proxy] Production URL returned 404. Trying test URL: ${testUrl}`
      );

      const fallbackResponse = await fetch(
        testUrl,
        {
          method: 'POST',
          headers,
          body: JSON.stringify(payload || {}),
        }
      );

      if (fallbackResponse.ok) {
        response = fallbackResponse;
        actualUrlUsed = testUrl;
      }
    }

    const durationMs = Date.now() - startTime;

    const responseText =
      await response.text();

    let responseData: unknown;

    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = responseText;
    }

    console.log(
      `[n8n Proxy] Webhook responded with status ${response.status} in ${durationMs}ms`
    );

    console.log(
      `[n8n Proxy] URL used: ${actualUrlUsed}`
    );

    if (!response.ok) {
      console.error(
        `[n8n Proxy] Webhook failed: ${response.status} ${response.statusText}`
      );

      console.error(
        '[n8n Proxy] Response:',
        responseData
      );
    }

    return res.json({
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      durationMs,
      response: responseData,
      triggeredUrl: actualUrlUsed,
    });
  } catch (error: any) {
    console.error(
      '[n8n Proxy Error]:',
      error
    );

    return res.status(500).json({
      success: false,
      error: 'Failed to dispatch n8n webhook',
      details:
        error?.message || String(error),
    });
  }
});

// ============================================================
// VITE / STATIC FRONTEND
// ============================================================

async function startServer() {
  try {
    if (
      process.env.NODE_ENV !== 'production'
    ) {
      try {
        const {
          createServer: createViteServer,
        } = await import('vite');

        const vite =
          await createViteServer({
            server: {
              middlewareMode: true,
            },
            appType: 'spa',
          });

        app.use(vite.middlewares);
      } catch (viteError) {
        console.warn(
          'Vite middleware failed, using static fallback:',
          viteError
        );

        const distPath =
          path.join(
            process.cwd(),
            'dist'
          );

        app.use(
          express.static(distPath)
        );

        app.get('*', (_req, res) => {
          res.sendFile(
            path.join(
              distPath,
              'index.html'
            )
          );
        });
      }
    } else {
      const distPath =
        path.join(
          process.cwd(),
          'dist'
        );

      app.use(
        express.static(distPath)
      );

      app.get('*', (_req, res) => {
        res.sendFile(
          path.join(
            distPath,
            'index.html'
          )
        );
      });
    }

    app.listen(
      PORT,
      '0.0.0.0',
      () => {
        console.log(
          `TalentFlow AI Recruitment Platform running on http://localhost:${PORT}`
        );
      }
    );
  } catch (error) {
    console.error(
      'Failed to start server:',
      error
    );

    process.exit(1);
  }
}

// ============================================================
// START APPLICATION
// ============================================================

startServer();
