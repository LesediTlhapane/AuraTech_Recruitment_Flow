/* eslint-disable prettier/prettier */

import React, { useState, useEffect } from 'react';

import {
  JobProfile,
  ApplicationRecord,
  EmailCommunication,
  InterviewSlot,
  AuditLogItem,
  ApplicationStatus,
  NotificationItem,
  CandidateCategory,
} from './types';

import {
  initialEmails,
  initialNotifications,
} from './data/mockData';

import {
  supabase,
  isSupabaseConfigured,
} from './lib/supabase';

import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { Vacancies } from './components/Vacancies';
import { CandidatesList } from './components/CandidatesList';
import { ScreeningWorkbench } from './components/ScreeningWorkbench';
import { CandidateDetailModal } from './components/CandidateDetailModal';
import { AddCandidateModal } from './components/AddCandidateModal';
import { Communications } from './components/Communications';
import { InterviewScheduler } from './components/InterviewScheduler';
import { AnalyticsView } from './components/AnalyticsView';
import { N8nWorkflowStudio } from './components/N8nWorkflowStudio';
import { PopiaAuditTrail } from './components/PopiaAuditTrail';
import { NotificationsPage } from './components/NotificationsPage';
import { Recruitment3DBackground } from './components/Recruitment3DBackground';
import { AuraLandingPage } from './components/AuraLandingPage';
import { AppTheme } from './components/ThemeToggle';

// ============================================================
// SUPABASE / DATABASE HELPERS
// ============================================================

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const isUuid = (value: unknown): value is string =>
  typeof value === 'string' && UUID_REGEX.test(value.trim());

const nullableUuid = (value: unknown): string | null =>
  isUuid(value) ? value.trim() : null;

/**
 * Maps the application's human-readable candidate statuses to the exact
 * lowercase values allowed by public.candidates.status in Supabase.
 *
 * Database values confirmed from the current candidates_status_check:
 * new, screening, review, shortlisted, elite, interview, rejected, hired, archived
 */
const toDatabaseCandidateStatus = (
  status: ApplicationStatus | string | null | undefined
): string => {
  const normalized = String(status ?? 'new')
    .trim()
    .toLowerCase();

  switch (normalized) {
    case 'new':
      return 'new';
    case 'screening':
    case 'screened':
      return 'screening';
    case 'review':
    case 'under review':
      return 'review';
    case 'shortlisted':
    case 'shortlist':
      return 'shortlisted';
    case 'elite':
    case 'excellent match':
      return 'elite';
    case 'interview':
    case 'interview scheduled':
    case 'interview-scheduled':
      return 'interview';
    case 'rejected':
    case 'reject':
    case 'not suitable':
      return 'rejected';
    case 'hired':
    case 'hire':
      return 'hired';
    case 'archived':
    case 'archive':
      return 'archived';
    default:
      return 'new';
  }
};

const toScreeningRecommendation = (score: number) => {
  if (score >= 90) return 'ELITE';
  if (score >= 80) return 'SHORTLIST';
  if (score >= 65) return 'REVIEW';
  return 'REJECT';
};

export function App() {
  // ============================================================
  // LANDING PAGE
  // ============================================================

  const [showLandingPage, setShowLandingPage] =
    useState<boolean>(true);

  // ============================================================
  // THEME STATE
  // ============================================================

  const [theme, setTheme] = useState<AppTheme>(
    () => (localStorage.getItem('aura_app_theme') as AppTheme) || 'light'
  );

  const handleThemeChange = (newTheme: AppTheme) => {
    setTheme(newTheme);
    localStorage.setItem('aura_app_theme', newTheme);
  };

  // ============================================================
  // CORE PLATFORM STATE
  // ============================================================

  const [jobs, setJobs] = useState<JobProfile[]>([]);
  const [candidates, setCandidates] =
    useState<ApplicationRecord[]>([]);

  const [emails, setEmails] =
    useState<EmailCommunication[]>(initialEmails);

  const [interviews, setInterviews] =
    useState<InterviewSlot[]>([]);

  const [auditLogs, setAuditLogs] =
    useState<AuditLogItem[]>([]);

  const [notifications, setNotifications] =
    useState<NotificationItem[]>(initialNotifications);

  const [activeToastNotif, setActiveToastNotif] =
    useState<NotificationItem | null>(null);

  // ============================================================
  // SUPABASE LOADING STATE
  // ============================================================

  const [isLoading, setIsLoading] =
    useState<boolean>(true);

  const [loadError, setLoadError] =
    useState<string | null>(null);

  // ============================================================
  // LOAD DATA FROM SUPABASE
  // ============================================================

  useEffect(() => {
    const loadRecruitmentData = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);

        // --------------------------------------------------------
        // DEMO / LOCAL MODE
        // --------------------------------------------------------

        if (!isSupabaseConfigured) {
          console.warn(
            'Supabase is not configured. Starting in local/demo mode.'
          );

          setJobs([]);
          setCandidates([]);
          setInterviews([]);
          setAuditLogs([]);

          setIsLoading(false);
          return;
        }

        // --------------------------------------------------------
        // SUPABASE MODE
        // --------------------------------------------------------

        console.log('Connecting to Supabase...');

        const [
          vacanciesResult,
          candidatesResult,
          screeningsResult,
          interviewsResult,
          auditLogsResult,
        ] = await Promise.all([
          supabase
            .from('vacancies')
            .select('*')
            .order('created_at', {
              ascending: false,
            }),

          supabase
            .from('candidates')
            .select('*')
            .order('created_at', {
              ascending: false,
            }),

          supabase
            .from('screenings')
            .select('*')
            .order('created_at', {
              ascending: false,
            }),

          supabase
            .from('interviews')
            .select('*')
            .order('scheduled_at', {
              ascending: true,
            }),

          supabase
            .from('audit_logs')
            .select('*')
            .order('created_at', {
              ascending: false,
            }),
        ]);

        // --------------------------------------------------------
        // CHECK DATABASE ERRORS
        // --------------------------------------------------------

        if (vacanciesResult.error) {
          throw new Error(
            `Vacancies: ${vacanciesResult.error.message}`
          );
        }

        if (candidatesResult.error) {
          throw new Error(
            `Candidates: ${candidatesResult.error.message}`
          );
        }

        if (screeningsResult.error) {
          throw new Error(
            `Screenings: ${screeningsResult.error.message}`
          );
        }

        if (interviewsResult.error) {
          throw new Error(
            `Interviews: ${interviewsResult.error.message}`
          );
        }

        if (auditLogsResult.error) {
          throw new Error(
            `Audit Logs: ${auditLogsResult.error.message}`
          );
        }

        console.log(
          'Supabase vacancies:',
          vacanciesResult.data
        );

        console.log(
          'Supabase candidates:',
          candidatesResult.data
        );

        console.log(
          'Supabase screenings:',
          screeningsResult.data
        );

        console.log(
          'Supabase interviews:',
          interviewsResult.data
        );

        console.log(
          'Supabase audit logs:',
          auditLogsResult.data
        );

        // ========================================================
        // MAP VACANCIES
        // ========================================================

        const mappedJobs: JobProfile[] =
          (vacanciesResult.data || []).map(
            (vacancy: any) => ({
              id: String(vacancy.id),

              jobTitle:
                vacancy.job_title ||
                vacancy.jobTitle ||
                vacancy.title ||
                'Untitled Position',

              department:
                vacancy.department ||
                'General',

              company:
                vacancy.company ||
                'Enterprise Client',

              location:
                vacancy.location ||
                'South Africa',

              employmentType:
                vacancy.employment_type ||
                vacancy.employmentType ||
                'Full-time',

              salaryMinZar: Number(
                vacancy.salary_min_zar ??
                  vacancy.salaryMinZar ??
                  vacancy.salary_min ??
                  0
              ),

              salaryMaxZar: Number(
                vacancy.salary_max_zar ??
                  vacancy.salaryMaxZar ??
                  vacancy.salary_max ??
                  0
              ),

              requiredSkills:
                vacancy.required_skills ||
                vacancy.requiredSkills ||
                [],

              preferredSkills:
                vacancy.preferred_skills ||
                vacancy.preferredSkills ||
                [],

              minimumExperienceYears: Number(
                vacancy.minimum_experience_years ??
                  vacancy.minimumExperienceYears ??
                  0
              ),

              qualifications:
                vacancy.qualifications || [],

              jobDescription:
                vacancy.job_description ||
                vacancy.jobDescription ||
                '',

              closingDate:
                vacancy.closing_date ||
                vacancy.closingDate ||
                '',

              createdDate:
                vacancy.created_at ||
                vacancy.createdDate ||
                new Date().toISOString(),

              status:
                vacancy.status || 'Open',

              applicantCount: Number(
                vacancy.applicant_count ??
                  vacancy.applicantCount ??
                  0
              ),
            })
          );

        setJobs(mappedJobs);

        // ========================================================
        // MAP CANDIDATES + SCREENING
        // ========================================================

        const screenings =
          screeningsResult.data || [];

        const mappedCandidates: ApplicationRecord[] =
          (candidatesResult.data || []).map(
            (candidate: any) => {
              const candidateId =
                String(candidate.id);

              const candidateScreening =
                screenings.find(
                  (screening: any) =>
                    String(
                      screening.candidate_id ??
                        screening.candidateId
                    ) === candidateId
                );

              const extractedData =
                candidateScreening?.extracted_data ||
                candidateScreening?.extractedData ||
                candidate.extracted_data ||
                candidate.extractedData || {
                  name:
                    candidate.first_name ||
                    candidate.firstName ||
                    'Candidate',

                  surname:
                    candidate.last_name ||
                    candidate.lastName ||
                    '',

                  email:
                    candidate.email || '',

                  phone:
                    candidate.phone || '',

                  location:
                    candidate.location ||
                    'South Africa',

                  nationality:
                    candidate.nationality ||
                    'South African',

                  education: [],
                  qualifications: [],
                  certifications: [],
                  workExperience: [],
                  technicalSkills: [],
                  softSkills: [],
                  languages: ['English'],
                  totalYearsExperience: 0,
                  currentEmployer: '',
                  noticePeriodDays: 30,
                  expectedSalaryZar: 0,
                  availability: '',
                  referencesCount: 0,
                };

              const scores =
                candidateScreening?.scores || {
                  educationMatch: 0,
                  skillsMatch: 0,
                  experienceMatch: 0,
                  industryMatch: 0,
                  certificationMatch: 0,
                  leadershipExperience: 0,
                  communicationSkills: 0,
                  careerStability: 0,
                  employmentGapsScore: 0,
                  locationSuitability: 0,
                  salaryAlignment: 0,
                  availabilityScore: 0,
                  overallScore: 0,
                };

              const risks =
                candidateScreening?.risks || [];

              const summary =
                candidateScreening?.summary || {
                  headline:
                    'Candidate awaiting screening',

                  experienceOverview:
                    'No screening summary available yet.',

                  technicalAlignment:
                    'No technical alignment analysis available.',

                  leadershipAndSoftSkills:
                    'No leadership or soft-skill analysis available.',

                  salaryAndNoticeFit:
                    'No salary or notice analysis available.',

                  keyConcerns: [],

                  overallRecommendation:
                    'Potential Match - Further Info Needed',
                };

              const score =
                Number(
                  scores.overallScore || 0
                );

              let category: CandidateCategory =
                candidateScreening?.category ||
                'Potential';

              if (!candidateScreening?.category) {
                if (score >= 90) {
                  category = 'Excellent Match';
                } else if (score >= 80) {
                  category = 'Strong Match';
                } else if (score >= 65) {
                  category = 'Suitable';
                } else if (score >= 50) {
                  category = 'Potential';
                } else {
                  category = 'Not Suitable';
                }
              }

              return {
                id: candidateId,

                jobId: String(
                  candidate.vacancy_id ??
                    candidate.vacancyId ??
                    candidate.job_id ??
                    candidate.jobId ??
                    ''
                ),

                jobTitle:
                  candidate.job_title ||
                  candidate.jobTitle ||
                  'Unassigned Position',

                candidateId: String(
                  candidate.candidate_reference ??
                    candidate.candidateId ??
                    candidate.id
                ),

                source:
                  candidate.source ||
                  'Manual Upload',

                appliedDate:
                  candidate.applied_date ||
                  candidate.appliedDate ||
                  candidate.created_at ||
                  new Date().toISOString(),

                rawCvText:
                  candidate.raw_cv_text ||
                  candidate.rawCvText ||
                  '',

                coverLetterText:
                  candidate.cover_letter_text ||
                  candidate.coverLetterText ||
                  '',

                extractedData,
                scores,
                category,
                risks,
                summary,

                status:
                  candidate.status === 'interview'
                    ? 'Interview Scheduled'
                    : candidate.status || 'New',

                recruiterNotes:
                  candidate.recruiter_notes ||
                  candidate.recruiterNotes ||
                  '',

                isAnonymizedView: false,

                popiaConsent: {
                  consented:
                    candidate.popia_consent ??
                    candidate.popiaConsent ??
                    false,

                  timestamp:
                    candidate.popia_consent_timestamp ||
                    candidate.popiaConsentTimestamp ||
                    candidate.created_at ||
                    new Date().toISOString(),

                  ipAddress:
                    candidate.ip_address ||
                    candidate.ipAddress,
                },

                n8nPayload:
                  candidateScreening?.n8n_payload ||
                  candidateScreening?.n8nPayload,
              };
            }
          );

        setCandidates(mappedCandidates);

        // ========================================================
        // MAP INTERVIEWS
        // ========================================================

        const mappedInterviews: InterviewSlot[] =
          (interviewsResult.data || []).map(
            (interview: any) => ({
              id: String(interview.id),

              candidateId: String(
                interview.candidate_id ??
                  interview.candidateId ??
                  ''
              ),

              candidateName:
                interview.candidate_name ||
                interview.candidateName ||
                'Candidate',

              jobTitle:
                interview.job_title ||
                interview.jobTitle ||
                'Position',

              interviewerName:
                interview.interviewer_name ||
                interview.interviewerName ||
                'Hiring Panel',

              date:
                interview.date ||
                interview.scheduled_at ||
                '',

              startTime:
                interview.start_time ||
                interview.startTime ||
                '',

              endTime:
                interview.end_time ||
                interview.endTime ||
                '',

              meetingLink:
                interview.meeting_link ||
                interview.meetingLink ||
                '',

              status:
                interview.status ||
                'Proposed',

              icsContent:
                interview.ics_content ||
                interview.icsContent,
            })
          );

        setInterviews(mappedInterviews);

        // ========================================================
        // MAP AUDIT LOGS
        // ========================================================

        const mappedAuditLogs: AuditLogItem[] =
          (auditLogsResult.data || []).map(
            (log: any) => ({
              id: String(log.id),

              timestamp:
                log.created_at ||
                log.timestamp ||
                new Date().toISOString(),

              actor:
                log.actor || 'System',

              action:
                log.action ||
                'System Event',

              entityType:
                log.entity_type ||
                log.entityType ||
                'System',

              details:
                log.details || '',

              popiaReference:
                log.popia_reference ||
                log.popiaReference,
            })
          );

        setAuditLogs(mappedAuditLogs);

        console.log(
          'Aura Recruitment Flow AI successfully loaded data from Supabase.'
        );
      } catch (error: any) {
        console.error(
          'Supabase loading error:',
          error
        );

        setLoadError(
          error?.message ||
            'Failed to load data from Supabase.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadRecruitmentData();
  }, []);

  // ============================================================
  // ACTIVE NAVIGATION
  // ============================================================

  const [activeTab, setActiveTab] =
    useState<string>('dashboard');

  const [
    hasOpenedNotifications,
    setHasOpenedNotifications,
  ] = useState<boolean>(false);

  useEffect(() => {
    if (activeTab === 'notifications') {
      setHasOpenedNotifications(true);
    }
  }, [activeTab]);

  // ============================================================
  // POPIA ANONYMIZATION
  // ============================================================

  const [
    isAnonymizedView,
    setIsAnonymizedView,
  ] = useState<boolean>(false);

  // ============================================================
  // MODALS
  // ============================================================

  const [
    selectedCandidateModal,
    setSelectedCandidateModal,
  ] = useState<ApplicationRecord | null>(null);

  const [
    isOpenAddJobModal,
    setIsOpenAddJobModal,
  ] = useState<boolean>(false);

  const [
    isOpenAddCandidateModal,
    setIsOpenAddCandidateModal,
  ] = useState<boolean>(false);

  const [
    preselectedCommCandidate,
    setPreselectedCommCandidate,
  ] = useState<ApplicationRecord | null>(null);

  // ============================================================
  // NOTIFICATIONS
  // ============================================================

  const handleMarkNotifAsRead = (
    id: string
  ) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, read: !n.read }
          : n
      )
    );
  };

  const handleMarkAllNotifsAsRead =
    () => {
      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          read: true,
        }))
      );
    };

  const handleRemoveNotification = (
    id: string
  ) => {
    setNotifications((prev) =>
      prev.filter((n) => n.id !== id)
    );

    if (
      activeToastNotif &&
      activeToastNotif.id === id
    ) {
      setActiveToastNotif(null);
    }
  };

  const handleClearAllNotifications =
    () => {
      setNotifications([]);
      setActiveToastNotif(null);
    };

  const handleSimulateNotification = (
    presetCategory?: string
  ) => {
    const presets = [
      {
        icon: '📄',
        title:
          'New CV Application Ingested',
        detail:
          'Candidate Thabo Mokoena applied for Lead Data Engineer via Careers Portal.',
        badge: 'Ingestion',
        category: 'Ingestion' as const,
      },
      {
        icon: '🧠',
        title:
          'AI Screening Score Generated',
        detail:
          'Aura AI calculated 96% match score for Thabo Mokoena (High Suitability).',
        badge: 'Screening',
        category: 'Screening' as const,
      },
      {
        icon: '🛡️',
        title:
          'POPIA Compliance Certificate Issued',
        detail:
          'Digital consent signature & data retention logging verified for candidate.',
        badge: 'Compliance',
        category: 'Compliance' as const,
      },
      {
        icon: '📅',
        title:
          'Interview Slot Synchronized',
        detail:
          'Calendar invite sent to Hiring Panel for tomorrow at 10:00 AM.',
        badge: 'Calendar',
        category: 'Calendar' as const,
      },
      {
        icon: '🤝',
        title:
          'Automated Candidate Match',
        detail:
          'Candidate matched to Senior Full Stack Engineer vacancy.',
        badge: 'Matching',
        category: 'Matching' as const,
      },
    ];

    let chosen =
      presets[
        Math.floor(
          Math.random() * presets.length
        )
      ];

    if (presetCategory) {
      const match = presets.find(
        (p) =>
          p.category.toLowerCase() ===
          presetCategory.toLowerCase()
      );

      if (match) {
        chosen = match;
      }
    }

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      icon: chosen.icon,
      title: chosen.title,
      detail: chosen.detail,
      badge: chosen.badge,
      timestamp: 'Just now',
      read: false,
      category: chosen.category,
    };

    setNotifications((prev) => [
      newNotif,
      ...prev,
    ]);

    setActiveToastNotif(newNotif);
  };

  // ============================================================
  // AUDIT LOG
  // ============================================================

  const addAuditLog = (
    action: string,
    details: string
  ) => {
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,

      timestamp:
        new Date().toISOString(),

      actor:
        'Recruiter Admin (You)',

      action,
      details,

      popiaReference:
        `POPIA-${Math.floor(
          100000 +
            Math.random() * 900000
        )}`,
    };

    setAuditLogs((prev) => [
      newLog,
      ...prev,
    ]);
  };

  // ============================================================
  // ADD JOB
  // ============================================================

  const handleAddJob = async (
    newJob: JobProfile
  ) => {
    setJobs((prev) => [newJob, ...prev]);

    addAuditLog(
      'Job Profile Created',
      `Generated internal structured job profile for "${newJob.jobTitle}".`
    );

    if (!isSupabaseConfigured) {
      console.log(
        'Supabase not configured. Job stored in local application state only.'
      );
      return;
    }

    try {
      // Let Supabase generate the UUID. The UI may use IDs such as job-12345,
      // which are not valid UUIDs for the database primary key.
      const { data, error } = await supabase
        .from('vacancies')
        .insert({
          job_title: newJob.jobTitle,
          department: newJob.department,
          company: newJob.company,
          location: newJob.location,
          employment_type: newJob.employmentType,
          salary_min_zar: Number(newJob.salaryMinZar || 0),
          salary_max_zar: Number(newJob.salaryMaxZar || 0),
          required_skills: newJob.requiredSkills || [],
          preferred_skills: newJob.preferredSkills || [],
          minimum_experience_years: Number(
            newJob.minimumExperienceYears || 0
          ),
          qualifications: newJob.qualifications || [],
          job_description: newJob.jobDescription || '',
        })
        .select()
        .single();

      if (error) {
        console.error('Failed to save job to Supabase:', error);
        console.error('Supabase job error code:', error.code);
        console.error('Supabase job error details:', error.details);
        console.error('Supabase job error hint:', error.hint);
      } else {
        console.log('Job successfully saved to Supabase:', data);
      }
    } catch (error) {
      console.error('Supabase job save error:', error);
    }
  };

  // ============================================================
  // ADD CANDIDATE
  // ============================================================

  const handleAddCandidate = async (
    newCand: ApplicationRecord
  ) => {
    setCandidates((prev) => [newCand, ...prev]);

    setJobs((prev) =>
      prev.map((j) =>
        j.id === newCand.jobId
          ? {
              ...j,
              applicantCount: (j.applicantCount || 0) + 1,
            }
          : j
      )
    );

    const candidateName = newCand.extractedData
      ? `${newCand.extractedData.name} ${newCand.extractedData.surname}`.trim()
      : 'Candidate';

    addAuditLog(
      'Application Ingested & Screened',
      `Ingested CV for ${candidateName} (${newCand.jobTitle}). AI Score: ${newCand.scores?.overallScore || 0}%.`
    );

    if (!isSupabaseConfigured) {
      console.log(
        'Supabase not configured. Candidate stored in local application state only.'
      );
      setSelectedCandidateModal(newCand);
      return;
    }

    try {
      const databaseStatus = toDatabaseCandidateStatus(newCand.status);
      const vacancyUuid = nullableUuid(newCand.jobId);

      // IMPORTANT: do not send the UI/demo candidate ID to Supabase.
      // candidates.id is a UUID generated by the database.
      const { data: insertedCandidate, error: candidateError } =
        await supabase
          .from('candidates')
          .insert({
            vacancy_id: vacancyUuid,
            candidate_reference: newCand.candidateId || null,
            source: newCand.source || 'Manual Upload',
            applied_date: newCand.appliedDate || new Date().toISOString(),
            raw_cv_text: newCand.rawCvText || null,
            cover_letter_text: newCand.coverLetterText || null,
            status: databaseStatus,
            recruiter_notes: newCand.recruiterNotes || null,
            popia_consent: Boolean(newCand.popiaConsent?.consented),
            popia_consent_timestamp:
              newCand.popiaConsent?.timestamp || null,
            ip_address: newCand.popiaConsent?.ipAddress || null,
          })
          .select()
          .single();

      if (candidateError) {
        console.error('Failed to save candidate to Supabase:', candidateError);
        console.error('Candidate error code:', candidateError.code);
        console.error('Candidate error details:', candidateError.details);
        console.error('Candidate error hint:', candidateError.hint);
        setSelectedCandidateModal(newCand);
        return;
      }

      const candidateUuid = insertedCandidate?.id
        ? String(insertedCandidate.id)
        : null;

      if (!candidateUuid || !isUuid(candidateUuid)) {
        console.error(
          'Candidate was inserted but Supabase did not return a valid UUID:',
          insertedCandidate
        );
        setSelectedCandidateModal(newCand);
        return;
      }

      // Keep the UI record and the database record aligned.
      const uiCandidateId = newCand.id;
      const uiCandidateReference = newCand.candidateId;
      const persistedCandidate: ApplicationRecord = {
        ...newCand,
        id: candidateUuid,
        candidateId: candidateUuid,
      };

      setCandidates((prev) =>
        prev.map((candidate) =>
          candidate.id === uiCandidateId ||
          candidate.candidateId === uiCandidateReference
            ? persistedCandidate
            : candidate
        )
      );

      // ============================================================
      // SAVE SCREENING USING public.screenings SCHEMA
      // ============================================================
      const overallScore = Number(
        newCand.scores?.overallScore ?? 0
      );
      const recommendation = toScreeningRecommendation(overallScore);

      const strengths: string[] = [];
      const weaknesses: string[] = Array.isArray(
        newCand.summary?.keyConcerns
      )
        ? newCand.summary.keyConcerns
        : [];

      if (Number(newCand.scores?.skillsMatch ?? 0) >= 70) {
        strengths.push(
          `Technical skills alignment: ${Number(
            newCand.scores?.skillsMatch ?? 0
          )}%.`
        );
      }
      if (Number(newCand.scores?.experienceMatch ?? 0) >= 70) {
        strengths.push(
          `Experience alignment: ${Number(
            newCand.scores?.experienceMatch ?? 0
          )}%.`
        );
      }
      if (Number(newCand.scores?.educationMatch ?? 0) >= 70) {
        strengths.push(
          `Education alignment: ${Number(
            newCand.scores?.educationMatch ?? 0
          )}%.`
        );
      }
      if (newCand.extractedData?.technicalSkills?.length) {
        strengths.push(
          `Technical skills: ${newCand.extractedData.technicalSkills.join(', ')}.`
        );
      }

      const selectedJob = jobs.find(
        (job) => job.id === newCand.jobId
      );
      const candidateSkills = (
        newCand.extractedData?.technicalSkills || []
      ).map((skill) => skill.toLowerCase());
      const missingSkills =
        selectedJob?.requiredSkills?.filter(
          (skill) =>
            !candidateSkills.includes(skill.toLowerCase())
        ) || [];

      const riskFlags = (newCand.risks || []).map((risk) => ({
        id: risk.id,
        category: risk.category,
        severity: risk.severity,
        description: risk.description,
        mitigationSuggestion: risk.mitigationSuggestion,
      }));

      const aiSummary = newCand.summary
        ? [
            newCand.summary.headline,
            newCand.summary.experienceOverview,
            newCand.summary.technicalAlignment,
            newCand.summary.leadershipAndSoftSkills,
            newCand.summary.salaryAndNoticeFit,
          ]
            .filter(Boolean)
            .join('\n\n')
        : 'AI screening completed.';

      const { error: screeningError } = await supabase
        .from('screenings')
        .insert({
          candidate_id: candidateUuid,
          vacancy_id: vacancyUuid,
          ai_model: 'gemini-flash',
          match_score: overallScore,
          technical_score: Number(
            newCand.scores?.skillsMatch ?? 0
          ),
          experience_score: Number(
            newCand.scores?.experienceMatch ?? 0
          ),
          education_score: Number(
            newCand.scores?.educationMatch ?? 0
          ),
          confidence_score: null,
          strengths,
          weaknesses,
          missing_skills: missingSkills,
          risk_flags: riskFlags,
          ai_summary: aiSummary,
          recommendation,
        });

      if (screeningError) {
        console.error(
          'Failed to save candidate screening to Supabase:',
          screeningError
        );
        console.error('Screening error code:', screeningError.code);
        console.error('Screening error details:', screeningError.details);
        console.error('Screening error hint:', screeningError.hint);
      } else {
        console.log(
          'Successfully saved candidate screening to Supabase for ID:',
          candidateUuid
        );
      }

      setSelectedCandidateModal(persistedCandidate);
    } catch (error) {
      console.error('Supabase candidate save error:', error);
      setSelectedCandidateModal(newCand);
    }
  };

  // ============================================================
  // UPDATE CANDIDATE STATUS
  // ============================================================

  const handleUpdateCandidateStatus = (
    candidateId: string,
    newStatus: ApplicationStatus,
    notes?: string
  ) => {
    setCandidates((prev) =>
      prev.map((candidate) =>
        candidate.id === candidateId
          ? {
              ...candidate,
              status: newStatus,
              recruiterNotes:
                notes !== undefined
                  ? notes
                  : candidate.recruiterNotes,
            }
          : candidate
      )
    );

    const targetCandidate = candidates.find(
      (candidate) => candidate.id === candidateId
    );

    const candidateName = targetCandidate
      ? `${targetCandidate.extractedData.name} ${targetCandidate.extractedData.surname}`.trim()
      : candidateId;

    addAuditLog(
      'Recruiter Decision Enforced',
      `Updated candidate ${candidateName} status to "${newStatus}". Notes: ${
        notes || 'N/A'
      }`
    );

    if (
      selectedCandidateModal &&
      selectedCandidateModal.id === candidateId
    ) {
      setSelectedCandidateModal((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              recruiterNotes:
                notes !== undefined
                  ? notes
                  : prev.recruiterNotes,
            }
          : null
      );
    }

    if (!isSupabaseConfigured) return;

    // The browser may contain a local/demo candidate ID. Never send that to
    // a UUID primary key in Supabase.
    if (!isUuid(candidateId)) {
      console.warn(
        'Skipping Supabase candidate status update because candidate ID is not a UUID:',
        candidateId
      );
      return;
    }

    const databaseStatus = toDatabaseCandidateStatus(newStatus);
    const updatePayload: Record<string, unknown> = {
      status: databaseStatus,
    };

    if (notes !== undefined) {
      updatePayload.recruiter_notes = notes;
    }

    supabase
      .from('candidates')
      .update(updatePayload)
      .eq('id', candidateId)
      .then(({ error }) => {
        if (error) {
          console.error(
            'Failed to update candidate status in Supabase:',
            error
          );
          console.error('Status update code:', error.code);
          console.error('Status update details:', error.details);
          console.error('Status update hint:', error.hint);
        }
      });
  };

  // ============================================================
  // EMAIL
  // ============================================================

  const handleAddEmail = (
    newEmail: EmailCommunication
  ) => {
    setEmails((prev) => [
      newEmail,
      ...prev,
    ]);

    addAuditLog(
      'Communication Dispatched',
      `Sent ${newEmail.type} email to ${newEmail.candidateName}.`
    );
  };

  // ============================================================
  // INTERVIEW
  // ============================================================

  const handleAddInterview = async (
    newSlot: InterviewSlot
  ) => {
    setInterviews((prev) => [newSlot, ...prev]);

    handleUpdateCandidateStatus(
      newSlot.candidateId,
      'Interview Scheduled'
    );

    addAuditLog(
      'Interview Scheduled',
      `Scheduled interview for ${newSlot.candidateName} with ${newSlot.interviewerName}.`
    );

    if (!isSupabaseConfigured) {
      console.log(
        'Supabase not configured. Interview stored in local application state only.'
      );
      return;
    }

    if (!isUuid(newSlot.candidateId)) {
      console.warn(
        'Skipping Supabase interview insert because candidate ID is not a UUID:',
        newSlot.candidateId
      );
      return;
    }

    try {
      const candidate = candidates.find(
        (item) => item.id === newSlot.candidateId
      );

      const scheduledAt =
        newSlot.date && newSlot.startTime
          ? `${newSlot.date}T${newSlot.startTime}:00`
          : null;

      // Match the normalized interviews schema used by the application.
      const { error } = await supabase
        .from('interviews')
        .insert({
          candidate_id: newSlot.candidateId,
          vacancy_id: nullableUuid(candidate?.jobId),
          scheduled_at: scheduledAt,
          interviewer: newSlot.interviewerName,
          status: newSlot.status,
          notes: null,
        });

      if (error) {
        console.error(
          'Failed to save interview to Supabase:',
          error
        );
        console.error('Interview error code:', error.code);
        console.error('Interview error details:', error.details);
        console.error('Interview error hint:', error.hint);
      }
    } catch (error) {
      console.error('Supabase interview save error:', error);
    }
  };

  // ============================================================
  // NAVIGATION
  // ============================================================

  const handleNavigateToEmail = (
    cand: ApplicationRecord
  ) => {
    setPreselectedCommCandidate(cand);
    setActiveTab('communications');
  };

  const handleNavigateToInterview = (
    cand: ApplicationRecord
  ) => {
    setPreselectedCommCandidate(cand);
    setActiveTab('scheduling');
  };

  // ============================================================
  // NOTIFICATION COUNT
  // ============================================================

  const unreadNotifCount =
    notifications.filter(
      (n) => !n.read
    ).length;

  // ============================================================
  // LOADING SCREEN
  // ============================================================

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7FCFA] flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-slate-200 border-t-cyan-600 rounded-full animate-spin mx-auto mb-5" />

          <h2 className="text-lg font-bold text-slate-900">
            Loading Aura Recruitment Flow AI
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            Preparing your recruitment workspace...
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // DATABASE ERROR SCREEN
  // ============================================================

  if (loadError) {
    return (
      <div className="min-h-screen bg-[#F7FCFA] flex items-center justify-center p-6">
        <div className="max-w-xl w-full bg-white border border-red-200 rounded-2xl shadow-xl p-8">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mx-auto mb-5">
            !
          </div>

          <h2 className="text-xl font-bold text-slate-900 text-center">
            Database Connection Error
          </h2>

          <p className="text-sm text-slate-500 text-center mt-2">
            Aura Recruitment Flow AI could not load the recruitment data from Supabase.
          </p>

          <div className="mt-5 bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-xs font-mono text-red-700 break-words">
              {loadError}
            </p>
          </div>

          <button
            onClick={() =>
              window.location.reload()
            }
            className="mt-6 w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-xl transition"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
  // LANDING PAGE
  // ============================================================

  if (showLandingPage) {
    return (
      <AuraLandingPage
        onLaunchPlatform={() =>
          setShowLandingPage(false)
        }
      />
    );
  }

  // ============================================================
  // MAIN APPLICATION
  // ============================================================

  return (
    <div
      className={`min-h-screen font-sans antialiased flex flex-col selection:bg-cyan-500 selection:text-white relative overflow-x-hidden transition-colors duration-500 ${
        theme === 'cyber'
          ? 'bg-[#030712] text-slate-100 dark'
          : theme === 'horizon'
          ? 'bg-[#090D16] text-slate-100 dark'
          : 'bg-[#F7FCFA] text-slate-800'
      }`}
    >
      {/* Ambient Aura Background */}

      <div
        className={`fixed inset-0 pointer-events-none z-0 overflow-hidden transition-colors duration-700 ${
          theme === 'cyber'
            ? 'bg-[#030712]'
            : theme === 'horizon'
            ? 'bg-[#090D16]'
            : 'bg-[#F7FCFA]'
        }`}
        aria-hidden="true"
      >
        <div
          className={`absolute -top-40 -left-40 w-[800px] h-[800px] sm:w-[1000px] sm:h-[1000px] rounded-full blur-[160px] pointer-events-none transition-all duration-700 ${
            theme === 'cyber'
              ? 'bg-cyan-500/25 animate-pulse'
              : theme === 'horizon'
              ? 'bg-indigo-600/30'
              : 'bg-[#10B981]/[0.15]'
          }`}
        />

        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] sm:w-[1100px] sm:h-[1100px] rounded-full blur-[180px] pointer-events-none transition-all duration-700 ${
            theme === 'cyber'
              ? 'bg-purple-600/30'
              : theme === 'horizon'
              ? 'bg-amber-500/20'
              : 'bg-[#0EA5E9]/[0.12]'
          }`}
        />

        <div
          className={`absolute -bottom-40 -right-40 w-[800px] h-[800px] sm:w-[1000px] sm:h-[1000px] rounded-full blur-[160px] pointer-events-none transition-all duration-700 ${
            theme === 'cyber'
              ? 'bg-indigo-500/25'
              : theme === 'horizon'
              ? 'bg-fuchsia-600/25'
              : 'bg-[#059669]/[0.14]'
          }`}
        />
      </div>

      {/* 3D Background */}

      <Recruitment3DBackground
        activeNotification={
          activeToastNotif
        }
        onDismissNotification={() =>
          setActiveToastNotif(null)
        }
        onNavigateToNotifications={() =>
          setActiveTab('notifications')
        }
        hasOpenedNotifications={
          hasOpenedNotifications
        }
        currentTheme={theme}
      />

      {/* Header */}

      <Header
        isAnonymizedView={
          isAnonymizedView
        }
        setIsAnonymizedView={
          setIsAnonymizedView
        }
        activeVacancyCount={
          jobs.length
        }
        totalApplicantCount={
          candidates.length
        }
        unreadNotificationCount={
          unreadNotifCount
        }
        onOpenNotifications={() =>
          setActiveTab(
            'notifications'
          )
        }
        onOpenAddCandidate={() =>
          setIsOpenAddCandidateModal(
            true
          )
        }
        onOpenAddVacancy={() =>
          setIsOpenAddJobModal(true)
        }
        onShowLandingPage={() =>
          setShowLandingPage(true)
        }
        currentTheme={theme}
        onThemeChange={handleThemeChange}
      />

      {/* Navigation */}

      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadNotificationCount={
          unreadNotifCount
        }
        currentTheme={theme}
      />

      {/* Main */}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6 relative z-10">

        {/* DASHBOARD */}

        {activeTab === 'dashboard' && (
<Dashboard
  candidates={candidates}
  jobs={jobs}
  onSelectCandidate={(cand) =>
    setSelectedCandidateModal(cand)
  }
  onNavigateTab={(tab) =>
    setActiveTab(tab)
  }
  onOpenAddCandidate={() =>
    setIsOpenAddCandidateModal(true)
  }
  isAnonymizedView={isAnonymizedView}
/>
        )}

        {/* VACANCIES */}

        {activeTab === 'vacancies' && (
          <Vacancies
            jobs={jobs}
            onAddJob={handleAddJob}
            isOpenAddModal={
              isOpenAddJobModal
            }
            setIsOpenAddModal={
              setIsOpenAddJobModal
            }
          />
        )}

        {/* SCREENING WORKBENCH */}

        {activeTab === 'workbench' && (
          <ScreeningWorkbench
            candidates={candidates}
            jobs={jobs}
            onSelectCandidate={(cand) =>
              setSelectedCandidateModal(
                cand
              )
            }
            isAnonymizedView={
              isAnonymizedView
            }
          />
        )}

        {/* CANDIDATES */}

        {activeTab === 'candidates' && (
          <CandidatesList
            candidates={candidates}
            onSelectCandidate={(cand) =>
              setSelectedCandidateModal(
                cand
              )
            }
            onOpenAddCandidate={() =>
              setIsOpenAddCandidateModal(
                true
              )
            }
            isAnonymizedView={
              isAnonymizedView
            }
            onQuickActionEmail={
              handleNavigateToEmail
            }
            onQuickActionInterview={
              handleNavigateToInterview
            }
          />
        )}

        {/* COMMUNICATIONS */}

        {activeTab === 'communications' && (
          <Communications
            candidates={candidates}
            emails={emails}
            onAddEmail={
              handleAddEmail
            }
            preselectedCandidate={
              preselectedCommCandidate
            }
          />
        )}

        {/* SCHEDULING */}

        {activeTab === 'scheduling' && (
          <InterviewScheduler
            candidates={candidates}
            interviews={interviews}
            onAddInterview={
              handleAddInterview
            }
            preselectedCandidate={
              preselectedCommCandidate
            }
          />
        )}

        {/* ANALYTICS */}

        {activeTab === 'analytics' && (
          <AnalyticsView
            candidates={candidates}
          />
        )}

        {/* N8N */}

        {activeTab === 'n8n' && (
          <N8nWorkflowStudio
            candidates={candidates}
          />
        )}

        {/* POPIA */}

        {activeTab === 'popia' && (
          <PopiaAuditTrail
            auditLogs={auditLogs}
            candidates={candidates}
          />
        )}

        {/* NOTIFICATIONS */}

        {activeTab === 'notifications' && (
          <NotificationsPage
            notifications={
              notifications
            }
            onMarkAsRead={
              handleMarkNotifAsRead
            }
            onMarkAllAsRead={
              handleMarkAllNotifsAsRead
            }
            onRemoveNotification={
              handleRemoveNotification
            }
            onClearAll={
              handleClearAllNotifications
            }
            onSimulateNotification={
              handleSimulateNotification
            }
            onNavigateTab={(tab) =>
              setActiveTab(tab)
            }
          />
        )}
      </main>

      {/* Candidate Detail Modal */}

      {selectedCandidateModal && (
        <CandidateDetailModal
          candidate={
            selectedCandidateModal
          }
          onClose={() =>
            setSelectedCandidateModal(
              null
            )
          }
          onUpdateStatus={
            handleUpdateCandidateStatus
          }
          isAnonymizedView={
            isAnonymizedView
          }
          onNavigateToEmail={
            handleNavigateToEmail
          }
          onNavigateToInterview={
            handleNavigateToInterview
          }
        />
      )}

      {/* Add Candidate Modal */}

      {isOpenAddCandidateModal && (
        <AddCandidateModal
          jobs={jobs}
          onClose={() =>
            setIsOpenAddCandidateModal(
              false
            )
          }
          onAddCandidate={
            handleAddCandidate
          }
        />
      )}

      {/* Footer */}

      <footer className="border-t border-slate-200/80 bg-white/70 backdrop-blur-xl py-5 text-center text-xs text-slate-500 font-medium relative z-10 shadow-[0_-4px_20px_rgba(15,23,42,0.02)]">
        <p>
          Aura Recruitment Flow AI •
          Enterprise Recruitment
          Automation & Intelligence
          Platform • POPIA Compliant
        </p>
      </footer>
    </div>
  );
}

export default App;