
import { JobProfile, ApplicationRecord, EmailCommunication, InterviewSlot, AuditLogItem, NotificationItem } from '../types';

export const initialJobs: JobProfile[] = [
  {
    id: 'job-101',
    jobTitle: 'Software Developer',
    department: 'Technology & Software Development',
    company: 'eStudy South Africa',
    location: 'Johannesburg, Gauteng (Hybrid)',
    employmentType: 'Full-time',
    salaryMinZar: 650000,
    salaryMaxZar: 880000,
    requiredSkills: ['JavaScript', 'TypeScript', 'React', 'HTML / CSS', 'REST APIs', 'Git / GitHub', 'Database Experience', 'Debugging & Troubleshooting', 'Responsive Web Development', 'Agile Development'],
    preferredSkills: ['Python', 'Node.js', 'Flutter / Dart', 'Firebase', 'Supabase', 'MySQL', 'AI / Generative AI', 'API Integrations', 'Docker', 'CI/CD'],
    minimumExperienceYears: 3,
    qualifications: ['BSc Computer Science / BCom Information Systems / BTech IT / Diploma in IT (NQF Level 7)'],
    jobDescription: `eStudy South Africa is seeking a talented Software Developer to join our Technology & Software Development team in Johannesburg. In this role, you will build and maintain web-based education and learning technology platforms, internal management systems, and digital solutions serving thousands of learners across South Africa. You will collaborate closely with product managers, learning designers, UI/UX designers, and business stakeholders.

Key Responsibilities:
- Develop and maintain responsive web applications and e-learning platform features using React, TypeScript, and modern HTML/CSS.
- Build, optimize, and integrate RESTful APIs and database connections.
- Perform robust debugging, code reviews, and troubleshooting across web services.
- Utilize Git/GitHub for version control and collaborative agile workflows.
- Integrate AI services and automated learning features into digital course delivery engines.
- Ensure POPIA compliance and strict data privacy for learner and institution records.`,
    closingDate: '2026-09-30',
    createdDate: '2026-08-01',
    status: 'Open',
    applicantCount: 14
  },
  {
    id: 'job-102',
    jobTitle: 'Learning Designer / Instructional Designer',
    department: 'Learning & Development',
    company: 'eStudy South Africa',
    location: 'Johannesburg, Gauteng (Hybrid)',
    employmentType: 'Full-time',
    salaryMinZar: 480000,
    salaryMaxZar: 680000,
    requiredSkills: ['Instructional Design', 'Learning Design', 'Curriculum Development', 'E-learning', 'Adult Learning Principles', 'Storyboarding', 'Assessment Design', 'LMS Experience', 'Content Development', 'Stakeholder Collaboration'],
    preferredSkills: ['Articulate Storyline', 'Articulate Rise', 'Canva', 'AI-Assisted Content Creation', 'Generative AI', 'Microlearning', 'ADDIE / SAM', 'Learning Analytics'],
    minimumExperienceYears: 3,
    qualifications: ['BA Education / BEd / Postgraduate Diploma in Education / Honours in Education / Industrial Psychology (NQF 7/8)'],
    jobDescription: `eStudy South Africa is looking for an innovative Learning Designer / Instructional Designer to join our Learning & Development department in Johannesburg. You will design engaging digital learning experiences, interactive courseware, and blended learning solutions working alongside subject matter experts and technology teams.

Key Responsibilities:
- Design and storyboard interactive e-learning modules, microlearning assets, and digital assessments using adult learning principles (ADDIE/SAM).
- Develop course materials using authoring tools (Articulate Rise/Storyline) and AI-assisted content creation platforms.
- Manage and upload learning content onto Learning Management Systems (LMS) and monitor learner analytics.
- Collaborate with subject matter experts, software developers, and video producers to deliver high-quality educational programmes.
- Review and continuously refine course curricula based on learner performance data and stakeholder feedback.`,
    closingDate: '2026-09-25',
    createdDate: '2026-08-03',
    status: 'Open',
    applicantCount: 10
  },
  {
    id: 'job-103',
    jobTitle: 'HR & Recruitment Specialist',
    department: 'Human Resources & Talent Acquisition',
    company: 'eStudy South Africa',
    location: 'Johannesburg, Gauteng (Hybrid)',
    employmentType: 'Full-time',
    salaryMinZar: 420000,
    salaryMaxZar: 600000,
    requiredSkills: ['Recruitment & Talent Acquisition', 'Candidate Sourcing', 'CV Screening', 'Interview Coordination', 'HR Administration', 'Employee Onboarding', 'Stakeholder Management', 'Employment Documentation', 'POPIA Awareness', 'HRIS'],
    preferredSkills: ['Applicant Tracking Systems (ATS)', 'LinkedIn Recruiter', 'Recruitment Analytics', 'Employer Branding', 'South African Labour Practices', 'Talent Pipeline Management', 'Employee Engagement'],
    minimumExperienceYears: 3,
    qualifications: ['Bachelor of Human Resource Management / Diploma in HR / Industrial Psychology / BCom HR (NQF 6/7)'],
    jobDescription: `eStudy South Africa requires an experienced HR & Recruitment Specialist to join our Human Resources & Talent Acquisition team in Johannesburg. You will support end-to-end recruitment processes, candidate sourcing, interview scheduling, employee onboarding, and HR administration across technology, learning design, and operational teams.

Key Responsibilities:
- Coordinate full-cycle recruitment including job posting, CV screening, candidate sourcing, and interview scheduling.
- Manage Applicant Tracking System (ATS) records and ensure full POPIA compliance in candidate data handling.
- Prepare employment contracts, onboarding documentation, and conduct orientation sessions for new eStudy employees.
- Partner with hiring managers across technology and education teams to define staffing needs and candidate profiles.
- Maintain accurate HRIS data, recruitment metrics, and talent pipelines for current and future vacancies.`,
    closingDate: '2026-09-20',
    createdDate: '2026-08-05',
    status: 'Open',
    applicantCount: 16
  }
];

export const initialApplicants: ApplicationRecord[] = [
  {
    id: 'cand-001',
    jobId: 'job-101',
    jobTitle: 'Software Developer',
    candidateId: 'cand-001',
    source: 'LinkedIn',
    appliedDate: '2026-08-04T09:15:00Z',
    rawCvText: `SIPHO NDLOVU
Johannesburg, Gauteng | +27 82 451 0192 | sipho.ndlovu@candidate-demo.co.za | linkedin.com/in/siphondlovu
SUMMARY:
Full Stack Software Developer with 5 years of experience building web-based learning platforms and enterprise REST APIs in South Africa. Proven track record in React, TypeScript, Node.js, and integrating Generative AI features into educational software.

EXPERIENCE:
Software Developer | EduTech Innovations SA, Johannesburg | Jan 2022 - Present
- Developed web-based learner management dashboards using React, TypeScript, and Tailwind CSS.
- Designed and maintained Node.js / Express RESTful APIs connected to MySQL databases.
- Integrated AI content summarization microservices to generate automated learning summaries.
- Collaborated in agile sprints with learning designers, UI designers, and QA engineers using Git/GitHub.

Junior Developer | Campus Systems SA, Pretoria | Mar 2019 - Dec 2021
- Built responsive HTML/CSS and JavaScript user portals for tertiary student registration.
- Assisted with database query optimization and API endpoint debugging.

EDUCATION:
BSc in Computer Science | University of the Witwatersrand (Wits) | Graduated 2018 (NQF Level 7)

SKILLS: JavaScript, TypeScript, React, HTML/CSS, REST APIs, Node.js, MySQL, Git/GitHub, Generative AI APIs, Agile.
CERTIFICATIONS: AWS Certified Developer Associate
NOTICE PERIOD: 30 Days (1 Month)
EXPECTED SALARY: R750,000 per annum`,
    coverLetterText: 'Dear Hiring Manager, I am writing to express my enthusiastic interest in the Software Developer role at eStudy South Africa. Having spent the last 5 years building digital learning solutions and web platforms in Gauteng...',
    extractedData: {
      name: 'Sipho',
      surname: 'Ndlovu',
      email: 'sipho.ndlovu@candidate-demo.co.za',
      phone: '+27 82 451 0192',
      location: 'Johannesburg, Gauteng',
      nationality: 'South African',
      education: [
        {
          degree: 'BSc in Computer Science',
          institution: 'University of the Witwatersrand (Wits)',
          fieldOfStudy: 'Computer Science',
          yearGraduated: 2018,
          nqfLevelEquivalent: 'NQF Level 7'
        }
      ],
      qualifications: ['BSc Computer Science (Wits)'],
      certifications: ['AWS Certified Developer Associate'],
      workExperience: [
        {
          title: 'Software Developer',
          company: 'EduTech Innovations SA',
          durationMonths: 55,
          startDate: '2022-01',
          endDate: 'Present',
          keyResponsibilities: ['Built React & TS learning portals', 'Developed Node.js APIs', 'Integrated GenAI summaries'],
          achievements: ['Delivered core LMS dashboard serving 20,000+ learners']
        },
        {
          title: 'Junior Developer',
          company: 'Campus Systems SA',
          durationMonths: 34,
          startDate: '2019-03',
          endDate: '2021-12',
          keyResponsibilities: ['Built web portals with JS & HTML/CSS', 'Database query debugging'],
          achievements: ['Streamlined student registration flow']
        }
      ],
      technicalSkills: ['JavaScript', 'TypeScript', 'React', 'HTML / CSS', 'REST APIs', 'Node.js', 'MySQL', 'Git / GitHub', 'AI / Generative AI', 'Agile Development'],
      softSkills: ['Collaborative Problem Solving', 'Agile Teamwork', 'Technical Documentation'],
      languages: ['English', 'isiZulu'],
      totalYearsExperience: 5.0,
      currentEmployer: 'EduTech Innovations SA',
      noticePeriodDays: 30,
      expectedSalaryZar: 750000,
      availability: '30 Days Notice',
      linkedInUrl: 'https://linkedin.com/in/siphondlovu',
      portfolioUrl: 'https://siphondlovu.dev',
      referencesCount: 2
    },
    scores: {
      educationMatch: 95,
      skillsMatch: 96,
      experienceMatch: 94,
      industryMatch: 95,
      certificationMatch: 90,
      leadershipExperience: 85,
      communicationSkills: 94,
      careerStability: 96,
      employmentGapsScore: 100,
      locationSuitability: 100,
      salaryAlignment: 95,
      availabilityScore: 90,
      overallScore: 94
    },
    category: 'Excellent Match',
    risks: [],
    summary: {
      headline: 'Outstanding Software Developer with 5 Years EdTech & React/TypeScript Experience',
      experienceOverview: 'Sipho has 5 years of hands-on software engineering experience building web-based learning management portals and RESTful APIs.',
      technicalAlignment: 'Perfect alignment with eStudy stack: React, TypeScript, Node.js, REST APIs, MySQL, Git, and GenAI API integrations.',
      leadershipAndSoftSkills: 'Strong collaborative skills working with learning designers, product managers, and agile engineering squads.',
      salaryAndNoticeFit: 'Expected salary R750k fits comfortably within the R650k-R880k budget. 30-day notice.',
      keyConcerns: [],
      overallRecommendation: 'Strong Interview Candidate'
    },
    status: 'Shortlisted',
    recruiterNotes: 'Exceptional technical match from Wits with solid digital learning platform background. Fast-track to technical panel.',
    popiaConsent: {
      consented: true,
      timestamp: '2026-08-04T09:15:00Z',
      ipAddress: '102.132.214.12'
    },
    n8nPayload: {
      step3_extraction: {
        status: 'SUCCESS',
        timestamp: '2026-08-04T09:15:10Z',
        confidence: 0.98,
        reasoning: 'CV text cleanly parsed into structured candidate JSON with high entity accuracy.',
        recommendation: 'Proceed to automated scoring matrix.',
        data: {
          name: 'Sipho',
          surname: 'Ndlovu',
          email: 'sipho.ndlovu@candidate-demo.co.za',
          phone: '+27 82 451 0192',
          location: 'Johannesburg, Gauteng',
          nationality: 'South African',
          education: [{ degree: 'BSc Computer Science', institution: 'Wits', fieldOfStudy: 'Computer Science' }],
          qualifications: ['BSc Computer Science'],
          certifications: ['AWS Certified Developer'],
          workExperience: [],
          technicalSkills: ['JavaScript', 'TypeScript', 'React', 'HTML / CSS', 'REST APIs', 'Node.js', 'MySQL', 'Git / GitHub', 'AI / Generative AI'],
          softSkills: ['Problem Solving', 'Agile'],
          languages: ['English', 'isiZulu'],
          totalYearsExperience: 5.0,
          currentEmployer: 'EduTech Innovations SA',
          noticePeriodDays: 30,
          expectedSalaryZar: 750000,
          availability: '30 Days',
          referencesCount: 2
        }
      },
      step4_scoring: {
        status: 'SUCCESS',
        timestamp: '2026-08-04T09:15:12Z',
        confidence: 0.96,
        reasoning: 'Evaluated candidate against Job ID job-101 (Software Developer) requirements using Aura semantic reasoning engine.',
        recommendation: 'Top Tier Candidate. Recommend immediate technical interview.',
        data: {
          educationMatch: 95,
          skillsMatch: 96,
          experienceMatch: 94,
          industryMatch: 95,
          certificationMatch: 90,
          leadershipExperience: 85,
          communicationSkills: 94,
          careerStability: 96,
          employmentGapsScore: 100,
          locationSuitability: 100,
          salaryAlignment: 95,
          availabilityScore: 90,
          overallScore: 94
        }
      },
      step5_riskanalysis: {
        status: 'SUCCESS',
        timestamp: '2026-08-04T09:15:13Z',
        confidence: 0.99,
        reasoning: 'No employment gaps, skill deficiencies, or location mismatches detected.',
        recommendation: 'Low Risk Profile.',
        data: []
      },
      step6_summary: {
        status: 'SUCCESS',
        timestamp: '2026-08-04T09:15:15Z',
        confidence: 0.97,
        reasoning: 'Executive summary created successfully for recruiter review.',
        recommendation: 'Strong Interview Candidate',
        data: {
          headline: 'Outstanding Software Developer with 5 Years EdTech & React/TypeScript Experience',
          experienceOverview: 'Sipho has 5 years of software engineering experience in EdTech.',
          technicalAlignment: 'Flawless stack alignment with React, TypeScript, Node.js, and APIs.',
          leadershipAndSoftSkills: 'Agile squad collaboration skills.',
          salaryAndNoticeFit: 'R750k salary expectation within R650k-R880k budget.',
          keyConcerns: [],
          overallRecommendation: 'Strong Interview Candidate'
        }
      }
    }
  },
  {
    id: 'cand-002',
    jobId: 'job-101',
    jobTitle: 'Software Developer',
    candidateId: 'cand-002',
    source: 'Careers Website',
    appliedDate: '2026-08-05T11:20:00Z',
    rawCvText: `LIEZEL VAN DER MERWE
Pretoria, Gauteng | +27 83 312 8890 | liezel.vdm@talent-demo.co.za
SUMMARY:
Web Software Developer with 4 years of experience delivering database-driven web solutions, REST APIs, and backend integrations in Gauteng. Strong academic qualification with solid JavaScript, HTML/CSS, SQL, and C# knowledge.

WORK EXPERIENCE:
Software Developer | Digital Core SA, Centurion | Jan 2022 - Present
- Developed web services and SQL database architecture for enterprise clients.
- Built client-side interfaces using vanilla JavaScript, HTML5, CSS3, and Bootstrap.
- Debugged and maintained RESTful API endpoints and version control in Git.

Junior Web Developer | Apex Systems, Pretoria | Jan 2020 - Dec 2021
- Maintained internal portal web pages and created automated SQL data reports.

EDUCATION:
BTech Information Technology | Tshwane University of Technology (TUT) | Graduated 2019 (NQF Level 7)
CERTIFICATIONS: Microsoft Certified: Azure Fundamentals
NOTICE PERIOD: 30 Days
EXPECTED SALARY: R700,000 per annum`,
    coverLetterText: 'Dear Selection Committee, Having spent 4 years developing software and web applications in Gauteng...',
    extractedData: {
      name: 'Liezel',
      surname: 'van der Merwe',
      email: 'liezel.vdm@talent-demo.co.za',
      phone: '+27 83 312 8890',
      location: 'Pretoria, Gauteng',
      nationality: 'South African',
      education: [
        {
          degree: 'BTech Information Technology',
          institution: 'Tshwane University of Technology (TUT)',
          fieldOfStudy: 'IT Software Development',
          yearGraduated: 2019,
          nqfLevelEquivalent: 'NQF Level 7'
        }
      ],
      qualifications: ['BTech Information Technology (TUT)'],
      certifications: ['Microsoft Certified: Azure Fundamentals'],
      workExperience: [
        {
          title: 'Software Developer',
          company: 'Digital Core SA',
          durationMonths: 55,
          startDate: '2022-01',
          endDate: 'Present',
          keyResponsibilities: ['Developed web services & SQL DBs', 'Built JS web interfaces'],
          achievements: ['Delivered multi-tenant reporting portal']
        },
        {
          title: 'Junior Web Developer',
          company: 'Apex Systems',
          durationMonths: 24,
          startDate: '2020-01',
          endDate: '2021-12',
          keyResponsibilities: ['Maintained internal web portals', 'Created SQL data reports'],
          achievements: ['Automated internal reporting']
        }
      ],
      technicalSkills: ['JavaScript', 'HTML / CSS', 'SQL', 'C#', 'REST APIs', 'Git / GitHub', 'Debugging & Troubleshooting'],
      softSkills: ['Adaptability', 'Self-Motivation', 'Agile Teamwork'],
      languages: ['Afrikaans', 'English'],
      totalYearsExperience: 4.0,
      currentEmployer: 'Digital Core SA',
      noticePeriodDays: 30,
      expectedSalaryZar: 700000,
      availability: '30 Days Notice',
      linkedInUrl: 'https://linkedin.com/in/liezelvdm',
      referencesCount: 2
    },
    scores: {
      educationMatch: 90,
      skillsMatch: 82,
      experienceMatch: 85,
      industryMatch: 88,
      certificationMatch: 80,
      leadershipExperience: 75,
      communicationSkills: 90,
      careerStability: 88,
      employmentGapsScore: 100,
      locationSuitability: 95,
      salaryAlignment: 92,
      availabilityScore: 90,
      overallScore: 84
    },
    category: 'Strong Match',
    risks: [
      {
        id: 'r-101-1',
        category: 'Underqualified',
        severity: 'Medium',
        description: 'Limited commercial React & TypeScript framework experience; core background is vanilla JavaScript and C#.',
        mitigationSuggestion: 'Conduct a practical frontend technical assessment focusing on React fundamentals during the interview.'
      }
    ],
    summary: {
      headline: 'Solid Software Developer with 4 Years Web Experience & Strong Database Skills',
      experienceOverview: 'Liezel demonstrates 4 years of web application development at a Gauteng software company working on databases and REST APIs.',
      technicalAlignment: 'Strong JavaScript, HTML/CSS, SQL, and REST API foundation. Gap in commercial React and TypeScript projects.',
      leadershipAndSoftSkills: 'Good problem-solving initiative and clear technical documentation habits.',
      salaryAndNoticeFit: 'Salary expectation R700k aligns well with budget. 30 days notice.',
      keyConcerns: ['Limited commercial React/TypeScript experience.'],
      overallRecommendation: 'Suitable Candidate'
    },
    status: 'Interview Scheduled',
    recruiterNotes: 'Strong web developer with good academic record from TUT. Panel interview scheduled to assess React learning curve.',
    popiaConsent: {
      consented: true,
      timestamp: '2026-08-05T11:20:00Z',
      ipAddress: '105.186.201.44'
    },
    n8nPayload: {
      step3_extraction: {
        status: 'SUCCESS',
        timestamp: '2026-08-05T11:20:08Z',
        confidence: 0.96,
        reasoning: 'Parsed BTech IT qualification and 4 years web development experience.',
        recommendation: 'Evaluate React skills gap.',
        data: {
          name: 'Liezel',
          surname: 'van der Merwe',
          email: 'liezel.vdm@talent-demo.co.za',
          phone: '+27 83 312 8890',
          location: 'Pretoria, Gauteng',
          nationality: 'South African',
          education: [{ degree: 'BTech IT', institution: 'TUT', fieldOfStudy: 'Software Development' }],
          qualifications: ['BTech IT'],
          certifications: ['Azure Fundamentals'],
          workExperience: [],
          technicalSkills: ['JavaScript', 'HTML / CSS', 'SQL', 'C#', 'REST APIs'],
          softSkills: ['Adaptability'],
          languages: ['Afrikaans', 'English'],
          totalYearsExperience: 4.0,
          currentEmployer: 'Digital Core SA',
          noticePeriodDays: 30,
          expectedSalaryZar: 700000,
          availability: '30 Days Notice',
          referencesCount: 2
        }
      },
      step4_scoring: {
        status: 'SUCCESS',
        timestamp: '2026-08-05T11:20:10Z',
        confidence: 0.94,
        reasoning: 'Good core technical fit, though missing commercial React & TypeScript experience.',
        recommendation: 'Shortlist for panel interview.',
        data: {
          educationMatch: 90,
          skillsMatch: 82,
          experienceMatch: 85,
          industryMatch: 88,
          certificationMatch: 80,
          leadershipExperience: 75,
          communicationSkills: 90,
          careerStability: 88,
          employmentGapsScore: 100,
          locationSuitability: 95,
          salaryAlignment: 92,
          availabilityScore: 90,
          overallScore: 84
        }
      },
      step5_riskanalysis: {
        status: 'WARNING',
        timestamp: '2026-08-05T11:20:12Z',
        confidence: 0.95,
        reasoning: 'Identified minor skills gap in React/TypeScript.',
        recommendation: 'Evaluate framework adaptability in interview.',
        data: [
          {
            id: 'r-101-1',
            category: 'Underqualified',
            severity: 'Medium',
            description: 'Limited commercial React & TypeScript framework experience.',
            mitigationSuggestion: 'Practical React coding check.'
          }
        ]
      },
      step6_summary: {
        status: 'SUCCESS',
        timestamp: '2026-08-05T11:20:14Z',
        confidence: 0.95,
        reasoning: 'Executive summary generated.',
        recommendation: 'Suitable Candidate',
        data: {
          headline: 'Solid Software Developer with 4 Years Web Experience',
          experienceOverview: '4 years experience in Gauteng web dev agency.',
          technicalAlignment: 'Strong JS, HTML/CSS, SQL, APIs.',
          leadershipAndSoftSkills: 'Self-motivated contributor.',
          salaryAndNoticeFit: 'R700k salary within budget.',
          keyConcerns: ['React/TypeScript framework gap'],
          overallRecommendation: 'Suitable Candidate'
        }
      }
    }
  },
  {
    id: 'cand-003',
    jobId: 'job-101',
    jobTitle: 'Software Developer',
    candidateId: 'cand-003',
    source: 'Job Portals',
    appliedDate: '2026-08-06T14:10:00Z',
    rawCvText: `KAGISO MOKOENA
Centurion, Gauteng | +27 72 884 9201 | kagiso.mokoena@example.co.za
SUMMARY:
IT Support Technician and Web Administrator with 3 years experience maintaining WordPress websites, basic HTML/CSS updates, and troubleshooting network hardware. Seeking to transition into software development.

WORK EXPERIENCE:
IT Support & Web Administrator | TechAssure SA, Centurion | 2023 - Present
- Maintained company website, updated HTML content, and resolved basic database connectivity issues.
- Provided desktop IT support to internal staff.

EDUCATION:
Diploma in Information Technology | University of Johannesburg (UJ) | Graduated 2022 (NQF Level 6)
EXPECTED SALARY: R580,000 per annum
NOTICE PERIOD: 30 Days`,
    coverLetterText: 'Dear Hiring Manager, I am applying for the Software Developer role at eStudy South Africa to transition my career...',
    extractedData: {
      name: 'Kagiso',
      surname: 'Mokoena',
      email: 'kagiso.mokoena@example.co.za',
      phone: '+27 72 884 9201',
      location: 'Centurion, Gauteng',
      nationality: 'South African',
      education: [
        {
          degree: 'Diploma in Information Technology',
          institution: 'University of Johannesburg (UJ)',
          fieldOfStudy: 'Information Technology',
          yearGraduated: 2022,
          nqfLevelEquivalent: 'NQF Level 6'
        }
      ],
      qualifications: ['Diploma in IT (UJ)'],
      certifications: ['CompTIA A+'],
      workExperience: [
        {
          title: 'IT Support & Web Administrator',
          company: 'TechAssure SA',
          durationMonths: 36,
          startDate: '2023-01',
          endDate: 'Present',
          keyResponsibilities: ['WordPress website maintenance', 'Desktop IT support', 'Basic HTML/CSS'],
          achievements: ['Maintained 99.5% uptime for internal portal']
        }
      ],
      technicalSkills: ['HTML / CSS', 'JavaScript', 'WordPress', 'SQL', 'IT Troubleshooting'],
      softSkills: ['User Support', 'Communication', 'Punctuality'],
      languages: ['English', 'Sepedi'],
      totalYearsExperience: 3.0,
      currentEmployer: 'TechAssure SA',
      noticePeriodDays: 30,
      expectedSalaryZar: 580000,
      availability: '30 Days Notice',
      referencesCount: 2
    },
    scores: {
      educationMatch: 80,
      skillsMatch: 64,
      experienceMatch: 68,
      industryMatch: 70,
      certificationMatch: 65,
      leadershipExperience: 60,
      communicationSkills: 82,
      careerStability: 80,
      employmentGapsScore: 95,
      locationSuitability: 95,
      salaryAlignment: 95,
      availabilityScore: 90,
      overallScore: 68
    },
    category: 'Potential',
    risks: [
      {
        id: 'r-101-2',
        category: 'Underqualified',
        severity: 'High',
        description: 'Significant skills gap in React, TypeScript, REST APIs, and modern software engineering principles.',
        mitigationSuggestion: 'Consider for junior web maintenance or support role rather than full-stack developer.'
      }
    ],
    summary: {
      headline: 'IT Specialist with Basic Web Experience — Significant Developer Skills Gap',
      experienceOverview: 'Kagiso has 3 years of IT support and basic site maintenance experience using WordPress and HTML/CSS.',
      technicalAlignment: 'Lacks required core skills in React, TypeScript, and RESTful web API architecture.',
      leadershipAndSoftSkills: 'Enthusiastic communicator with strong user support orientation.',
      salaryAndNoticeFit: 'Salary requirement R580k is below budget max. Standard notice.',
      keyConcerns: ['Missing React, TypeScript, and modern software engineering practices.'],
      overallRecommendation: 'Potential Match - Further Info Needed'
    },
    status: 'Screened',
    recruiterNotes: 'Recruiter review required due to technical skills gap in React/TypeScript.',
    popiaConsent: {
      consented: true,
      timestamp: '2026-08-06T14:10:00Z',
      ipAddress: '196.25.255.10'
    }
  },
  {
    id: 'cand-004',
    jobId: 'job-102',
    jobTitle: 'Learning Designer / Instructional Designer',
    candidateId: 'cand-004',
    source: 'LinkedIn',
    appliedDate: '2026-08-05T08:30:00Z',
    rawCvText: `NOMBUSO DLAMINI
Midrand, Johannesburg | +27 82 901 3342 | nombuso.dlamini@candidate-demo.co.za | linkedin.com/in/nombusodlamini
SUMMARY:
Senior Instructional Designer & E-Learning Specialist with 5 years of experience designing interactive digital courseware, microlearning modules, and assessments for South African education providers. Expert in Articulate Storyline, Rise, Canva, and AI-assisted content creation using ADDIE and SAM frameworks.

WORK EXPERIENCE:
Instructional Designer | Digital Academy SA, Bryanston | Jan 2022 - Present
- Designed and storyboarded 40+ interactive digital learning modules in Articulate Storyline 360 and Articulate Rise.
- Implemented Generative AI tools to accelerate draft content creation and microlearning video scriptwriting.
- Managed course deployment on Moodle / Totara LMS and monitored learner progress analytics.
- Worked with subject matter experts to translate complex technical curricula into engaging digital learning journeys.

E-Learning Developer | LearnDirect SA, Johannesburg | Feb 2019 - Dec 2021
- Created digital assessments, interactive quizzes, and visual learning aids using Canva and Adobe Creative Suite.
- Applied adult learning principles to redesign traditional print course materials for online delivery.

EDUCATION:
Honours in Education (E-Learning Technology) | University of Johannesburg (UJ) | 2018 (NQF Level 8)
Bachelor of Education (BEd) | University of the Witwatersrand (Wits) | 2017 (NQF Level 7)

SKILLS: Instructional Design, Articulate Storyline, Articulate Rise, LMS Management, Curriculum Development, Canva, Generative AI, ADDIE / SAM, Storyboarding, Microlearning.
NOTICE PERIOD: 30 Days
EXPECTED SALARY: R620,000 per annum`,
    coverLetterText: 'Dear Hiring Manager, I am thrilled to apply for the Learning Designer / Instructional Designer position at eStudy South Africa. Combining my Honours in E-Learning Technology from UJ with 5 years of practical course design...',
    extractedData: {
      name: 'Nombuso',
      surname: 'Dlamini',
      email: 'nombuso.dlamini@candidate-demo.co.za',
      phone: '+27 82 901 3342',
      location: 'Midrand, Johannesburg',
      nationality: 'South African',
      education: [
        {
          degree: 'Honours in Education (E-Learning Technology)',
          institution: 'University of Johannesburg (UJ)',
          fieldOfStudy: 'Educational Technology',
          yearGraduated: 2018,
          nqfLevelEquivalent: 'NQF Level 8'
        },
        {
          degree: 'Bachelor of Education (BEd)',
          institution: 'University of the Witwatersrand (Wits)',
          fieldOfStudy: 'Education',
          yearGraduated: 2017,
          nqfLevelEquivalent: 'NQF Level 7'
        }
      ],
      qualifications: ['Honours in Education (UJ)', 'BEd (Wits)'],
      certifications: ['Articulate Certified Instructional Designer'],
      workExperience: [
        {
          title: 'Instructional Designer',
          company: 'Digital Academy SA',
          durationMonths: 55,
          startDate: '2022-01',
          endDate: 'Present',
          keyResponsibilities: ['Designed 40+ e-learning modules in Articulate', 'Used GenAI for microlearning scripts', 'Managed Moodle LMS deployment'],
          achievements: ['Increased course completion rates by 28%']
        },
        {
          title: 'E-Learning Developer',
          company: 'LearnDirect SA',
          durationMonths: 35,
          startDate: '2019-02',
          endDate: '2021-12',
          keyResponsibilities: ['Created digital quizzes in Canva', 'Redesigned print materials into e-learning'],
          achievements: ['Digitized 15 diploma courses']
        }
      ],
      technicalSkills: ['Instructional Design', 'Articulate Storyline', 'Articulate Rise', 'LMS Management', 'Curriculum Development', 'Canva', 'Generative AI', 'ADDIE / SAM', 'Storyboarding'],
      softSkills: ['SME Collaboration', 'Creativity', 'Attention to Detail', 'Stakeholder Communication'],
      languages: ['English', 'isiXhosa'],
      totalYearsExperience: 5.0,
      currentEmployer: 'Digital Academy SA',
      noticePeriodDays: 30,
      expectedSalaryZar: 620000,
      availability: '30 Days Notice',
      linkedInUrl: 'https://linkedin.com/in/nombusodlamini',
      portfolioUrl: 'https://nombusodlamini.design',
      referencesCount: 2
    },
    scores: {
      educationMatch: 96,
      skillsMatch: 95,
      experienceMatch: 94,
      industryMatch: 96,
      certificationMatch: 90,
      leadershipExperience: 88,
      communicationSkills: 96,
      careerStability: 95,
      employmentGapsScore: 100,
      locationSuitability: 100,
      salaryAlignment: 94,
      availabilityScore: 90,
      overallScore: 93
    },
    category: 'Excellent Match',
    risks: [],
    summary: {
      headline: 'Top Tier Instructional Designer with 5 Years EdTech & Articulate/AI Experience',
      experienceOverview: 'Nombuso brings 5 years of rich instructional design experience creating digital learning programmes for South African education providers.',
      technicalAlignment: 'Expert mastery of Articulate Storyline, Rise, LMS course authoring, storyboarding, and AI-assisted content tools.',
      leadershipAndSoftSkills: 'Exceptional stakeholder collaboration with subject matter experts and graphic designers.',
      salaryAndNoticeFit: 'Expected salary R620k fits within the R480k-R680k budget. 30 days notice.',
      keyConcerns: [],
      overallRecommendation: 'Strong Interview Candidate'
    },
    status: 'Shortlisted',
    recruiterNotes: 'Top candidate from UJ with impressive portfolio of digital courses. Portfolio review interview recommended.',
    popiaConsent: {
      consented: true,
      timestamp: '2026-08-05T08:30:00Z',
      ipAddress: '102.132.188.15'
    },
    n8nPayload: {
      step3_extraction: {
        status: 'SUCCESS',
        timestamp: '2026-08-05T08:30:10Z',
        confidence: 0.98,
        reasoning: 'Extracted Honours degree and 5 years instructional design experience.',
        recommendation: 'Proceed to scoring node.',
        data: {
          name: 'Nombuso',
          surname: 'Dlamini',
          email: 'nombuso.dlamini@candidate-demo.co.za',
          phone: '+27 82 901 3342',
          location: 'Midrand, Johannesburg',
          nationality: 'South African',
          education: [{ degree: 'Honours in Education', institution: 'UJ', fieldOfStudy: 'Educational Technology' }],
          qualifications: ['Honours in Education (UJ)'],
          certifications: ['Articulate Certified Instructional Designer'],
          workExperience: [],
          technicalSkills: ['Instructional Design', 'Articulate Storyline', 'Articulate Rise', 'LMS Management', 'Curriculum Development', 'Canva'],
          softSkills: ['Creativity', 'SME Collaboration'],
          languages: ['English', 'isiXhosa'],
          totalYearsExperience: 5.0,
          currentEmployer: 'Digital Academy SA',
          noticePeriodDays: 30,
          expectedSalaryZar: 620000,
          availability: '30 Days Notice',
          referencesCount: 2
        }
      },
      step4_scoring: {
        status: 'SUCCESS',
        timestamp: '2026-08-05T08:30:12Z',
        confidence: 0.96,
        reasoning: 'Matches all core instructional design requirements for job-102.',
        recommendation: 'Shortlist candidate for portfolio review.',
        data: {
          educationMatch: 96,
          skillsMatch: 95,
          experienceMatch: 94,
          industryMatch: 96,
          certificationMatch: 90,
          leadershipExperience: 88,
          communicationSkills: 96,
          careerStability: 95,
          employmentGapsScore: 100,
          locationSuitability: 100,
          salaryAlignment: 94,
          availabilityScore: 90,
          overallScore: 93
        }
      },
      step5_riskanalysis: {
        status: 'SUCCESS',
        timestamp: '2026-08-05T08:30:13Z',
        confidence: 0.99,
        reasoning: 'Zero critical risks flagged.',
        recommendation: 'Low Risk Candidate.',
        data: []
      },
      step6_summary: {
        status: 'SUCCESS',
        timestamp: '2026-08-05T08:30:15Z',
        confidence: 0.97,
        reasoning: 'Executive summary created.',
        recommendation: 'Strong Interview Candidate',
        data: {
          headline: 'Top Tier Instructional Designer with 5 Years EdTech Experience',
          experienceOverview: '5 years instructional design experience in EdTech.',
          technicalAlignment: 'Articulate Storyline, Rise, LMS, ADDIE.',
          leadershipAndSoftSkills: 'SME collaboration.',
          salaryAndNoticeFit: 'R620k salary fits within budget.',
          keyConcerns: [],
          overallRecommendation: 'Strong Interview Candidate'
        }
      }
    }
  },
  {
    id: 'cand-005',
    jobId: 'job-102',
    jobTitle: 'Learning Designer / Instructional Designer',
    candidateId: 'cand-005',
    source: 'Careers Website',
    appliedDate: '2026-08-06T10:15:00Z',
    rawCvText: `ANRICH PRETORIUS
Pretoria, Gauteng | +27 83 712 0041 | anrich.p@talent-demo.co.za
SUMMARY:
Curriculum Specialist & Educator with 4 years of experience designing academic learning materials, assessment structures, and blended learning content for Pretoria educational institutions. Strong pedagogical background with Postgraduate Diploma in Education from University of Pretoria.

WORK EXPERIENCE:
Curriculum Developer & Educator | Tshwane Learning Academy, Pretoria | Jan 2022 - Present
- Designed structured curriculum frameworks and learning objectives for tertiary diploma courses.
- Created digital presentation decks, research guides, and formative assessment materials.

High School Educator | Pretoria Boys High, Pretoria | Jan 2020 - Dec 2021
- Developed lesson plans, learning rubrics, and digital classroom materials.

EDUCATION:
Postgraduate Diploma in Education | University of Pretoria (UP) | 2019 (NQF Level 8)
BA Humanities | University of Pretoria (UP) | 2018 (NQF Level 7)
NOTICE PERIOD: 30 Days
EXPECTED SALARY: R550,000 per annum`,
    coverLetterText: 'Dear Selection Panel, I am applying for the Learning Designer position at eStudy South Africa to leverage my 4 years of curriculum design...',
    extractedData: {
      name: 'Anrich',
      surname: 'Pretorius',
      email: 'anrich.p@talent-demo.co.za',
      phone: '+27 83 712 0041',
      location: 'Pretoria, Gauteng',
      nationality: 'South African',
      education: [
        {
          degree: 'Postgraduate Diploma in Education',
          institution: 'University of Pretoria (UP)',
          fieldOfStudy: 'Education & Curriculum Design',
          yearGraduated: 2019,
          nqfLevelEquivalent: 'NQF Level 8'
        },
        {
          degree: 'BA Humanities',
          institution: 'University of Pretoria (UP)',
          fieldOfStudy: 'Humanities',
          yearGraduated: 2018,
          nqfLevelEquivalent: 'NQF Level 7'
        }
      ],
      qualifications: ['Postgraduate Diploma in Education (UP)', 'BA Humanities (UP)'],
      certifications: [],
      workExperience: [
        {
          title: 'Curriculum Developer',
          company: 'Tshwane Learning Academy',
          durationMonths: 55,
          startDate: '2022-01',
          endDate: 'Present',
          keyResponsibilities: ['Designed curriculum frameworks', 'Created digital presentation decks & assessments'],
          achievements: ['Restructured 8 accredited diploma modules']
        },
        {
          title: 'High School Educator',
          company: 'Pretoria Boys High',
          durationMonths: 24,
          startDate: '2020-01',
          endDate: '2021-12',
          keyResponsibilities: ['Lesson planning & rubrics', 'Digital classroom tools'],
          achievements: ['Implemented digital classroom portal']
        }
      ],
      technicalSkills: ['Curriculum Development', 'Adult Learning Principles', 'Assessment Design', 'Research', 'Google Workspace', 'Content Writing'],
      softSkills: ['Academic Writing', 'Verbal Communication', 'Organisational Skills'],
      languages: ['Afrikaans', 'English'],
      totalYearsExperience: 4.0,
      currentEmployer: 'Tshwane Learning Academy',
      noticePeriodDays: 30,
      expectedSalaryZar: 550000,
      availability: '30 Days Notice',
      linkedInUrl: 'https://linkedin.com/in/anrichpretorius',
      referencesCount: 2
    },
    scores: {
      educationMatch: 92,
      skillsMatch: 78,
      experienceMatch: 82,
      industryMatch: 85,
      certificationMatch: 75,
      leadershipExperience: 80,
      communicationSkills: 92,
      careerStability: 90,
      employmentGapsScore: 100,
      locationSuitability: 95,
      salaryAlignment: 95,
      availabilityScore: 90,
      overallScore: 83
    },
    category: 'Strong Match',
    risks: [
      {
        id: 'r-102-1',
        category: 'Underqualified',
        severity: 'Medium',
        description: 'Strong educational background, but limited corporate e-learning authoring experience in Articulate Storyline / Rise.',
        mitigationSuggestion: 'Assess willingness to complete Articulate Storyline training during onboarding.'
      }
    ],
    summary: {
      headline: 'Experienced Educator with Strong Curriculum Development & Academic Background',
      experienceOverview: 'Anrich has 4 years of experience in secondary and tertiary curriculum design, assessment creation, and learner engagement.',
      technicalAlignment: 'Excellent foundational pedagogy and content design skills; requires training on enterprise LMS and Articulate authoring tools.',
      leadershipAndSoftSkills: 'Strong academic writing and verbal communication skills.',
      salaryAndNoticeFit: 'Expected salary R550k fits comfortably within budget.',
      keyConcerns: ['Limited corporate e-learning software tool exposure (Articulate Rise/Storyline).'],
      overallRecommendation: 'Suitable Candidate'
    },
    status: 'Interview Scheduled',
    recruiterNotes: 'Solid educational foundation from UP. Scheduled for subject matter interview.',
    popiaConsent: {
      consented: true,
      timestamp: '2026-08-06T10:15:00Z',
      ipAddress: '105.22.110.8'
    },
    n8nPayload: {
      step3_extraction: {
        status: 'SUCCESS',
        timestamp: '2026-08-06T10:15:08Z',
        confidence: 0.95,
        reasoning: 'Extracted UP education qualification and 4 years curriculum experience.',
        recommendation: 'Evaluate Articulate software familiarity.',
        data: {
          name: 'Anrich',
          surname: 'Pretorius',
          email: 'anrich.p@talent-demo.co.za',
          phone: '+27 83 712 0041',
          location: 'Pretoria, Gauteng',
          nationality: 'South African',
          education: [{ degree: 'Postgraduate Diploma in Education', institution: 'UP', fieldOfStudy: 'Curriculum Design' }],
          qualifications: ['Postgraduate Diploma in Education'],
          certifications: [],
          workExperience: [],
          technicalSkills: ['Curriculum Development', 'Assessment Design', 'Research'],
          softSkills: ['Academic Writing'],
          languages: ['Afrikaans', 'English'],
          totalYearsExperience: 4.0,
          currentEmployer: 'Tshwane Learning Academy',
          noticePeriodDays: 30,
          expectedSalaryZar: 550000,
          availability: '30 Days Notice',
          referencesCount: 2
        }
      },
      step4_scoring: {
        status: 'SUCCESS',
        timestamp: '2026-08-06T10:15:10Z',
        confidence: 0.93,
        reasoning: 'High education and pedagogy score; moderate tool score.',
        recommendation: 'Interview candidate.',
        data: {
          educationMatch: 92,
          skillsMatch: 78,
          experienceMatch: 82,
          industryMatch: 85,
          certificationMatch: 75,
          leadershipExperience: 80,
          communicationSkills: 92,
          careerStability: 90,
          employmentGapsScore: 100,
          locationSuitability: 95,
          salaryAlignment: 95,
          availabilityScore: 90,
          overallScore: 83
        }
      },
      step5_riskanalysis: {
        status: 'WARNING',
        timestamp: '2026-08-06T10:15:12Z',
        confidence: 0.94,
        reasoning: 'Missing specialized Articulate Storyline software proficiency.',
        recommendation: 'Assess authoring software learning capability.',
        data: [
          {
            id: 'r-102-1',
            category: 'Underqualified',
            severity: 'Medium',
            description: 'Limited corporate authoring tool experience.',
            mitigationSuggestion: 'Provide Articulate onboarding module.'
          }
        ]
      },
      step6_summary: {
        status: 'SUCCESS',
        timestamp: '2026-08-06T10:15:14Z',
        confidence: 0.95,
        reasoning: 'Summary created.',
        recommendation: 'Suitable Candidate',
        data: {
          headline: 'Experienced Educator with Strong Curriculum Development Background',
          experienceOverview: '4 years curriculum development in Pretoria.',
          technicalAlignment: 'Pedagogy & content design strong.',
          leadershipAndSoftSkills: 'Communication skills excellent.',
          salaryAndNoticeFit: 'R550k within budget.',
          keyConcerns: ['Articulate tool training needed'],
          overallRecommendation: 'Suitable Candidate'
        }
      }
    }
  },
  {
    id: 'cand-006',
    jobId: 'job-102',
    jobTitle: 'Learning Designer / Instructional Designer',
    candidateId: 'cand-006',
    source: 'Email',
    appliedDate: '2026-08-07T11:45:00Z',
    rawCvText: `ZANELE KHUMALO
Soweto, Johannesburg | +27 71 552 1902 | zanele.khumalo@example.co.za
SUMMARY:
Primary School Educator & Content Proofreader with 3 years experience preparing lesson plans, reading materials, and student worksheets in Soweto. Seeking entry into digital instructional design.

WORK EXPERIENCE:
Primary School Teacher | Soweto Primary School, Soweto | Jan 2023 - Present
- Created classroom learning worksheets and story reading materials for foundation phase learners.

EDUCATION:
BA Education | University of South Africa (UNISA) | Graduated 2022 (NQF Level 7)
EXPECTED SALARY: R460,000 per annum
NOTICE PERIOD: 30 Days`,
    coverLetterText: 'Dear Sir/Madam, I am submitting my CV for the Learning Designer position at eStudy South Africa...',
    extractedData: {
      name: 'Zanele',
      surname: 'Khumalo',
      email: 'zanele.khumalo@example.co.za',
      phone: '+27 71 552 1902',
      location: 'Soweto, Johannesburg',
      nationality: 'South African',
      education: [
        {
          degree: 'BA Education',
          institution: 'University of South Africa (UNISA)',
          fieldOfStudy: 'Education',
          yearGraduated: 2022,
          nqfLevelEquivalent: 'NQF Level 7'
        }
      ],
      qualifications: ['BA Education (UNISA)'],
      certifications: [],
      workExperience: [
        {
          title: 'Primary School Teacher',
          company: 'Soweto Primary School',
          durationMonths: 36,
          startDate: '2023-01',
          endDate: 'Present',
          keyResponsibilities: ['Classroom lesson plans', 'Reading worksheets'],
          achievements: ['Organized annual literacy project']
        }
      ],
      technicalSkills: ['Educational Content Writing', 'Microsoft Office', 'Lesson Planning', 'Communication'],
      softSkills: ['Interpersonal Skills', 'Empathy', 'Patience'],
      languages: ['English', 'isiZulu'],
      totalYearsExperience: 3.0,
      currentEmployer: 'Soweto Primary School',
      noticePeriodDays: 30,
      expectedSalaryZar: 460000,
      availability: '30 Days Notice',
      referencesCount: 2
    },
    scores: {
      educationMatch: 85,
      skillsMatch: 65,
      experienceMatch: 68,
      industryMatch: 72,
      certificationMatch: 60,
      leadershipExperience: 65,
      communicationSkills: 88,
      careerStability: 82,
      employmentGapsScore: 95,
      locationSuitability: 100,
      salaryAlignment: 98,
      availabilityScore: 90,
      overallScore: 70
    },
    category: 'Potential',
    risks: [
      {
        id: 'r-102-2',
        category: 'Underqualified',
        severity: 'Medium',
        description: 'Lacks formal instructional design frameworks (ADDIE/SAM), storyboarding experience, and digital LMS authoring software.',
        mitigationSuggestion: 'Recruiter to evaluate if junior content coordinator role is more suitable.'
      }
    ],
    summary: {
      headline: 'Education Specialist with Good Communication — Limited Instructional Design Exposure',
      experienceOverview: 'Zanele has 3 years of classroom teaching and basic educational materials editing experience.',
      technicalAlignment: 'Lacks corporate e-learning authoring skills and instructional design framework methodology.',
      leadershipAndSoftSkills: 'Good interpersonal skills and passion for South African education.',
      salaryAndNoticeFit: 'Salary requirement R460k is well within budget.',
      keyConcerns: ['Missing instructional design tools (Articulate) and storyboarding experience.'],
      overallRecommendation: 'Potential Match - Further Info Needed'
    },
    status: 'Screened',
    recruiterNotes: 'Flagged for recruiter review.',
    popiaConsent: {
      consented: true,
      timestamp: '2026-08-07T11:45:00Z',
      ipAddress: '196.25.255.10'
    }
  },
  {
    id: 'cand-007',
    jobId: 'job-103',
    jobTitle: 'HR & Recruitment Specialist',
    candidateId: 'cand-007',
    source: 'LinkedIn',
    appliedDate: '2026-08-06T09:00:00Z',
    rawCvText: `THABO MOLEFE
Sandton, Johannesburg | +27 82 334 8812 | thabo.molefe@candidate-demo.co.za | linkedin.com/in/thabomolefe
SUMMARY:
Talent Acquisition Specialist with 4.5 years of experience in end-to-end tech and education recruitment in Gauteng. Skilled in candidate sourcing, ATS management (Workday/Sage), LinkedIn Recruiter, POPIA data protection compliance, interview coordination, and employee onboarding.

WORK EXPERIENCE:
Talent Acquisition Specialist | Mindset Talent SA, Sandton | Jan 2022 - Present
- Managed full lifecycle recruitment for software engineers, instructional designers, and corporate staff.
- Conducted candidate sourcing on LinkedIn Recruiter and managed ATS candidate databases.
- Ensured strict POPIA consent compliance and candidate record audits.
- Facilitated new hire onboarding and contract documentation for 120+ hires annually.

HR & Recruitment Assistant | TalentSource SA, Rosebank | Mar 2020 - Dec 2021
- Coordinated interview schedules, reference checks, and candidate correspondence.

EDUCATION:
Bachelor of Human Resource Management | University of Pretoria (UP) | Graduated 2019 (NQF Level 7)

SKILLS: Recruitment & Talent Acquisition, Candidate Sourcing, LinkedIn Recruiter, ATS Platforms, POPIA Compliance, Employee Onboarding, Interview Coordination, HR Administration.
NOTICE PERIOD: 30 Days
EXPECTED SALARY: R540,000 per annum`,
    coverLetterText: 'Dear Hiring Manager, I am applying for the HR & Recruitment Specialist vacancy at eStudy South Africa. Having spent the last 4.5 years recruiting across technology and education sectors in Johannesburg...',
    extractedData: {
      name: 'Thabo',
      surname: 'Molefe',
      email: 'thabo.molefe@candidate-demo.co.za',
      phone: '+27 82 334 8812',
      location: 'Sandton, Johannesburg',
      nationality: 'South African',
      education: [
        {
          degree: 'Bachelor of Human Resource Management',
          institution: 'University of Pretoria (UP)',
          fieldOfStudy: 'Human Resources',
          yearGraduated: 2019,
          nqfLevelEquivalent: 'NQF Level 7'
        }
      ],
      qualifications: ['BHRM (University of Pretoria)'],
      certifications: ['SABPP Candidate HR Practitioner'],
      workExperience: [
        {
          title: 'Talent Acquisition Specialist',
          company: 'Mindset Talent SA',
          durationMonths: 55,
          startDate: '2022-01',
          endDate: 'Present',
          keyResponsibilities: ['Full cycle tech & education hiring', 'LinkedIn Recruiter sourcing', 'POPIA compliance auditing', 'Onboarding 120+ hires/yr'],
          achievements: ['Reduced time-to-fill by 22%']
        },
        {
          title: 'HR & Recruitment Assistant',
          company: 'TalentSource SA',
          durationMonths: 22,
          startDate: '2020-03',
          endDate: '2021-12',
          keyResponsibilities: ['Interview scheduling', 'Reference checking', 'Candidate correspondence'],
          achievements: ['Managed high-volume interview calendar']
        }
      ],
      technicalSkills: ['Recruitment & Talent Acquisition', 'Candidate Sourcing', 'LinkedIn Recruiter', 'ATS Platforms', 'POPIA Compliance', 'Employee Onboarding', 'Interview Coordination', 'HR Administration'],
      softSkills: ['Stakeholder Management', 'Confidentiality', 'Communication', 'Negotiation'],
      languages: ['English', 'Setswana'],
      totalYearsExperience: 4.5,
      currentEmployer: 'Mindset Talent SA',
      noticePeriodDays: 30,
      expectedSalaryZar: 540000,
      availability: '30 Days Notice',
      linkedInUrl: 'https://linkedin.com/in/thabomolefe',
      referencesCount: 2
    },
    scores: {
      educationMatch: 95,
      skillsMatch: 94,
      experienceMatch: 93,
      industryMatch: 94,
      certificationMatch: 88,
      leadershipExperience: 85,
      communicationSkills: 95,
      careerStability: 94,
      employmentGapsScore: 100,
      locationSuitability: 100,
      salaryAlignment: 94,
      availabilityScore: 90,
      overallScore: 92
    },
    category: 'Excellent Match',
    risks: [],
    summary: {
      headline: 'Accomplished HR & Recruitment Specialist with 4.5 Years Tech/Education Hiring Experience',
      experienceOverview: 'Thabo has 4.5 years of specialized end-to-end recruitment experience sourcing technology and education professionals across South Africa.',
      technicalAlignment: 'Strong expertise in ATS management, LinkedIn Recruiter sourcing, POPIA privacy compliance, and structured onboarding.',
      leadershipAndSoftSkills: 'Proven ability to build trusting relationships with hiring managers and candidate pipelines.',
      salaryAndNoticeFit: 'Expected salary R540k fits inside the R420k-R600k budget. 30 days notice.',
      keyConcerns: [],
      overallRecommendation: 'Strong Interview Candidate'
    },
    status: 'Shortlisted',
    recruiterNotes: 'Top candidate with relevant EdTech recruitment experience and strong POPIA awareness. Fast-track to interview.',
    popiaConsent: {
      consented: true,
      timestamp: '2026-08-06T09:00:00Z',
      ipAddress: '102.132.200.40'
    },
    n8nPayload: {
      step3_extraction: {
        status: 'SUCCESS',
        timestamp: '2026-08-06T09:00:10Z',
        confidence: 0.98,
        reasoning: 'Extracted UP degree and 4.5 years recruitment experience.',
        recommendation: 'Proceed to scoring node.',
        data: {
          name: 'Thabo',
          surname: 'Molefe',
          email: 'thabo.molefe@candidate-demo.co.za',
          phone: '+27 82 334 8812',
          location: 'Sandton, Johannesburg',
          nationality: 'South African',
          education: [{ degree: 'Bachelor of HR Management', institution: 'UP', fieldOfStudy: 'HR' }],
          qualifications: ['BHRM (UP)'],
          certifications: ['SABPP Practitioner'],
          workExperience: [],
          technicalSkills: ['Recruitment', 'LinkedIn Recruiter', 'ATS', 'POPIA', 'Onboarding'],
          softSkills: ['Stakeholder Management', 'Communication'],
          languages: ['English', 'Setswana'],
          totalYearsExperience: 4.5,
          currentEmployer: 'Mindset Talent SA',
          noticePeriodDays: 30,
          expectedSalaryZar: 540000,
          availability: '30 Days Notice',
          referencesCount: 2
        }
      },
      step4_scoring: {
        status: 'SUCCESS',
        timestamp: '2026-08-06T09:00:12Z',
        confidence: 0.96,
        reasoning: 'Matches all HR & Recruitment Specialist requirements for job-103.',
        recommendation: 'Shortlist candidate.',
        data: {
          educationMatch: 95,
          skillsMatch: 94,
          experienceMatch: 93,
          industryMatch: 94,
          certificationMatch: 88,
          leadershipExperience: 85,
          communicationSkills: 95,
          careerStability: 94,
          employmentGapsScore: 100,
          locationSuitability: 100,
          salaryAlignment: 94,
          availabilityScore: 90,
          overallScore: 92
        }
      },
      step5_riskanalysis: {
        status: 'SUCCESS',
        timestamp: '2026-08-06T09:00:13Z',
        confidence: 0.99,
        reasoning: 'Zero critical risks flagged.',
        recommendation: 'Low Risk Candidate.',
        data: []
      },
      step6_summary: {
        status: 'SUCCESS',
        timestamp: '2026-08-06T09:00:15Z',
        confidence: 0.97,
        reasoning: 'Summary created.',
        recommendation: 'Strong Interview Candidate',
        data: {
          headline: 'Accomplished HR & Recruitment Specialist with 4.5 Years Experience',
          experienceOverview: '4.5 years recruitment in tech & education.',
          technicalAlignment: 'ATS, LinkedIn Recruiter, POPIA, Onboarding.',
          leadershipAndSoftSkills: 'Stakeholder management.',
          salaryAndNoticeFit: 'R540k within budget.',
          keyConcerns: [],
          overallRecommendation: 'Strong Interview Candidate'
        }
      }
    }
  },
  {
    id: 'cand-008',
    jobId: 'job-103',
    jobTitle: 'HR & Recruitment Specialist',
    candidateId: 'cand-008',
    source: 'Careers Website',
    appliedDate: '2026-08-07T09:30:00Z',
    rawCvText: `CHANTAL PILLAY
Midrand, Gauteng | +27 84 210 9943 | chantal.p@talent-demo.co.za
SUMMARY:
HR Administrator & Onboarding Specialist with 5 years experience managing personnel records, HRIS platforms, employment contracts, and initial interview scheduling in Gauteng.

WORK EXPERIENCE:
HR Administrator | Corporate Personnel SA, Midrand | Jan 2021 - Present
- Managed employee onboarding documentation, contract generation, and HRIS updates for 200+ employees.
- Coordinated interview scheduling and preliminary candidate screening for corporate roles.

EDUCATION:
Diploma in Human Resource Management | Tshwane University of Technology (TUT) | 2020 (NQF Level 6)
NOTICE PERIOD: 30 Days
EXPECTED SALARY: R490,000 per annum`,
    coverLetterText: 'Dear HR Team, Please find my CV attached for the HR & Recruitment Specialist role at eStudy South Africa...',
    extractedData: {
      name: 'Chantal',
      surname: 'Pillay',
      email: 'chantal.p@talent-demo.co.za',
      phone: '+27 84 210 9943',
      location: 'Midrand, Gauteng',
      nationality: 'South African',
      education: [
        {
          degree: 'Diploma in Human Resource Management',
          institution: 'Tshwane University of Technology (TUT)',
          fieldOfStudy: 'HR Management',
          yearGraduated: 2020,
          nqfLevelEquivalent: 'NQF Level 6'
        }
      ],
      qualifications: ['Diploma in HR Management (TUT)'],
      certifications: [],
      workExperience: [
        {
          title: 'HR Administrator',
          company: 'Corporate Personnel SA',
          durationMonths: 67,
          startDate: '2021-01',
          endDate: 'Present',
          keyResponsibilities: ['HRIS updates & contract generation', 'Interview scheduling', 'Employee onboarding'],
          achievements: ['Digitized employee personnel records']
        }
      ],
      technicalSkills: ['HR Administration', 'Employee Onboarding', 'HRIS Data Management', 'Interview Coordination', 'POPIA Compliance', 'Employment Documentation'],
      softSkills: ['Detail Orientation', 'Confidentiality', 'Communication'],
      languages: ['English'],
      totalYearsExperience: 5.0,
      currentEmployer: 'Corporate Personnel SA',
      noticePeriodDays: 30,
      expectedSalaryZar: 490000,
      availability: '30 Days Notice',
      linkedInUrl: 'https://linkedin.com/in/chantalpillay',
      referencesCount: 2
    },
    scores: {
      educationMatch: 88,
      skillsMatch: 82,
      experienceMatch: 84,
      industryMatch: 86,
      certificationMatch: 80,
      leadershipExperience: 78,
      communicationSkills: 90,
      careerStability: 92,
      employmentGapsScore: 100,
      locationSuitability: 95,
      salaryAlignment: 95,
      availabilityScore: 90,
      overallScore: 82
    },
    category: 'Strong Match',
    risks: [
      {
        id: 'r-103-1',
        category: 'Underqualified',
        severity: 'Low',
        description: 'Strong HR administration and onboarding background; limited active candidate sourcing for technical roles.',
        mitigationSuggestion: 'Provide initial guidance on active LinkedIn Recruiter sourcing strategies for specialized tech roles.'
      }
    ],
    summary: {
      headline: 'Experienced HR Generalist with Strong Administration & Onboarding Track Record',
      experienceOverview: 'Chantal brings 5 years of solid HR administration, employee records compliance, and interview coordination experience.',
      technicalAlignment: 'Excellent HRIS and administrative skills; moderate active talent sourcing exposure for software roles.',
      leadershipAndSoftSkills: 'Detail-oriented administrator with strong communication and stakeholder rapport.',
      salaryAndNoticeFit: 'Salary expectation R490k aligns well with budget.',
      keyConcerns: ['Limited technical candidate sourcing experience.'],
      overallRecommendation: 'Suitable Candidate'
    },
    status: 'Interview Scheduled',
    recruiterNotes: 'Good HR generalist background. Scheduled for competency interview.',
    popiaConsent: {
      consented: true,
      timestamp: '2026-08-07T09:30:00Z',
      ipAddress: '105.186.110.12'
    },
    n8nPayload: {
      step3_extraction: {
        status: 'SUCCESS',
        timestamp: '2026-08-07T09:30:08Z',
        confidence: 0.95,
        reasoning: 'Extracted TUT diploma and 5 years HR administration experience.',
        recommendation: 'Assess active sourcing skills.',
        data: {
          name: 'Chantal',
          surname: 'Pillay',
          email: 'chantal.p@talent-demo.co.za',
          phone: '+27 84 210 9943',
          location: 'Midrand, Gauteng',
          nationality: 'South African',
          education: [{ degree: 'Diploma in HR Management', institution: 'TUT', fieldOfStudy: 'HR' }],
          qualifications: ['Diploma in HR'],
          certifications: [],
          workExperience: [],
          technicalSkills: ['HR Administration', 'Onboarding', 'HRIS', 'POPIA'],
          softSkills: ['Detail Orientation'],
          languages: ['English'],
          totalYearsExperience: 5.0,
          currentEmployer: 'Corporate Personnel SA',
          noticePeriodDays: 30,
          expectedSalaryZar: 490000,
          availability: '30 Days Notice',
          referencesCount: 2
        }
      },
      step4_scoring: {
        status: 'SUCCESS',
        timestamp: '2026-08-07T09:30:10Z',
        confidence: 0.93,
        reasoning: 'Strong HR administration match.',
        recommendation: 'Schedule interview.',
        data: {
          educationMatch: 88,
          skillsMatch: 82,
          experienceMatch: 84,
          industryMatch: 86,
          certificationMatch: 80,
          leadershipExperience: 78,
          communicationSkills: 90,
          careerStability: 92,
          employmentGapsScore: 100,
          locationSuitability: 95,
          salaryAlignment: 95,
          availabilityScore: 90,
          overallScore: 82
        }
      },
      step5_riskanalysis: {
        status: 'WARNING',
        timestamp: '2026-08-07T09:30:12Z',
        confidence: 0.95,
        reasoning: 'Limited tech sourcing exposure.',
        recommendation: 'Train on active LinkedIn Recruiter sourcing.',
        data: [
          {
            id: 'r-103-1',
            category: 'Underqualified',
            severity: 'Low',
            description: 'Limited active tech sourcing experience.',
            mitigationSuggestion: 'Sourcing training.'
          }
        ]
      },
      step6_summary: {
        status: 'SUCCESS',
        timestamp: '2026-08-07T09:30:14Z',
        confidence: 0.95,
        reasoning: 'Summary created.',
        recommendation: 'Suitable Candidate',
        data: {
          headline: 'Experienced HR Generalist with Strong Admin Background',
          experienceOverview: '5 years HR administration in Midrand.',
          technicalAlignment: 'HRIS & contract administration strong.',
          leadershipAndSoftSkills: 'Detail oriented.',
          salaryAndNoticeFit: 'R490k within budget.',
          keyConcerns: ['Technical sourcing exposure'],
          overallRecommendation: 'Suitable Candidate'
        }
      }
    }
  },
  {
    id: 'cand-009',
    jobId: 'job-103',
    jobTitle: 'HR & Recruitment Specialist',
    candidateId: 'cand-009',
    source: 'Email',
    appliedDate: '2026-08-08T10:00:00Z',
    rawCvText: `DAVID VAN ZYL
Johannesburg, Gauteng | +27 83 991 4012 | david.vanzyl@example.co.za
SUMMARY:
Junior HR Graduate with BCom in Industrial Psychology from Stellenbosch University and 2 years experience as HR Assistant in Johannesburg. Strong communication skills and enthusiasm for talent acquisition.

WORK EXPERIENCE:
HR Assistant | Metro Logistics SA, Johannesburg | Jan 2023 - Present
- Assisted with interview scheduling, filing employee records, and drafting orientation packs.

EDUCATION:
BCom Industrial Psychology | Stellenbosch University | Graduated 2022 (NQF Level 7)
EXPECTED SALARY: R410,000 per annum
NOTICE PERIOD: 30 Days`,
    coverLetterText: 'Dear Selection Committee, I am submitting my application for the HR & Recruitment Specialist position at eStudy South Africa...',
    extractedData: {
      name: 'David',
      surname: 'van Zyl',
      email: 'david.vanzyl@example.co.za',
      phone: '+27 83 991 4012',
      location: 'Johannesburg, Gauteng',
      nationality: 'South African',
      education: [
        {
          degree: 'BCom Industrial Psychology',
          institution: 'Stellenbosch University',
          fieldOfStudy: 'Industrial Psychology',
          yearGraduated: 2022,
          nqfLevelEquivalent: 'NQF Level 7'
        }
      ],
      qualifications: ['BCom Industrial Psychology (Stellenbosch)'],
      certifications: [],
      workExperience: [
        {
          title: 'HR Assistant',
          company: 'Metro Logistics SA',
          durationMonths: 24,
          startDate: '2023-01',
          endDate: 'Present',
          keyResponsibilities: ['Interview scheduling', 'Filing personnel records', 'Drafting orientation packs'],
          achievements: ['Organized digital personnel records']
        }
      ],
      technicalSkills: ['HR Coordination', 'Interview Scheduling', 'Microsoft Office', 'Communication'],
      softSkills: ['Interpersonal Relations', 'Ethical Conduct', 'Organisational Ability'],
      languages: ['Afrikaans', 'English'],
      totalYearsExperience: 2.0,
      currentEmployer: 'Metro Logistics SA',
      noticePeriodDays: 30,
      expectedSalaryZar: 410000,
      availability: '30 Days Notice',
      referencesCount: 2
    },
    scores: {
      educationMatch: 90,
      skillsMatch: 62,
      experienceMatch: 64,
      industryMatch: 70,
      certificationMatch: 60,
      leadershipExperience: 60,
      communicationSkills: 88,
      careerStability: 80,
      employmentGapsScore: 95,
      locationSuitability: 100,
      salaryAlignment: 98,
      availabilityScore: 90,
      overallScore: 68
    },
    category: 'Potential',
    risks: [
      {
        id: 'r-103-2',
        category: 'Underqualified',
        severity: 'Medium',
        description: 'Junior profile with only 2 years general HR assistance; limited full-cycle recruitment exposure.',
        mitigationSuggestion: 'Consider for junior HR assistant position if available.'
      }
    ],
    summary: {
      headline: 'Junior HR Graduate with Strong Industrial Psychology Background',
      experienceOverview: 'David has 2 years of junior HR coordination and interview scheduling experience.',
      technicalAlignment: 'Strong academic qualification in Industrial Psychology; limited active sourcing and ATS experience.',
      leadershipAndSoftSkills: 'Good interpersonal skills and structured approach.',
      salaryAndNoticeFit: 'Salary expectation R410k is below budget minimum.',
      keyConcerns: ['Junior experience level for a full specialist role.'],
      overallRecommendation: 'Potential Match - Further Info Needed'
    },
    status: 'On Hold',
    recruiterNotes: 'Put on hold due to junior experience level.',
    popiaConsent: {
      consented: true,
      timestamp: '2026-08-08T10:00:00Z',
      ipAddress: '196.25.255.10'
    }
  }
];

export const initialEmails: EmailCommunication[] = [
  {
    id: 'email-101',
    candidateId: 'cand-001',
    candidateName: 'Sipho Ndlovu',
    candidateEmail: 'sipho.ndlovu@candidate-demo.co.za',
    type: 'Interview Invitation',
    subject: 'Interview Invitation: Software Developer at eStudy South Africa',
    body: `Dear Sipho,

Thank you for applying for the Software Developer position at eStudy South Africa.

Our recruitment panel reviewed your CV and was highly impressed with your experience building digital learning platforms and web APIs using React, TypeScript, and Node.js.

We would like to invite you to a 45-minute technical discussion with our Technology Lead via Microsoft Teams.

Proposed Time Slots:
- Tuesday, 12 August 2026 at 10:00 AM (SAST)
- Wednesday, 13 August 2026 at 02:00 PM (SAST)
- Thursday, 14 August 2026 at 11:30 AM (SAST)

Please let us know which slot works best for you.

Kind regards,
Talent Acquisition Team
eStudy South Africa`,
    sentDate: '2026-08-05T16:00:00Z',
    status: 'Sent'
  },
  {
    id: 'email-102',
    candidateId: 'cand-004',
    candidateName: 'Nombuso Dlamini',
    candidateEmail: 'nombuso.dlamini@candidate-demo.co.za',
    type: 'Interview Invitation',
    subject: 'Portfolio Review Interview: Learning Designer at eStudy South Africa',
    body: `Dear Nombuso,

We are pleased to inform you that your application for the Learning Designer / Instructional Designer role at eStudy South Africa has been shortlisted.

We would like to schedule a 45-minute portfolio review with our Learning & Development lead to discuss your courseware designs in Articulate Rise and Storyline.

Proposed Time Slot:
- Wednesday, 13 August 2026 at 11:00 AM (SAST)

Kind regards,
Talent Acquisition Team
eStudy South Africa`,
    sentDate: '2026-08-06T10:00:00Z',
    status: 'Scheduled'
  },
  {
    id: 'email-103',
    candidateId: 'cand-007',
    candidateName: 'Thabo Molefe',
    candidateEmail: 'thabo.molefe@candidate-demo.co.za',
    type: 'Interview Invitation',
    subject: 'Competency Interview: HR & Recruitment Specialist at eStudy South Africa',
    body: `Dear Thabo,

Thank you for your application for the HR & Recruitment Specialist vacancy at eStudy South Africa.

We were very impressed with your recruitment experience in technology and education sectors and your strong POPIA compliance background.

We would like to invite you to a 45-minute competency interview via Microsoft Teams.

Proposed Time Slot:
- Thursday, 14 August 2026 at 02:00 PM (SAST)

Kind regards,
Talent Acquisition Team
eStudy South Africa`,
    sentDate: '2026-08-06T15:30:00Z',
    status: 'Sent'
  },
  {
    id: 'email-104',
    candidateId: 'cand-002',
    candidateName: 'Liezel van der Merwe',
    candidateEmail: 'liezel.vdm@talent-demo.co.za',
    type: 'Interview Invitation',
    subject: 'Technical Panel Interview: Software Developer at eStudy South Africa',
    body: `Dear Liezel,

Thank you for applying for the Software Developer position at eStudy South Africa.

We would like to schedule a preliminary 45-minute technical discussion to explore your web development experience and React framework adaptability.

Kind regards,
Talent Acquisition Team
eStudy South Africa`,
    status: 'Scheduled'
  }
];

export const initialInterviews: InterviewSlot[] = [
  {
    id: 'int-101',
    candidateId: 'cand-001',
    candidateName: 'Sipho Ndlovu',
    jobTitle: 'Software Developer',
    interviewerName: 'Dr. Kobus Venter (Head of Technology)',
    date: '2026-08-12',
    startTime: '10:00',
    endTime: '10:45',
    meetingLink: 'https://teams.microsoft.com/l/meetup-join/estudy-sipho-ndlovu',
    status: 'Confirmed',
    icsContent: `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Aura AI//Recruitment System//EN
BEGIN:VEVENT
SUMMARY:Technical Panel Interview - Sipho Ndlovu
DESCRIPTION:Technical Interview for Software Developer role at eStudy South Africa.
LOCATION:Microsoft Teams
DTSTART:20260812T080000Z
DTEND:20260812T084500Z
END:VEVENT
END:VCALENDAR`
  },
  {
    id: 'int-102',
    candidateId: 'cand-004',
    candidateName: 'Nombuso Dlamini',
    jobTitle: 'Learning Designer / Instructional Designer',
    interviewerName: 'Sarah Jenkins (Lead Learning Architect)',
    date: '2026-08-13',
    startTime: '11:00',
    endTime: '11:45',
    meetingLink: 'https://teams.microsoft.com/l/meetup-join/estudy-nombuso-dlamini',
    status: 'Confirmed'
  },
  {
    id: 'int-103',
    candidateId: 'cand-007',
    candidateName: 'Thabo Molefe',
    jobTitle: 'HR & Recruitment Specialist',
    interviewerName: 'Lesedi Tlhapane (Head of Talent Acquisition)',
    date: '2026-08-14',
    startTime: '14:00',
    endTime: '14:45',
    meetingLink: 'https://teams.microsoft.com/l/meetup-join/estudy-thabo-molefe',
    status: 'Confirmed'
  },
  {
    id: 'int-104',
    candidateId: 'cand-002',
    candidateName: 'Liezel van der Merwe',
    jobTitle: 'Software Developer',
    interviewerName: 'Dr. Kobus Venter (Head of Technology)',
    date: '2026-08-15',
    startTime: '09:30',
    endTime: '10:15',
    meetingLink: 'https://teams.microsoft.com/l/meetup-join/estudy-liezel-vdm',
    status: 'Proposed'
  }
];

export const initialAuditLogs: AuditLogItem[] = [
  {
    id: 'log-001',
    timestamp: '2026-08-04T09:15:15Z',
    actor: 'Aura Intelligence Engine',
    action: 'Candidate Data Ingestion & Extraction',
    entityType: 'Candidate',
    details: 'Extracted candidate Sipho Ndlovu for Software Developer vacancy at eStudy South Africa with 98% confidence.',
    popiaReference: 'POPIA-CONSENT-LOG-00192'
  },
  {
    id: 'log-002',
    timestamp: '2026-08-04T09:15:18Z',
    actor: 'Aura Intelligence Engine',
    action: 'AI Candidate Screening',
    entityType: 'Candidate',
    details: 'Calculated overall match score of 94% for Sipho Ndlovu against Job ID job-101. Zero high severity risks found.',
    popiaReference: 'POPIA-SCORE-AUDIT-00192'
  },
  {
    id: 'log-003',
    timestamp: '2026-08-05T08:30:12Z',
    actor: 'Aura Intelligence Engine',
    action: 'Learning Design Skills Extracted',
    entityType: 'Candidate',
    details: 'Extracted 9 core skills for Nombuso Dlamini including Articulate Storyline, Rise, LMS, and Generative AI.',
    popiaReference: 'POPIA-PARSING-LOG-00411'
  },
  {
    id: 'log-004',
    timestamp: '2026-08-05T10:00:00Z',
    actor: 'Lesedi Tlhapane (Recruiter)',
    action: 'Recruiter Decision: Shortlisted',
    entityType: 'Candidate',
    details: 'Recruiter reviewed Sipho Ndlovu evaluation summary and marked status as Shortlisted with note: "Top candidate from Wits with EdTech background".',
    popiaReference: 'POPIA-RECRUITER-ACTION-882'
  },
  {
    id: 'log-005',
    timestamp: '2026-08-06T09:15:00Z',
    actor: 'Aura Intelligence Engine',
    action: 'Recruitment Experience Verified',
    entityType: 'Candidate',
    details: 'Scored Thabo Molefe 92% match for HR & Recruitment Specialist vacancy at eStudy South Africa.',
    popiaReference: 'POPIA-SCORE-AUDIT-00701'
  },
  {
    id: 'log-006',
    timestamp: '2026-08-06T11:00:00Z',
    actor: 'Lesedi Tlhapane (Recruiter)',
    action: 'Communication Dispatched',
    entityType: 'Email',
    details: 'Sent Interview Invitation email to sipho.ndlovu@candidate-demo.co.za via Aura Engine.',
    popiaReference: 'POPIA-COMM-LOG-402'
  }
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    icon: '📄',
    title: 'CV Ingestion Completed',
    detail: 'Parsed CV for Sipho Ndlovu (Software Developer) for eStudy South Africa.',
    badge: 'Ingestion',
    timestamp: '2 mins ago',
    read: false,
    category: 'Ingestion'
  },
  {
    id: 'notif-2',
    icon: '🧠',
    title: 'Aura AI Candidate Screening',
    detail: 'Evaluated suitability metrics for Nombuso Dlamini. High suitability match: 93% (Learning Designer).',
    badge: 'Screening',
    timestamp: '5 mins ago',
    read: false,
    category: 'Screening'
  },
  {
    id: 'notif-3',
    icon: '🏷️',
    title: 'Developer Skills Extracted',
    detail: 'Extracted 10 core skills: React, TypeScript, Node.js, REST APIs, MySQL, Git, GenAI.',
    badge: 'Parsing',
    timestamp: '12 mins ago',
    read: false,
    category: 'Parsing'
  },
  {
    id: 'notif-4',
    icon: '🏷️',
    title: 'Learning Design Skills Extracted',
    detail: 'Extracted core skills: Articulate Storyline/Rise, LMS, ADDIE/SAM, Microlearning.',
    badge: 'Parsing',
    timestamp: '18 mins ago',
    read: true,
    category: 'Parsing'
  },
  {
    id: 'notif-5',
    icon: '💼',
    title: 'Recruitment Experience Verified',
    detail: 'Thabo Molefe verified for HR & Recruitment Specialist role (92% match, POPIA compliant).',
    badge: 'Matching',
    timestamp: '25 mins ago',
    read: true,
    category: 'Matching'
  },
  {
    id: 'notif-6',
    icon: '🛡️',
    title: 'POPIA Compliance Audit Verified',
    detail: 'Verified candidate explicit data processing consent for all eStudy recruitment pipelines.',
    badge: 'Compliance',
    timestamp: '1 hour ago',
    read: true,
    category: 'Compliance'
  },
  {
    id: 'notif-7',
    icon: '📅',
    title: 'Interview Slot Confirmed',
    detail: 'Interview confirmed for Sipho Ndlovu with Dr. Kobus Venter (Head of Technology).',
    badge: 'Calendar',
    timestamp: '3 hours ago',
    read: true,
    category: 'Calendar'
  },
  {
    id: 'notif-8',
    icon: '✉️',
    title: 'Automated Vacancy Match',
    detail: 'Liezel van der Merwe matched to Software Developer role (84% match).',
    badge: 'Matching',
    timestamp: '5 hours ago',
    read: true,
    category: 'Matching'
  }
];
