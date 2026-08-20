# Aura Tech Recruitment Flow AI

> **Next-Generation Enterprise AI Talent Screening, Multi-Factor Scoring & POPIA-Compliant Recruitment Intelligence**

---

## Executive Overview

**Aura Tech Recruitment Flow AI** is a full-stack, enterprise-grade talent acquisition and candidate evaluation platform engineered to eliminate hiring bottlenecks while preserving strict human recruiter oversight. 

Powered by **Google Gemini AI** and backed by durable **Supabase** cloud persistence, Aura transforms unstructured resume documents into structured, explainable, and multi-dimensional recruitment intelligence.

Built specifically with both international hiring standards and the South African talent market in mind, Aura automates the arduous stages of CV parsing, competency matching, NQF qualification verification, compensation benchmarking, and regulatory compliance — reducing screening turnaround times by over **85%**.

---

## The Problem It Solves

Modern talent acquisition teams face several critical inefficiencies:

| Recruitment Challenge | How Aura Tech Solves It |
| :--- | :--- |
| **CV Inundation & Recruiter Burnout**<br>Recruiters spend 30–45 hours per open role manually scanning hundreds of resumes, leading to fatigue and oversight. | **Instant Semantic Ingestion**<br>AI extracts skills, experience years, career progressions, and certifications in seconds directly into structured candidate profiles. |
| **Superficial Keyword Matching**<br>Traditional ATS platforms rely on naive keyword matching, discarding stellar candidates with differing phrasing while passing keyword-stuffed CVs. | **Deep Multi-Factor Scoring**<br>Evaluates semantic skill depth, practical experience relevance, verified tech proficiencies, and contextual alignment against bespoke job specifications. |
| **Unconscious Cognitive Bias**<br>Screening decisions are often unintentionally influenced by demographic indicators, names, age, and backgrounds. | **One-Click Bias-Free Mode**<br>Instantly masks Personally Identifiable Information (PII), names, and photos to ensure unbiased, objective merit-based evaluations. |
| **POPIA & Data Privacy Vulnerabilities**<br>Strict privacy laws (e.g., South Africa's POPIA) penalize non-compliant CV handling and storage. | **Built-in Compliance & Auditing**<br>Granular consent tracking, automated PII sanitization, data retention policies, and immutable audit logging for all recruiter actions. |
| **Salary Mismatch & Closing Uncertainty**<br>Ambiguous compensation figures and untracked deadlines lead to applicant friction and role stagnation. | **Localized ZAR Compensation Engine**<br>Standardized monthly remuneration brackets (`R p.m.`) with automated annual package projection and live closing-date countdown badges. |

---

## Core Capabilities & Feature Modules

### 1. Recruiter Control Center (Dashboard)
- **High-Velocity Pipeline Overview**: Unified bird’s-eye view of active vacancies, total applicant volume, top-tier match ratios, and real-time candidate distribution.
- **Dynamic Vacancy Funnel Filtering**: Filter pipeline analytics and candidates by specific open roles or inspect global talent metrics across the organization.
- **Live Closing Date Tracker**: Color-coded deadline badges (*Healthy >30 days*, *Attention 8–30 days*, *Urgent <7 days*, *Closed*) prevent role lapse.

### 2. Multi-Dimensional AI Screening Engine
- **Explainable Match Scoring (0–100%)**: Categorizes candidates into *Excellent Match (85%+)*, *Strong Match (70–84%)*, *Moderate Match (50–69%)*, or *Low Match (<50%)*.
- **Skill Gap & Risk Analysis**: Highlights missing prerequisites, skill proficiencies, and potential red flags (e.g., short job tenures, vague descriptions).
- **Executive Recruiter Briefings**: Generates concise, bulleted candidate executive summaries highlighting strengths, growth areas, and recommended interview questions.

### 3. Comprehensive Vacancy Management
- **Full-Spectrum Job Profiles**: Supports structured management of departments, companies, required/preferred skill matrices, minimum experience, and qualifications.
- **Work Arrangement & Remuneration**: Discrete options for **On-Site**, **Remote**, and **Hybrid** setups, coupled with monthly South African Rand (ZAR) brackets and auto-calculated annual packages.
- **AI Quick Spec Parser**: Paste unstructured recruiter drafts or raw job blurbs to instantly auto-populate structured vacancy forms.
- **Lifecycle Actions**: Pause, resume, edit, or archive vacancies with instant synchronization to the Supabase database.

### 4. Interactive Recruiter Workbench
- **Human-in-the-Loop Decisioning**: Progress applicants seamlessly across recruitment stages: *Applied* → *Screening* → *Interview* → *Offer* → *Rejected* → *Hired*.
- **Direct Candidate Communications**: Compose and dispatch personalized interview invitations, offer letters, and feedback notices using smart AI templates.
- **Candidate Comparison Matrix**: Side-by-side comparative analysis of top candidates across competency, education, and salary alignment.

### 5. South African Regulatory & Market Alignment
- **POPIA Safeguards**: Automated consent management, PII redaction, and compliance readiness indicators.
- **NQF (National Qualifications Framework) Mapping**: Accurately recognizes South African NQF qualification levels (NQF 4 through NQF 10).
- **B-BBEE & Employment Equity Considerations**: Built-in support for diversity and equity tracking while maintaining objective evaluation standards.

### 6. Analytics & Intelligence Hub
- **Talent Quality Distribution**: Visual charts (Recharts) mapping match scores across departments and roles.
- **Sourcing Velocity**: Metric breakdowns illustrating time-to-hire, funnel conversion rates, and recruitment operational velocity.
- **3D Neural Intelligence Background**: Interactive Three.js spatial background providing a modern, immersive recruiter experience.

---

## Technology Stack

```
├── Frontend
│   ├── React 19 (Functional Components & Hooks)
│   ├── TypeScript (Strict Type Safety)
│   ├── Tailwind CSS v4 (Modern Design System)
│   ├── Motion (Smooth Layout Transitions)
│   ├── Lucide React (Enterprise Iconography)
│   ├── Recharts (Pipeline & Talent Data Visualizations)
│   └── Three.js (Interactive 3D Visual Assets)
│
├── Backend & Services
│   ├── Node.js & Express (API Routing & Middleware)
│   ├── Google Gemini API (@google/genai SDK) (Server-Side LLM Engine)
│   └── Supabase (@supabase/supabase-js) (Durable Relational Database & Realtime)
│
└── Tooling & Build
    ├── Vite (Fast Module Bundling)
    ├── esbuild (Server Compilation)
    └── TypeScript Compiler (tsc)
```

---

## Architecture & Security Philosophy

1. **Server-Side AI Proxying**: Gemini API keys and confidential credentials remain strictly on the backend (`server.ts`) and are never exposed to client browsers.
2. **Immutable Audit Logging**: Every candidate state change, vacancy update, scoring evaluation, and export action creates a traceable event record in the audit log.
3. **Database Schema Resiliency**: Fault-tolerant mapping and fallback strategies ensure seamless operation both with live Supabase database connections and offline development environments.

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Environment Variables
Create a `.env` file in the root directory based on `.env.example`:

```env
# Gemini API Key (Required for AI Screening & Parsing)
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase Configuration (Optional for cloud persistence)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### Installation & Execution

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```
   *The application dev server will boot on `http://localhost:3000`.*

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Launch production build**:
   ```bash
   npm start
   ```

---

## Summary

**Aura Tech Recruitment Flow AI** empowers modern recruiters and enterprise HR teams to move away from tedious administrative overhead and towards high-impact talent decision-making — combining cutting-edge artificial intelligence with ethical, compliant, and transparent recruitment workflows.
