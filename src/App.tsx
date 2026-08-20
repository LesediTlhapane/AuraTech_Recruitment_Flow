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
  LocationType,
  EmploymentType,
} from './types';
import { normalizeMonthlySalary } from './utils/vacancyUtils';

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
 * Database values confirmed from candidates_status_check:
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

/**
 * Maps interview status between application and Supabase constraint.
 * Database check constraint allows: 'scheduled', 'completed', 'cancelled', 'pending'
 */
const toDatabaseInterviewStatus = (
  status?: string | null
): 'scheduled' | 'completed' | 'cancelled' | 'pending' => {
  const norm = String(status || '').trim().toLowerCase();
  if (norm.includes('sched') || norm.includes('confirm') || norm.includes('accepted')) return 'scheduled';
  if (norm.includes('complete') || norm.includes('done') || norm.includes('finished')) return 'completed';
  if (norm.includes('cancel') || norm.includes('reject') || norm.includes('decline')) return 'cancelled';
  if (norm.includes('propos') || norm.includes('pend')) return 'pending';
  return 'scheduled';
};

const fromDatabaseInterviewStatus = (
  status?: string | null
): 'Confirmed' | 'Proposed' | 'Cancelled' | 'Completed' => {
  const norm = String(status || '').trim().toLowerCase();
  if (norm === 'completed') return 'Completed';
  if (norm === 'cancelled') return 'Cancelled';
  if (norm === 'pending') return 'Proposed';
  return 'Confirmed';
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
          notificationsResult,
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

          supabase
            .from('notifications')
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
          'Supabase vacancies count:',
          vacanciesResult.data?.length
        );

        console.log(
          'Supabase candidates count:',
          candidatesResult.data?.length
        );

        console.log(
          'Supabase screenings count:',
          screeningsResult.data?.length
        );

        console.log(
          'Supabase interviews count:',
          interviewsResult.data?.length
        );

        console.log(
          'Supabase audit logs count:',
          auditLogsResult.data?.length
        );

        // ========================================================
        // MAP VACANCIES
        // ========================================================

        const mappedJobs: JobProfile[] = (vacanciesResult.data || [])
          .filter((vacancy: any) => {
            const rawStatus = String(vacancy.status || '').toLowerCase();
            return (
              !rawStatus.includes('delete') &&
              !rawStatus.includes('archive') &&
              !vacancy.is_deleted
            );
          })
          .map((vacancy: any) => {
              const rawLocation = vacancy.location || 'South Africa';
              const rawLocLower = String(rawLocation).toLowerCase();
              const deducedLocationType: LocationType = vacancy.location_type || vacancy.locationType || (
                rawLocLower.includes('remote') ? 'Remote' : rawLocLower.includes('hybrid') ? 'Hybrid' : 'On-Site'
              );
              const cleanLocation = rawLocation.replace(/\s*\((Remote|Hybrid|On-Site|Onsite)\)/gi, '').trim() || rawLocation;

              const rawStatus = String(vacancy.status || 'Open').toLowerCase();
              const normalizedStatus = rawStatus.includes('pause') ? 'Paused' : 'Open';

              return {
                id: String(vacancy.id),

                jobTitle:
                  vacancy.job_title ||
                  vacancy.title ||
                  vacancy.jobTitle ||
                  'Untitled Position',

                department:
                  vacancy.department ||
                  'Technology & Engineering',

                company:
                  vacancy.company ||
                  'eStudy South Africa',

                location: cleanLocation || 'Pretoria',

                locationType: deducedLocationType,

                employmentType: (
                  vacancy.employment_type ||
                  vacancy.employmentType ||
                  'Full Time'
                ) as EmploymentType,

                salaryMinZar: normalizeMonthlySalary(
                  Number(
                    vacancy.salary_min_zar ??
                      vacancy.salaryMinZar ??
                      vacancy.salary_min ??
                      20000
                  )
                ),

                salaryMaxZar: normalizeMonthlySalary(
                  Number(
                    vacancy.salary_max_zar ??
                      vacancy.salaryMaxZar ??
                      vacancy.salary_max ??
                      28000
                  )
                ),

                requiredSkills:
                  Array.isArray(vacancy.required_skills)
                    ? vacancy.required_skills
                    : Array.isArray(vacancy.requiredSkills)
                    ? vacancy.requiredSkills
                    : typeof vacancy.required_skills === 'string'
                    ? vacancy.required_skills.split(',').map((s: string) => s.trim()).filter(Boolean)
                    : ['TypeScript', 'React'],

                preferredSkills:
                  Array.isArray(vacancy.preferred_skills)
                    ? vacancy.preferred_skills
                    : Array.isArray(vacancy.preferredSkills)
                    ? vacancy.preferredSkills
                    : typeof vacancy.preferred_skills === 'string'
                    ? vacancy.preferred_skills.split(',').map((s: string) => s.trim()).filter(Boolean)
                    : ['PostgreSQL'],

                minimumExperienceYears: Number(
                  vacancy.minimum_experience_years ??
                    vacancy.minimumExperienceYears ??
                    2
                ),

                qualifications:
                  Array.isArray(vacancy.qualifications)
                    ? vacancy.qualifications
                    : typeof vacancy.qualifications === 'string'
                    ? [vacancy.qualifications]
                    : ["Bachelor's Degree in Computer Science or related (NQF 7)"],

                jobDescription:
                  vacancy.job_description ||
                  vacancy.description ||
                  vacancy.jobDescription ||
                  '',

                closingDate:
                  vacancy.closing_date ||
                  vacancy.closingDate ||
                  '2026-09-30',

                createdDate:
                  vacancy.created_at ||
                  vacancy.createdDate ||
                  new Date().toISOString(),

                status: normalizedStatus,

                applicantCount: Number(
                  vacancy.applicant_count ??
                    vacancy.applicantCount ??
                    0
                ),
              };
            }
          );

        setJobs(mappedJobs);

        // ========================================================
        // MAP CANDIDATES + SCREENINGS
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

              const matchedVacancy = mappedJobs.find(
                (job) => job.id === String(candidate.vacancy_id ?? '')
              );

              const parsedSkills = Array.isArray(candidate.skills)
                ? candidate.skills
                : typeof candidate.skills === 'string'
                ? candidate.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
                : [];

              const extractedData = {
                name: candidate.first_name || candidate.firstName || 'Candidate',
                surname: candidate.last_name || candidate.lastName || '',
                email: candidate.email || '',
                phone: candidate.phone || '',
                location: candidate.location || 'South Africa',
                nationality: candidate.nationality || 'South African',
                education: candidate.education
                  ? [
                      {
                        degree: candidate.education,
                        institution: 'Accredited Institution',
                        fieldOfStudy: 'Computer Science & Engineering',
                        yearGraduated: 2021,
                        nqfLevelEquivalent: 'NQF Level 7',
                      },
                    ]
                  : [],
                qualifications: candidate.education ? [candidate.education] : [],
                certifications: candidate.certifications
                  ? Array.isArray(candidate.certifications)
                    ? candidate.certifications
                    : [String(candidate.certifications)]
                  : [],
                workExperience: [],
                technicalSkills: parsedSkills.length > 0 ? parsedSkills : ['React', 'TypeScript', 'Node.js'],
                softSkills: ['Communication', 'Leadership', 'Problem Solving'],
                languages: ['English'],
                totalYearsExperience: Number(candidate.experience_years ?? 5),
                currentEmployer: '',
                noticePeriodDays: 30,
                expectedSalaryZar: 900000,
                availability: '30 Days Notice',
                referencesCount: 2,
              };

              const overallScore = Number(candidateScreening?.match_score ?? 88);
              const technicalScore = Number(candidateScreening?.technical_score ?? 88);
              const experienceScore = Number(candidateScreening?.experience_score ?? 85);
              const educationScore = Number(candidateScreening?.education_score ?? 85);

              const scores = {
                educationMatch: educationScore,
                skillsMatch: technicalScore,
                experienceMatch: experienceScore,
                industryMatch: technicalScore,
                certificationMatch: educationScore,
                leadershipExperience: experienceScore,
                communicationSkills: 88,
                careerStability: 90,
                employmentGapsScore: 92,
                locationSuitability: 95,
                salaryAlignment: 88,
                availabilityScore: 90,
                overallScore: overallScore,
              };

              const rawRisks = candidateScreening?.risk_flags;
              const risks = Array.isArray(rawRisks)
                ? rawRisks.map((r: any, idx: number) => ({
                    id: r.id || `risk-${idx}`,
                    category: r.category || 'Career Stability',
                    severity: r.severity || 'Medium',
                    description: r.description || String(r),
                    mitigationSuggestion: r.mitigationSuggestion || 'Request clarification during interview.',
                  }))
                : [];

              const summaryText = candidateScreening?.ai_summary || '';
              const summaryParagraphs = summaryText.split('\n\n').filter(Boolean);

              const summary = {
                headline: summaryParagraphs[0] || `${extractedData.name} ${extractedData.surname} - Profile Screened`,
                experienceOverview: summaryParagraphs[1] || summaryText || `${extractedData.totalYearsExperience} years of proven industry experience aligned with role requirements.`,
                technicalAlignment: summaryParagraphs[2] || `Strong hands-on mastery in ${extractedData.technicalSkills.slice(0, 4).join(', ')}.`,
                leadershipAndSoftSkills: summaryParagraphs[3] || 'Demonstrates clear communication and team leadership capabilities.',
                salaryAndNoticeFit: summaryParagraphs[4] || 'Salary expectations and 30-day notice period fit role parameters.',
                keyConcerns: Array.isArray(candidateScreening?.weaknesses) ? candidateScreening.weaknesses : [],
                overallRecommendation: candidateScreening?.recommendation || (overallScore >= 90 ? 'ELITE' : overallScore >= 80 ? 'SHORTLIST' : 'REVIEW'),
              };

              let category: CandidateCategory = 'Potential';
              if (overallScore >= 90) {
                category = 'Excellent Match';
              } else if (overallScore >= 80) {
                category = 'Strong Match';
              } else if (overallScore >= 65) {
                category = 'Suitable';
              } else if (overallScore >= 50) {
                category = 'Potential';
              } else {
                category = 'Not Suitable';
              }

              return {
                id: candidateId,
                jobId: String(candidate.vacancy_id ?? ''),
                jobTitle: matchedVacancy?.jobTitle || candidate.job_title || 'Unassigned Position',
                candidateId: String(candidate.candidate_number ?? candidate.id),
                source: candidate.source || 'Careers Portal',
                appliedDate: candidate.created_at || new Date().toISOString(),
                rawCvText: candidate.resume_text || '',
                coverLetterText: '',
                extractedData,
                scores,
                category,
                risks,
                summary,
                status: candidate.status === 'interview' ? 'Interview Scheduled' : candidate.status === 'screening' ? 'Screened' : candidate.status || 'New',
                recruiterNotes: candidate.recruiter_notes || '',
                isAnonymizedView: false,
                popiaConsent: {
                  consented: candidate.consent_given ?? true,
                  timestamp: candidate.created_at || new Date().toISOString(),
                  ipAddress: '102.132.214.12',
                },
                n8nPayload: candidateScreening,
              };
            }
          );

        setCandidates(mappedCandidates);

        // Update applicant counts on jobs
        setJobs((prevJobs) =>
          prevJobs.map((j) => ({
            ...j,
            applicantCount: mappedCandidates.filter((c) => c.jobId === j.id).length,
          }))
        );

        // ========================================================
        // MAP INTERVIEWS
        // ========================================================

        const mappedInterviews: InterviewSlot[] =
          (interviewsResult.data || []).map(
            (interview: any) => {
              const matchedCandidate = mappedCandidates.find(
                (c) => c.id === String(interview.candidate_id ?? '')
              );
              const matchedVacancy = mappedJobs.find(
                (j) => j.id === String(interview.vacancy_id ?? '')
              );

              let dateStr = '';
              let timeStr = '10:00';
              let endTimeStr = '11:00';

              if (interview.scheduled_at) {
                const parsedDate = new Date(interview.scheduled_at);
                if (!isNaN(parsedDate.getTime())) {
                  dateStr = parsedDate.toISOString().split('T')[0];
                  timeStr = parsedDate.toTimeString().slice(0, 5);
                  const endParsed = new Date(parsedDate.getTime() + 60 * 60 * 1000);
                  endTimeStr = endParsed.toTimeString().slice(0, 5);
                }
              }

              return {
                id: String(interview.id),
                candidateId: String(interview.candidate_id ?? ''),
                candidateName: matchedCandidate
                  ? `${matchedCandidate.extractedData.name} ${matchedCandidate.extractedData.surname}`.trim()
                  : 'Candidate',
                jobTitle: matchedCandidate?.jobTitle || matchedVacancy?.jobTitle || 'Technical Interview',
                interviewerName: interview.interviewer || 'Hiring Panel',
                date: dateStr,
                startTime: timeStr,
                endTime: endTimeStr,
                meetingLink: interview.notes?.includes('http') ? interview.notes : `https://meet.google.com/aur-${String(interview.id).slice(0, 8)}`,
                status: fromDatabaseInterviewStatus(interview.status),
                icsContent: interview.ics_content || undefined,
              };
            }
          );

        setInterviews(mappedInterviews);

        // ========================================================
        // MAP AUDIT LOGS
        // ========================================================

        const mappedAuditLogs: AuditLogItem[] =
          (auditLogsResult.data || []).map(
            (log: any) => ({
              id: String(log.id),
              timestamp: log.created_at || new Date().toISOString(),
              actor: log.actor || 'Recruiter Admin (You)',
              action: log.action || log.event_type || 'POPIA Compliance Audit',
              entityType: log.event_type || 'System',
              details: log.details || `Audit event logged under POPIA Act 4 of 2013.`,
              popiaReference: `POPIA-ACT4-${String(log.id).slice(0, 6).toUpperCase()}`,
            })
          );

        setAuditLogs(mappedAuditLogs);

        // ========================================================
        // MAP NOTIFICATIONS
        // ========================================================

        if (notificationsResult.data && notificationsResult.data.length > 0) {
          const mappedNotifications: NotificationItem[] = notificationsResult.data.map((n: any) => ({
            id: String(n.id),
            icon: n.icon || (n.type === 'interview' ? '📅' : n.type === 'screening' ? '🧠' : n.type === 'compliance' ? '🛡️' : '📄'),
            title: n.title || 'System Notification',
            detail: n.message || n.detail || '',
            badge: n.badge || (n.type ? n.type.charAt(0).toUpperCase() + n.type.slice(1) : 'Alert'),
            timestamp: n.created_at ? new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent',
            read: Boolean(n.is_read || n.read),
            category: (n.category || (n.type === 'interview' ? 'Calendar' : n.type === 'screening' ? 'Screening' : n.type === 'compliance' ? 'Compliance' : 'Ingestion')) as any,
          }));
          setNotifications(mappedNotifications);
        }

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

    if (isSupabaseConfigured && isUuid(id)) {
      const target = notifications.find((n) => n.id === id);
      const newReadState = target ? !target.read : true;
      supabase
        .from('notifications')
        .update({ is_read: newReadState })
        .eq('id', id)
        .then(({ error }) => {
          if (error) {
            console.warn('Supabase notification status update:', error.message);
          }
        });
    }
  };

  const handleMarkAllNotifsAsRead =
    () => {
      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          read: true,
        }))
      );

      if (isSupabaseConfigured) {
        supabase
          .from('notifications')
          .update({ is_read: true })
          .neq('id', '00000000-0000-0000-0000-000000000000')
          .then(({ error }) => {
            if (error) {
              console.warn('Supabase mark all notifications read:', error.message);
            }
          });
      }
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

  const handleSimulateNotification = async (
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
        type: 'ingestion',
      },
      {
        icon: '🧠',
        title:
          'AI Screening Score Generated',
        detail:
          'Aura AI calculated 96% match score for Thabo Mokoena (High Suitability).',
        badge: 'Screening',
        category: 'Screening' as const,
        type: 'screening',
      },
      {
        icon: '🛡️',
        title:
          'POPIA Compliance Certificate Issued',
        detail:
          'Digital consent signature & data retention logging verified for candidate.',
        badge: 'Compliance',
        category: 'Compliance' as const,
        type: 'compliance',
      },
      {
        icon: '📅',
        title:
          'Interview Slot Synchronized',
        detail:
          'Calendar invite sent to Hiring Panel for tomorrow at 10:00 AM.',
        badge: 'Calendar',
        category: 'Calendar' as const,
        type: 'interview',
      },
      {
        icon: '🤝',
        title:
          'Automated Candidate Match',
        detail:
          'Candidate matched to Senior Full Stack Engineer vacancy.',
        badge: 'Matching',
        category: 'Matching' as const,
        type: 'matching',
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

    const tempId = `notif-${Date.now()}`;
    const newNotif: NotificationItem = {
      id: tempId,
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

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .insert({
            title: chosen.title,
            message: chosen.detail,
            type: chosen.type,
            is_read: false,
          })
          .select()
          .single();

        if (!error && data?.id) {
          setNotifications((prev) =>
            prev.map((item) =>
              item.id === tempId ? { ...item, id: String(data.id) } : item
            )
          );
        }
      } catch (err) {
        console.warn('Supabase notification insert warning:', err);
      }
    }
  };

  // ============================================================
  // AUDIT LOG
  // ============================================================

  const addAuditLog = async (
    action: string,
    details: string,
    candidateId?: string,
    eventType?: string
  ) => {
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: 'Recruiter Admin (You)',
      action,
      details,
      popiaReference: `POPIA-ACT4-${Math.floor(
        100000 + Math.random() * 900000
      )}`,
    };

    setAuditLogs((prev) => [newLog, ...prev]);

    if (!isSupabaseConfigured) return;

    try {
      const { error } = await supabase.from('audit_logs').insert({
        candidate_id: nullableUuid(candidateId),
        event_type: eventType || 'SYSTEM_EVENT',
        action: action,
        details: details,
      });

      if (error) {
        console.warn('Supabase audit log write warning:', error.message);
      }
    } catch (e) {
      console.warn('Supabase audit log error:', e);
    }
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
      `Generated internal structured job profile for "${newJob.jobTitle}".`,
      undefined,
      'JOB_CREATED'
    );

    if (!isSupabaseConfigured) {
      console.log(
        'Supabase not configured. Job stored in local application state only.'
      );
      return;
    }

    try {
      const locationToSave =
        newJob.locationType &&
        !newJob.location
          .toLowerCase()
          .includes(newJob.locationType.toLowerCase())
          ? `${newJob.location} (${newJob.locationType})`
          : newJob.location;

      const { data, error } = await supabase
        .from('vacancies')
        .insert({
          title: newJob.jobTitle,
          job_title: newJob.jobTitle,
          description: newJob.jobDescription || '',
          job_description: newJob.jobDescription || '',
          department: newJob.department,
          company: newJob.company,
          location: locationToSave,
          employment_type: newJob.employmentType || 'Full Time',
          salary_min_zar: Number(newJob.salaryMinZar || 0),
          salary_max_zar: Number(newJob.salaryMaxZar || 0),
          required_skills: newJob.requiredSkills || [],
          preferred_skills: newJob.preferredSkills || [],
          minimum_experience_years: Number(
            newJob.minimumExperienceYears || 0
          ),
          qualifications: newJob.qualifications || [],
          closing_date: newJob.closingDate || null,
          status: (newJob.status || 'open').toLowerCase(),
        })
        .select()
        .single();

      if (error) {
        console.error('Failed to save job to Supabase:', error);
      } else {
        console.log('Job successfully saved to Supabase:', data);
        if (data?.id) {
          const supabaseId = String(data.id);
          setJobs((prev) =>
            prev.map((j) => (j.id === newJob.id ? { ...j, id: supabaseId } : j))
          );
        }
      }
    } catch (error) {
      console.error('Supabase job save error:', error);
    }
  };

  // ============================================================
  // UPDATE JOB
  // ============================================================

  const handleUpdateJob = async (
    updatedJob: JobProfile
  ) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === updatedJob.id ? updatedJob : j))
    );

    addAuditLog(
      'Job Profile Updated',
      `Updated parameters, requirements, and salary brackets for "${updatedJob.jobTitle}".`,
      undefined,
      'JOB_UPDATED'
    );

    if (!isSupabaseConfigured) return;

    try {
      const vacancyUuid = nullableUuid(updatedJob.id);
      if (!vacancyUuid) {
        console.log('Job ID is not a database UUID; updated local state.');
        return;
      }

      const locationToSave =
        updatedJob.locationType &&
        !updatedJob.location
          .toLowerCase()
          .includes(updatedJob.locationType.toLowerCase())
          ? `${updatedJob.location} (${updatedJob.locationType})`
          : updatedJob.location;

      const { error } = await supabase
        .from('vacancies')
        .update({
          title: updatedJob.jobTitle,
          job_title: updatedJob.jobTitle,
          description: updatedJob.jobDescription || '',
          job_description: updatedJob.jobDescription || '',
          department: updatedJob.department,
          company: updatedJob.company,
          location: locationToSave,
          employment_type: updatedJob.employmentType || 'Full Time',
          salary_min_zar: Number(updatedJob.salaryMinZar || 0),
          salary_max_zar: Number(updatedJob.salaryMaxZar || 0),
          required_skills: updatedJob.requiredSkills || [],
          preferred_skills: updatedJob.preferredSkills || [],
          minimum_experience_years: Number(
            updatedJob.minimumExperienceYears || 0
          ),
          qualifications: updatedJob.qualifications || [],
          closing_date: updatedJob.closingDate || null,
          status: (updatedJob.status || 'open').toLowerCase(),
        })
        .eq('id', vacancyUuid);

      if (error) {
        console.error('Failed to update job in Supabase:', error);
      } else {
        console.log('Job successfully updated in Supabase:', updatedJob.id);
      }
    } catch (error) {
      console.error('Supabase job update error:', error);
    }
  };

  // ============================================================
  // DELETE JOB
  // ============================================================

  const handleDeleteJob = async (
    jobId: string
  ) => {
    const targetJob = jobs.find((j) => j.id === jobId);
    setJobs((prev) => prev.filter((j) => j.id !== jobId));

    // Also update any candidates linked to this vacancy in local state
    setCandidates((prev) =>
      prev.map((c) =>
        c.jobId === jobId
          ? { ...c, jobTitle: `${c.jobTitle || 'Role'} (Archived Vacancy)` }
          : c
      )
    );

    addAuditLog(
      'Job Profile Deleted',
      `Removed vacancy profile "${targetJob?.jobTitle || jobId}" from active database.`,
      undefined,
      'JOB_DELETED'
    );

    if (!isSupabaseConfigured) return;

    try {
      const vacancyUuid = nullableUuid(jobId);
      if (!vacancyUuid) {
        console.log('Job ID is not a database UUID; deleted from local state.');
        return;
      }

      // Step 1: Clean up child dependencies in Supabase to avoid Foreign Key violations
      try {
        await supabase.from('interviews').delete().eq('vacancy_id', vacancyUuid);
      } catch (fkErr) {
        console.warn('Interviews cleanup notice:', fkErr);
      }

      try {
        await supabase.from('screenings').delete().eq('vacancy_id', vacancyUuid);
      } catch (fkErr) {
        console.warn('Screenings cleanup notice:', fkErr);
      }

      // Step 2: Attempt direct hard delete on vacancies
      const { error: deleteError } = await supabase
        .from('vacancies')
        .delete()
        .eq('id', vacancyUuid);

      if (deleteError) {
        console.warn('Direct DELETE on vacancies encountered policy or constraint, applying soft-delete fallback:', deleteError);

        // Step 3: Resilient Soft-Delete Fallback (sets status to deleted so it never loads again)
        const { error: updateError } = await supabase
          .from('vacancies')
          .update({
            status: 'deleted',
            closing_date: new Date().toISOString(),
          })
          .eq('id', vacancyUuid);

        if (updateError) {
          console.error('Failed to update vacancy status to deleted:', updateError);
        } else {
          console.log('Vacancy successfully marked as deleted in Supabase.');
        }
      } else {
        console.log('Job successfully deleted from Supabase:', jobId);
      }
    } catch (error) {
      console.error('Supabase job delete error:', error);
    }
  };

  // ============================================================
  // TOGGLE PAUSE JOB
  // ============================================================

  const handleTogglePauseJob = async (
    jobId: string
  ) => {
    let newStatus: 'Open' | 'Paused' = 'Paused';
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          newStatus = j.status === 'Paused' ? 'Open' : 'Paused';
          return { ...j, status: newStatus };
        }
        return j;
      })
    );

    const targetJob = jobs.find((j) => j.id === jobId);
    addAuditLog(
      newStatus === 'Paused' ? 'Job Profile Paused' : 'Job Profile Resumed',
      `Changed vacancy status for "${targetJob?.jobTitle || jobId}" to ${newStatus}.`,
      undefined,
      'JOB_STATUS_CHANGE'
    );

    if (!isSupabaseConfigured) return;

    try {
      const vacancyUuid = nullableUuid(jobId);
      if (!vacancyUuid) return;

      const { error } = await supabase
        .from('vacancies')
        .update({ status: newStatus.toLowerCase() })
        .eq('id', vacancyUuid);

      if (error) {
        console.error('Failed to toggle pause status in Supabase:', error);
      }
    } catch (error) {
      console.error('Supabase toggle pause error:', error);
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
      `Ingested CV for ${candidateName} (${newCand.jobTitle}). AI Score: ${newCand.scores?.overallScore || 0}%.`,
      undefined,
      'SCREENING'
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

      const skillsArray = newCand.extractedData?.technicalSkills || [];
      const primaryEdu = newCand.extractedData?.education?.[0]?.degree || newCand.extractedData?.qualifications?.[0] || 'Bachelor of Science';
      const primaryCerts = Array.isArray(newCand.extractedData?.certifications) ? newCand.extractedData.certifications.join(', ') : '';

      const { data: insertedCandidate, error: candidateError } =
        await supabase
          .from('candidates')
          .insert({
            vacancy_id: vacancyUuid,
            first_name: newCand.extractedData?.name || 'Candidate',
            last_name: newCand.extractedData?.surname || '',
            email: newCand.extractedData?.email || '',
            phone: newCand.extractedData?.phone || '',
            resume_text: newCand.rawCvText || '',
            skills: skillsArray,
            experience_years: Number(newCand.extractedData?.totalYearsExperience || 0),
            education: primaryEdu,
            certifications: primaryCerts,
            status: databaseStatus,
            consent_given: Boolean(newCand.popiaConsent?.consented),
          })
          .select()
          .single();

      if (candidateError) {
        console.error('Failed to save candidate to Supabase:', candidateError);
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
      const persistedCandidate: ApplicationRecord = {
        ...newCand,
        id: candidateUuid,
        candidateId: candidateUuid,
      };

      setCandidates((prev) =>
        prev.map((candidate) =>
          candidate.id === uiCandidateId
            ? persistedCandidate
            : candidate
        )
      );

      // ============================================================
      // SAVE SCREENING USING public.screenings SCHEMA
      // ============================================================
      const overallScore = Number(
        newCand.scores?.overallScore ?? 88
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
            newCand.scores?.skillsMatch ?? 85
          ),
          experience_score: Number(
            newCand.scores?.experienceMatch ?? 80
          ),
          education_score: Number(
            newCand.scores?.educationMatch ?? 80
          ),
          confidence_score: 95,
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
      } else {
        console.log(
          'Successfully saved candidate screening to Supabase for ID:',
          candidateUuid
        );
      }

      addAuditLog(
        'AI Candidate Screening Evaluated',
        `Automated 12-factor evaluation complete for ${candidateName}. Overall score: ${overallScore}%. Classification: ${newCand.category}.`,
        candidateUuid,
        'SCREENING'
      );

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
      }`,
      candidateId,
      'RECRUITER_DECISION'
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
      `Sent ${newEmail.type} email to ${newEmail.candidateName}.`,
      newEmail.candidateId,
      'COMMUNICATION'
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
      `Scheduled interview for ${newSlot.candidateName} with ${newSlot.interviewerName} on ${newSlot.date} at ${newSlot.startTime}.`,
      newSlot.candidateId,
      'INTERVIEW_SCHEDULED'
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
          : new Date().toISOString();

      const { error } = await supabase
        .from('interviews')
        .insert({
          candidate_id: newSlot.candidateId,
          vacancy_id: nullableUuid(candidate?.jobId),
          scheduled_at: scheduledAt,
          interviewer: newSlot.interviewerName || 'Hiring Panel',
          status: toDatabaseInterviewStatus(newSlot.status),
          notes: newSlot.meetingLink ? `Meeting Link: ${newSlot.meetingLink}` : null,
        });

      if (error) {
        console.error(
          'Failed to save interview to Supabase:',
          error
        );
      } else {
        console.log('Successfully saved interview to Supabase for candidate:', newSlot.candidateId);
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
            onOpenAddJob={() =>
              setIsOpenAddJobModal(true)
            }
            onUpdateJob={handleUpdateJob}
            onDeleteJob={handleDeleteJob}
            onTogglePauseJob={handleTogglePauseJob}
            isAnonymizedView={isAnonymizedView}
          />
        )}

        {/* VACANCIES */}

        {activeTab === 'vacancies' && (
          <Vacancies
            jobs={jobs}
            onAddJob={handleAddJob}
            onUpdateJob={handleUpdateJob}
            onDeleteJob={handleDeleteJob}
            onTogglePauseJob={handleTogglePauseJob}
            onNavigateToWorkbench={(jobId) => {
              setActiveTab('workbench');
            }}
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