export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Hybrid' | 'Remote';

export type CandidateCategory = 'Excellent Match' | 'Strong Match' | 'Suitable' | 'Potential' | 'Not Suitable';

export type ApplicationSource = 'Careers Website' | 'Email' | 'LinkedIn' | 'Job Portals' | 'Manual Upload';

export type ApplicationStatus = 
  | 'New'
  | 'Screened'
  | 'Shortlisted'
  | 'Interview Scheduled'
  | 'Assessment Sent'
  | 'Reference Check'
  | 'Offer Extended'
  | 'Rejected'
  | 'On Hold';

export interface JobProfile {
  id: string;
  jobTitle: string;
  department: string;
  company: string;
  location: string;
  employmentType: EmploymentType;
  salaryMinZar: number;
  salaryMaxZar: number;
  requiredSkills: string[];
  preferredSkills: string[];
  minimumExperienceYears: number;
  qualifications: string[]; // e.g. ["BSc Computer Science or equivalent NQF 7"]
  jobDescription: string;
  closingDate: string;
  createdDate: string;
  status: 'Open' | 'Closed' | 'Draft';
  applicantCount?: number;
}

export interface EducationItem {
  degree: string;
  institution: string;
  fieldOfStudy: string;
  yearGraduated?: number;
  nqfLevelEquivalent?: string;
}

export interface WorkExperienceItem {
  title: string;
  company: string;
  durationMonths: number;
  startDate: string;
  endDate: string; // or 'Present'
  keyResponsibilities: string[];
  achievements: string[];
}

export interface ExtractedCandidateData {
  name: string;
  surname: string;
  email: string;
  phone: string;
  location: string;
  nationality: string;
  education: EducationItem[];
  qualifications: string[];
  certifications: string[];
  workExperience: WorkExperienceItem[];
  technicalSkills: string[];
  softSkills: string[];
  languages: string[];
  totalYearsExperience: number;
  currentEmployer: string;
  noticePeriodDays: number;
  expectedSalaryZar: number;
  availability: string;
  linkedInUrl?: string;
  portfolioUrl?: string;
  referencesCount: number;
}

export interface ScoreCategoryBreakdown {
  educationMatch: number; // 0-100
  skillsMatch: number; // 0-100
  experienceMatch: number; // 0-100
  industryMatch: number; // 0-100
  certificationMatch: number; // 0-100
  leadershipExperience: number; // 0-100
  communicationSkills: number; // 0-100
  careerStability: number; // 0-100
  employmentGapsScore: number; // 0-100
  locationSuitability: number; // 0-100
  salaryAlignment: number; // 0-100
  availabilityScore: number; // 0-100
  overallScore: number; // 0-100
}

export interface RiskConcern {
  id: string;
  category: 'Employment Gap' | 'Missing Qualification' | 'Frequent Job Changes' | 'Missing Contact Info' | 'Overqualified' | 'Underqualified' | 'Salary Mismatch' | 'Relocation Required';
  severity: 'High' | 'Medium' | 'Low';
  description: string;
  mitigationSuggestion?: string;
}

export interface ExecutiveSummary {
  headline: string;
  experienceOverview: string;
  technicalAlignment: string;
  leadershipAndSoftSkills: string;
  salaryAndNoticeFit: string;
  keyConcerns: string[];
  overallRecommendation: 'Strong Interview Candidate' | 'Suitable Candidate' | 'Potential Match - Further Info Needed' | 'Overbudget Candidate' | 'Not Recommended';
}

export interface N8nNodeOutput<T = any> {
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  timestamp: string;
  confidence: number; // 0.0 - 1.0
  reasoning: string;
  recommendation: string;
  data: T;
}

export interface ApplicationRecord {
  id: string;
  jobId: string;
  jobTitle: string;
  candidateId: string;
  source: ApplicationSource;
  appliedDate: string;
  rawCvText: string;
  coverLetterText?: string;
  extractedData: ExtractedCandidateData;
  scores: ScoreCategoryBreakdown;
  category: CandidateCategory;
  risks: RiskConcern[];
  summary: ExecutiveSummary;
  status: ApplicationStatus;
  recruiterNotes?: string;
  isAnonymizedView?: boolean;
  popiaConsent: {
    consented: boolean;
    timestamp: string;
    ipAddress?: string;
  };
  n8nPayload?: {
    step3_extraction: N8nNodeOutput<ExtractedCandidateData>;
    step4_scoring: N8nNodeOutput<ScoreCategoryBreakdown>;
    step5_riskanalysis: N8nNodeOutput<RiskConcern[]>;
    step6_summary: N8nNodeOutput<ExecutiveSummary>;
  };
}

export interface EmailCommunication {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  type: 'Acknowledgement' | 'Interview Invitation' | 'Assessment Invitation' | 'Additional Information Request' | 'Reference Check Request' | 'Offer Letter Draft' | 'Rejection Email';
  subject: string;
  body: string;
  sentDate?: string;
  status: 'Draft' | 'Sent' | 'Scheduled';
}

export interface InterviewSlot {
  id: string;
  candidateId: string;
  candidateName: string;
  jobTitle: string;
  interviewerName: string;
  date: string;
  startTime: string;
  endTime: string;
  meetingLink: string;
  status: 'Proposed' | 'Confirmed' | 'Rescheduled' | 'Completed' | 'Cancelled';
  icsContent?: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  entityType?: 'Candidate' | 'Job' | 'Email' | 'Interview' | 'System';
  details: string;
  popiaReference?: string;
}

export interface NotificationItem {
  id: string;
  icon: string;
  title: string;
  detail: string;
  badge: string;
  timestamp: string;
  read: boolean;
  category: 'Ingestion' | 'Screening' | 'Parsing' | 'Compliance' | 'Matching' | 'Calendar' | 'Communication' | 'System';
}

