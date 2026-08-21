/**
 * Aura Recruitment Flow AI - Professional Recruitment & Intelligence Catalog
 * South African & Global HR Standards
 */

export interface RoleIntelligenceItem {
  jobTitle: string;
  department: string;
  defaultEmploymentType?: 'Full Time' | 'Part Time' | 'Contract' | 'Temporary' | 'Internship' | 'Graduate / Entry Level';
  defaultWorkArrangement?: 'On-Site' | 'Remote' | 'Hybrid';
  suggestedRequiredSkills: string[];
  suggestedPreferredSkills: string[];
  suggestedResponsibilities: string[];
  suggestedMinimumExperience: number;
  suggestedPreferredExperience?: number;
  suggestedMinimumQualification: string;
  suggestedFieldOfStudy: string;
  suggestedCertifications: string[];
  typicalMonthlySalaryRangeZar?: [number, number];
}

export interface ProvinceCityCatalog {
  province: string;
  majorCities: string[];
}

export const SOUTH_AFRICA_PROVINCES: ProvinceCityCatalog[] = [
  {
    province: 'Gauteng',
    majorCities: [
      'Johannesburg',
      'Pretoria',
      'Sandton',
      'Centurion',
      'Midrand',
      'Rosebank',
      'Randburg',
      'Roodepoort',
      'Kempton Park',
      'Bedfordview',
      'Fourways',
      'Boksburg',
      'Benoni',
      'Germiston',
      'Vanderbijlpark'
    ],
  },
  {
    province: 'Western Cape',
    majorCities: [
      'Cape Town',
      'Stellenbosch',
      'Bellville',
      'Somerset West',
      'Paarl',
      'George',
      'Century City',
      'Claremont',
      'Durbanville',
      'Hermanus',
      'Knysna',
      'Mossel Bay'
    ],
  },
  {
    province: 'KwaZulu-Natal',
    majorCities: [
      'Durban',
      'Umhlanga',
      'Pietermaritzburg',
      'Ballito',
      'Pinetown',
      'Richards Bay',
      'Newcastle',
      'Hillcrest',
      'Westville',
      'Margate'
    ],
  },
  {
    province: 'Eastern Cape',
    majorCities: [
      'Gqeberha (Port Elizabeth)',
      'East London',
      'Makhanda (Grahamstown)',
      'Mthatha',
      'Jeffreys Bay',
      'Qonce (King William’s Town)'
    ],
  },
  {
    province: 'Free State',
    majorCities: [
      'Bloemfontein',
      'Welkom',
      'Sasolburg',
      'Bethlehem',
      'Parys',
      'Kroonstad'
    ],
  },
  {
    province: 'Mpumalanga',
    majorCities: [
      'Mbombela (Nelspruit)',
      'Emalahleni (Witbank)',
      'Secunda',
      'Middelburg',
      'White River'
    ],
  },
  {
    province: 'Limpopo',
    majorCities: [
      'Polokwane',
      'Tzaneen',
      'Mokopane',
      'Thohoyandou',
      'Phalaborwa',
      'Lephalale'
    ],
  },
  {
    province: 'North West',
    majorCities: [
      'Rustenburg',
      'Potchefstroom',
      'Mahikeng',
      'Klerksdorp',
      'Brits'
    ],
  },
  {
    province: 'Northern Cape',
    majorCities: [
      'Kimberley',
      'Upington',
      'Springbok',
      'De Aar',
      'Kathu'
    ],
  },
];

export const DEPARTMENT_SUGGESTIONS = [
  'Information Technology',
  'Software Engineering',
  'Data & Analytics',
  'Cloud & DevOps',
  'Cybersecurity',
  'Human Resources',
  'Talent Acquisition',
  'Finance & Accounting',
  'Marketing & Communications',
  'Sales & Business Development',
  'Product Management',
  'Design & User Experience',
  'Operations & Logistics',
  'Legal, Risk & Compliance',
  'Customer Success & Support',
  'Learning & Development',
  'Executive & General Management',
  'Engineering (Civil / Mech / Elec)'
];

export const ROLE_INTELLIGENCE_CATALOG: Record<string, RoleIntelligenceItem[]> = {
  'Information Technology': [
    {
      jobTitle: 'Full Stack Developer',
      department: 'Information Technology',
      defaultEmploymentType: 'Full Time',
      defaultWorkArrangement: 'Hybrid',
      suggestedRequiredSkills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'REST APIs', 'SQL', 'Git'],
      suggestedPreferredSkills: ['Docker', 'AWS', 'Next.js', 'PostgreSQL', 'GraphQL', 'Tailwind CSS'],
      suggestedResponsibilities: [
        'Design, build, and maintain scalable full-stack web applications and microservices.',
        'Collaborate with product managers, UI/UX designers, and QA engineers on feature specifications.',
        'Write clean, modular, and test-driven code across frontend and backend services.',
        'Participate in active code reviews, sprint planning, and architectural discussions.',
        'Optimize application performance, security headers, and database query latency.'
      ],
      suggestedMinimumExperience: 3,
      suggestedPreferredExperience: 5,
      suggestedMinimumQualification: "Bachelor's Degree (NQF 7)",
      suggestedFieldOfStudy: 'Computer Science / Information Technology / Software Engineering',
      suggestedCertifications: ['AWS Certified Developer - Associate', 'Meta Certified Front-End Developer'],
      typicalMonthlySalaryRangeZar: [35000, 55000]
    },
    {
      jobTitle: 'Software Developer',
      department: 'Information Technology',
      defaultEmploymentType: 'Full Time',
      defaultWorkArrangement: 'Hybrid',
      suggestedRequiredSkills: ['C#', '.NET Core', 'SQL Server', 'REST APIs', 'Git', 'OOP'],
      suggestedPreferredSkills: ['Azure', 'Entity Framework', 'Docker', 'Angular', 'CI/CD'],
      suggestedResponsibilities: [
        'Develop and maintain enterprise software solutions in line with business requirements.',
        'Create robust relational database schemas, stored procedures, and data access layers.',
        'Perform unit testing, integration testing, and bug remediation.',
        'Ensure adherence to high-quality software development lifecycle (SDLC) standards.'
      ],
      suggestedMinimumExperience: 3,
      suggestedPreferredExperience: 5,
      suggestedMinimumQualification: "Bachelor's Degree or National Diploma (NQF 6/7)",
      suggestedFieldOfStudy: 'Information Technology / Computer Science',
      suggestedCertifications: ['Microsoft Certified: Azure Developer Associate'],
      typicalMonthlySalaryRangeZar: [30000, 50000]
    },
    {
      jobTitle: 'Front-End Developer',
      department: 'Information Technology',
      defaultEmploymentType: 'Full Time',
      defaultWorkArrangement: 'Hybrid',
      suggestedRequiredSkills: ['React', 'TypeScript', 'HTML5', 'CSS3 / Tailwind', 'JavaScript ES6+', 'Git'],
      suggestedPreferredSkills: ['Next.js', 'Redux / Zustand', 'Figma', 'Jest / Playwright', 'Web Performance'],
      suggestedResponsibilities: [
        'Implement responsive, accessible, and high-performance user interfaces.',
        'Translate Figma/Adobe UX design wireframes into pixel-perfect interactive web components.',
        'Manage frontend application state, client-side caching, and API integrations.',
        'Identify and resolve cross-browser compatibility and mobile responsiveness bottlenecks.'
      ],
      suggestedMinimumExperience: 2,
      suggestedPreferredExperience: 4,
      suggestedMinimumQualification: "Bachelor's Degree or Diploma (NQF 6/7)",
      suggestedFieldOfStudy: 'Computer Science / Multimedia / Web Development',
      suggestedCertifications: ['Meta Front-End Developer Professional Certificate'],
      typicalMonthlySalaryRangeZar: [28000, 48000]
    },
    {
      jobTitle: 'Back-End Developer',
      department: 'Information Technology',
      defaultEmploymentType: 'Full Time',
      defaultWorkArrangement: 'Hybrid',
      suggestedRequiredSkills: ['Java', 'Spring Boot', 'PostgreSQL', 'RESTful APIs', 'Microservices', 'Git'],
      suggestedPreferredSkills: ['Kafka', 'Docker', 'Kubernetes', 'Redis', 'AWS / Azure', 'OAuth2'],
      suggestedResponsibilities: [
        'Architect and implement scalable microservices, background job workers, and business logic.',
        'Design and maintain high-throughput relational and non-relational database models.',
        'Implement secure authentication, authorization, and data encryption mechanisms.',
        'Monitor production server telemetry, latency metrics, and API error rates.'
      ],
      suggestedMinimumExperience: 3,
      suggestedPreferredExperience: 6,
      suggestedMinimumQualification: "Bachelor's Degree (NQF 7)",
      suggestedFieldOfStudy: 'Computer Science / Software Engineering',
      suggestedCertifications: ['Oracle Certified Professional: Java SE Developer', 'AWS Certified Solutions Architect'],
      typicalMonthlySalaryRangeZar: [38000, 60000]
    },
    {
      jobTitle: 'DevOps Engineer',
      department: 'Information Technology',
      defaultEmploymentType: 'Full Time',
      defaultWorkArrangement: 'Hybrid',
      suggestedRequiredSkills: ['Docker', 'Kubernetes', 'CI/CD Pipelines', 'Linux', 'Terraform', 'AWS / Azure'],
      suggestedPreferredSkills: ['Ansible', 'Prometheus', 'Grafana', 'Python / Bash Scripting', 'Helm', 'GitOps'],
      suggestedResponsibilities: [
        'Automate cloud infrastructure provisioning using Infrastructure as Code (Terraform).',
        'Maintain, monitor, and scale production Kubernetes clusters and container workloads.',
        'Build robust CI/CD pipelines for automated testing, artifact creation, and zero-downtime deployment.',
        'Ensure disaster recovery, automated backups, and 99.99% system availability.'
      ],
      suggestedMinimumExperience: 4,
      suggestedPreferredExperience: 6,
      suggestedMinimumQualification: "Bachelor's Degree / BTech (NQF 7)",
      suggestedFieldOfStudy: 'Computer Science / Cloud Computing / Information Systems',
      suggestedCertifications: ['Certified Kubernetes Administrator (CKA)', 'AWS Certified DevOps Engineer - Professional'],
      typicalMonthlySalaryRangeZar: [45000, 75000]
    },
    {
      jobTitle: 'Cloud Engineer',
      department: 'Information Technology',
      defaultEmploymentType: 'Full Time',
      defaultWorkArrangement: 'Hybrid',
      suggestedRequiredSkills: ['AWS / Azure Cloud', 'Terraform', 'Networking / VPC', 'Linux Administration', 'IAM & Security'],
      suggestedPreferredSkills: ['Kubernetes', 'Python', 'Serverless Architecture', 'Cost Optimization'],
      suggestedResponsibilities: [
        'Design and deploy enterprise multi-region cloud landing zones and virtual private clouds.',
        'Implement automated security baselines, IAM policies, and encryption keys.',
        'Collaborate with software engineers to deploy serverless and containerized cloud services.'
      ],
      suggestedMinimumExperience: 3,
      suggestedPreferredExperience: 5,
      suggestedMinimumQualification: "Bachelor's Degree (NQF 7)",
      suggestedFieldOfStudy: 'Computer Science / Information Technology',
      suggestedCertifications: ['AWS Solutions Architect Associate', 'Microsoft Azure Administrator (AZ-104)'],
      typicalMonthlySalaryRangeZar: [42000, 68000]
    },
    {
      jobTitle: 'Data Analyst',
      department: 'Information Technology',
      defaultEmploymentType: 'Full Time',
      defaultWorkArrangement: 'Hybrid',
      suggestedRequiredSkills: ['SQL', 'Power BI / Tableau', 'Excel (Advanced)', 'Data Modeling', 'Business Intelligence'],
      suggestedPreferredSkills: ['Python (Pandas)', 'DAX', 'ETL Pipelines', 'Statistical Analysis'],
      suggestedResponsibilities: [
        'Extract, transform, and analyze commercial datasets to derive strategic business insights.',
        'Develop and maintain interactive executive dashboards and automated KPI reports.',
        'Partner with department stakeholders to define reporting requirements and data governance metrics.'
      ],
      suggestedMinimumExperience: 2,
      suggestedPreferredExperience: 4,
      suggestedMinimumQualification: "Bachelor's Degree (NQF 7)",
      suggestedFieldOfStudy: 'Data Science / Statistics / Information Systems / Economics',
      suggestedCertifications: ['Microsoft Certified: Power BI Data Analyst Associate (PL-300)'],
      typicalMonthlySalaryRangeZar: [28000, 45000]
    },
    {
      jobTitle: 'Data Engineer',
      department: 'Information Technology',
      defaultEmploymentType: 'Full Time',
      defaultWorkArrangement: 'Hybrid',
      suggestedRequiredSkills: ['SQL', 'Python', 'Apache Spark / Databricks', 'Data Warehousing', 'ETL / ELT Pipelines'],
      suggestedPreferredSkills: ['Snowflake / BigQuery', 'Airflow', 'Kafka', 'dbt', 'AWS / Azure Data Factory'],
      suggestedResponsibilities: [
        'Architect, construct, test, and maintain robust data pipelines and enterprise data lakehouses.',
        'Ensure continuous data accuracy, consistency, and compliance with POPIA regulations.',
        'Optimize complex SQL transformations and batch/streaming data ingestion.'
      ],
      suggestedMinimumExperience: 3,
      suggestedPreferredExperience: 6,
      suggestedMinimumQualification: "Bachelor's Degree (NQF 7)",
      suggestedFieldOfStudy: 'Computer Science / Computer Engineering / Applied Mathematics',
      suggestedCertifications: ['AWS Certified Data Analytics', 'Databricks Certified Data Engineer Associate'],
      typicalMonthlySalaryRangeZar: [45000, 70000]
    },
    {
      jobTitle: 'Cybersecurity Analyst',
      department: 'Information Technology',
      defaultEmploymentType: 'Full Time',
      defaultWorkArrangement: 'Hybrid',
      suggestedRequiredSkills: ['Security Operations (SOC)', 'SIEM Tools (Splunk / Sentinel)', 'Vulnerability Assessment', 'Incident Response', 'Network Security'],
      suggestedPreferredSkills: ['Threat Hunting', 'Penetration Testing', 'ISO 27001', 'POPIA / GDPR Compliance', 'Firewalls'],
      suggestedResponsibilities: [
        'Monitor enterprise networks, endpoints, and cloud workloads for security anomalies and breaches.',
        'Triage, investigate, and remediate cyber security incidents and suspicious activities.',
        'Perform recurring vulnerability scans and coordinate patching across infrastructure teams.'
      ],
      suggestedMinimumExperience: 3,
      suggestedPreferredExperience: 5,
      suggestedMinimumQualification: "Bachelor's Degree or Diploma (NQF 6/7)",
      suggestedFieldOfStudy: 'Cybersecurity / Information Security / Computer Science',
      suggestedCertifications: ['CompTIA Security+', 'Certified Information Systems Security Professional (CISSP)', 'CEH'],
      typicalMonthlySalaryRangeZar: [38000, 62000]
    },
    {
      jobTitle: 'IT Project Manager',
      department: 'Information Technology',
      defaultEmploymentType: 'Full Time',
      defaultWorkArrangement: 'Hybrid',
      suggestedRequiredSkills: ['Agile / Scrum Methodologies', 'Jira / Confluence', 'Project Scope & Budget Management', 'Stakeholder Management', 'Risk Mitigation'],
      suggestedPreferredSkills: ['Prince2 / PMP', 'Software Development Lifecycle (SDLC)', 'Vendor Management', 'Resource Planning'],
      suggestedResponsibilities: [
        'Lead cross-functional engineering teams to deliver complex software projects on time and within budget.',
        'Facilitate Agile ceremonies: sprint planning, daily stand-ups, backlog grooming, and sprint retrospectives.',
        'Manage project risks, issues, dependencies, and clear roadblocks for developer productivity.'
      ],
      suggestedMinimumExperience: 4,
      suggestedPreferredExperience: 7,
      suggestedMinimumQualification: "Bachelor's Degree (NQF 7)",
      suggestedFieldOfStudy: 'Project Management / Information Systems / Business Informatics',
      suggestedCertifications: ['PMP (Project Management Professional)', 'Certified ScrumMaster (CSM)', 'PRINCE2 Practitioner'],
      typicalMonthlySalaryRangeZar: [45000, 70000]
    },
    {
      jobTitle: 'IT Support Specialist',
      department: 'Information Technology',
      defaultEmploymentType: 'Full Time',
      defaultWorkArrangement: 'On-Site',
      suggestedRequiredSkills: ['Windows / macOS Troubleshooting', 'Active Directory / Entra ID', 'Hardware Diagnostic', 'Helpdesk Ticketing', 'Networking Basics'],
      suggestedPreferredSkills: ['Office 365 Administration', 'MDM (Microsoft Intune)', 'ITIL Foundations', 'VoIP Systems'],
      suggestedResponsibilities: [
        'Provide Tier 1 and Tier 2 technical assistance for hardware, software, and networking issues.',
        'Configure, deploy, and onboard laptops, monitors, and workstation equipment for employees.',
        'Manage user accounts, password resets, access groups, and software licenses.'
      ],
      suggestedMinimumExperience: 1,
      suggestedPreferredExperience: 3,
      suggestedMinimumQualification: 'Higher Certificate or National Diploma (NQF 5/6)',
      suggestedFieldOfStudy: 'Information Technology / Computer Support Services',
      suggestedCertifications: ['CompTIA A+', 'CompTIA Network+', 'ITIL v4 Foundation'],
      typicalMonthlySalaryRangeZar: [16000, 26000]
    }
  ],

  'Human Resources': [
    {
      jobTitle: 'Talent Acquisition Specialist',
      department: 'Human Resources',
      defaultEmploymentType: 'Full Time',
      defaultWorkArrangement: 'Hybrid',
      suggestedRequiredSkills: ['End-to-End Recruitment', 'Candidate Sourcing (LinkedIn Recruiter)', 'Competency-Based Interviewing', 'ATS Management', 'POPIA Compliance'],
      suggestedPreferredSkills: ['Tech Recruitment', 'Salary Benchmarking', 'Employer Branding', 'Boolean Search Techniques'],
      suggestedResponsibilities: [
        'Manage the full recruitment lifecycle from intake meetings to candidate offer acceptance.',
        'Source, screen, and build active talent pipelines for technical and operational vacancies.',
        'Conduct competency-based screening interviews and coordinate technical assessments with hiring managers.'
      ],
      suggestedMinimumExperience: 3,
      suggestedPreferredExperience: 5,
      suggestedMinimumQualification: "Bachelor's Degree or Diploma (NQF 6/7)",
      suggestedFieldOfStudy: 'Human Resources Management / Industrial Psychology / Business Administration',
      suggestedCertifications: ['SABPP Registered HR Professional', 'AIRS Certified Diversity Recruiter'],
      typicalMonthlySalaryRangeZar: [28000, 45000]
    },
    {
      jobTitle: 'HR Officer',
      department: 'Human Resources',
      defaultEmploymentType: 'Full Time',
      defaultWorkArrangement: 'Hybrid',
      suggestedRequiredSkills: ['Labour Relations (BCEA / LRA)', 'HR Policies & Procedures', 'Employee Onboarding & Offboarding', 'Disciplinary Hearings', 'HR Administration'],
      suggestedPreferredSkills: ['Employment Equity (EE)', 'Workplace Skills Plan (WSP/ATR)', 'CCMA Preparation'],
      suggestedResponsibilities: [
        'Administer core HR processes including contracts, leave tracking, employee records, and grievances.',
        'Ensure organizational compliance with South African labor legislation (LRA, BCEA, EE, POPIA).',
        'Facilitate employee onboarding, induction programs, and performance review cycles.'
      ],
      suggestedMinimumExperience: 3,
      suggestedPreferredExperience: 5,
      suggestedMinimumQualification: "Bachelor's Degree or Diploma (NQF 6/7)",
      suggestedFieldOfStudy: 'Human Resource Management / Labour Relations',
      suggestedCertifications: ['SABPP Registered HR Candidate / Practitioner'],
      typicalMonthlySalaryRangeZar: [25000, 40000]
    },
    {
      jobTitle: 'HR Business Partner',
      department: 'Human Resources',
      defaultEmploymentType: 'Full Time',
      defaultWorkArrangement: 'Hybrid',
      suggestedRequiredSkills: ['Strategic HR Consulting', 'Organizational Development', 'Talent Management & Succession', 'Change Management', 'Executive Coaching'],
      suggestedPreferredSkills: ['Workforce Planning', 'B-BBEE Transformation Strategy', 'Employee Engagement Metrics'],
      suggestedResponsibilities: [
        'Partner with executive business leaders to design and implement human capital strategies aligned with business goals.',
        'Lead talent calibration, succession planning, leadership development, and organizational restructuring.',
        'Resolve complex employee relations matters and foster a high-performance workplace culture.'
      ],
      suggestedMinimumExperience: 6,
      suggestedPreferredExperience: 9,
      suggestedMinimumQualification: "Honours Degree / Bachelor's (NQF 7/8)",
      suggestedFieldOfStudy: 'Human Resource Management / Industrial Psychology',
      suggestedCertifications: ['SABPP Chartered HR Professional', 'SHRM-SCP / CIPD Level 7'],
      typicalMonthlySalaryRangeZar: [50000, 80000]
    },
    {
      jobTitle: 'Payroll Administrator',
      department: 'Human Resources',
      defaultEmploymentType: 'Full Time',
      defaultWorkArrangement: 'Hybrid',
      suggestedRequiredSkills: ['Payroll Processing (Sage / VIP Payroll)', 'SARS Tax Submissions (EMP201 / EMP501)', 'UIF & COIDA Compliance', 'Pension / Provident Funds', 'Leave Administration'],
      suggestedPreferredSkills: ['Advanced Excel', 'Medical Aid Administration', 'Reconciliation Reports'],
      suggestedResponsibilities: [
        'Process monthly end-to-end payroll for salaried and hourly employees accurately and on time.',
        'Reconcile payroll general ledger entries and submit monthly EMP201 returns to SARS.',
        'Manage employee queries regarding pay slips, tax deductions, bonuses, and travel allowances.'
      ],
      suggestedMinimumExperience: 3,
      suggestedPreferredExperience: 5,
      suggestedMinimumQualification: 'National Diploma or Certificate (NQF 5/6)',
      suggestedFieldOfStudy: 'Payroll Administration / Financial Accounting / HR',
      suggestedCertifications: ['Sage VIP Certified Payroll Administrator', 'PAGSA Certified Payroll Practitioner'],
      typicalMonthlySalaryRangeZar: [22000, 36000]
    },
    {
      jobTitle: 'Learning & Development Specialist',
      department: 'Human Resources',
      defaultEmploymentType: 'Full Time',
      defaultWorkArrangement: 'Hybrid',
      suggestedRequiredSkills: ['Curriculum Design', 'LMS Administration', 'Training Needs Analysis', 'WSP & ATR Submissions', 'Facilitation & Presentation'],
      suggestedPreferredSkills: ['Articulate 360 / Storyline', 'Instructional Design', 'SETA Accreditation Liaison'],
      suggestedResponsibilities: [
        'Conduct company-wide training needs analyses and design modern blended learning programs.',
        'Administer the Learning Management System (LMS) and track employee compliance certifications.',
        'Compile and submit Workplace Skills Plans (WSP) and Annual Training Reports (ATR) to relevant SETAs.'
      ],
      suggestedMinimumExperience: 3,
      suggestedPreferredExperience: 6,
      suggestedMinimumQualification: "Bachelor's Degree or Diploma (NQF 6/7)",
      suggestedFieldOfStudy: 'Education / Human Resource Development / Industrial Psychology',
      suggestedCertifications: ['SETA Registered Assessor & Moderator', 'Certified Instructional Designer'],
      typicalMonthlySalaryRangeZar: [30000, 48000]
    }
  ],

  'Finance': [
    {
      jobTitle: 'Financial Accountant',
      department: 'Finance',
      defaultEmploymentType: 'Full Time',
      defaultWorkArrangement: 'Hybrid',
      suggestedRequiredSkills: ['General Ledger Management', 'IFRS Standards', 'Financial Statements Preparation', 'VAT & Tax Calculations', 'Reconciliations'],
      suggestedPreferredSkills: ['Sage / SAP / NetSuite', 'Advanced Excel', 'Audit Preparation', 'SAIPA / SAICA Accredited'],
      suggestedResponsibilities: [
        'Prepare monthly management accounts, balance sheet reconciliations, and annual financial statements.',
        'Ensure full compliance with IFRS, Companies Act, and South African tax legislation.',
        'Liaise with external auditors and manage audit deliverables efficiently.'
      ],
      suggestedMinimumExperience: 3,
      suggestedPreferredExperience: 6,
      suggestedMinimumQualification: 'BCom Accounting (NQF 7)',
      suggestedFieldOfStudy: 'Financial Accounting / Auditing',
      suggestedCertifications: ['SAIPA (Professional Accountant SA)', 'SAICA CA(SA) or AGA(SA)'],
      typicalMonthlySalaryRangeZar: [35000, 58000]
    },
    {
      jobTitle: 'Management Accountant',
      department: 'Finance',
      defaultEmploymentType: 'Full Time',
      defaultWorkArrangement: 'Hybrid',
      suggestedRequiredSkills: ['Cost Accounting', 'Budgeting & Forecasting', 'Variance Analysis', 'Financial Modeling', 'Profitability Analysis'],
      suggestedPreferredSkills: ['CIMA', 'Power BI / Tableau', 'ERP Systems (SAP / Oracle)'],
      suggestedResponsibilities: [
        'Develop detailed annual budgets, quarterly forecasts, and monthly variance analyses.',
        'Analyze product and service margins, cost drivers, and operational efficiencies.',
        'Provide actionable financial recommendations to department heads and executive directors.'
      ],
      suggestedMinimumExperience: 4,
      suggestedPreferredExperience: 7,
      suggestedMinimumQualification: 'BCom Honours in Accounting or CIMA (NQF 8)',
      suggestedFieldOfStudy: 'Management Accounting / Financial Management',
      suggestedCertifications: ['CIMA ACMA / CGMA', 'SAICA CA(SA)'],
      typicalMonthlySalaryRangeZar: [42000, 68000]
    },
    {
      jobTitle: 'Financial Analyst',
      department: 'Finance',
      defaultEmploymentType: 'Full Time',
      defaultWorkArrangement: 'Hybrid',
      suggestedRequiredSkills: ['Financial Modeling', 'Valuation & DCF Analysis', 'Excel (Macros / Advanced)', 'KPI Dashboarding', 'Trend Analysis'],
      suggestedPreferredSkills: ['Power BI', 'SQL', 'CFA Candidate / Level 1/2', 'M&A Due Diligence'],
      suggestedResponsibilities: [
        'Build dynamic financial models for new business investments, capital projects, and pricing strategies.',
        'Evaluate market trends, competitor benchmarks, and macroeconomic indicators.',
        'Prepare executive investment committee presentations and performance decks.'
      ],
      suggestedMinimumExperience: 2,
      suggestedPreferredExperience: 5,
      suggestedMinimumQualification: "Bachelor's Degree in Finance / Economics (NQF 7)",
      suggestedFieldOfStudy: 'Finance / Investment Management / Economics',
      suggestedCertifications: ['CFA (Chartered Financial Analyst) Level 1/2'],
      typicalMonthlySalaryRangeZar: [32000, 52000]
    },
    {
      jobTitle: 'Bookkeeper',
      department: 'Finance',
      defaultEmploymentType: 'Full Time',
      defaultWorkArrangement: 'On-Site',
      suggestedRequiredSkills: ['Accounts Payable & Receivable', 'Bank Reconciliations', 'Trial Balance', 'VAT Submissions', 'Invoicing'],
      suggestedPreferredSkills: ['Sage One / Xero / QuickBooks', 'Debtors Collections', 'Cash Flow Tracking'],
      suggestedResponsibilities: [
        'Record daily financial transactions, customer receipts, and vendor invoice payments.',
        'Perform monthly bank and credit card reconciliations up to trial balance stage.',
        'Follow up on outstanding customer accounts receivable and prepare VAT201 return documentation.'
      ],
      suggestedMinimumExperience: 2,
      suggestedPreferredExperience: 5,
      suggestedMinimumQualification: 'National Diploma or Certificate in Bookkeeping (NQF 5/6)',
      suggestedFieldOfStudy: 'Financial Bookkeeping / Accounting',
      suggestedCertifications: ['ICB (Institute of Certified Bookkeepers) Certified Senior Bookkeeper'],
      typicalMonthlySalaryRangeZar: [18000, 28000]
    },
    {
      jobTitle: 'Accounts Payable Clerk',
      department: 'Finance',
      defaultEmploymentType: 'Full Time',
      defaultWorkArrangement: 'On-Site',
      suggestedRequiredSkills: ['Invoice Matching & Verification', 'Creditors Reconciliation', 'Purchase Orders (3-Way Match)', 'Payment Batches', 'Vendor Query Resolution'],
      suggestedPreferredSkills: ['Sage / SAP Creditors Module', 'Excel Spreadsheets'],
      suggestedResponsibilities: [
        'Process supplier invoices ensuring compliance with 3-way purchase order matching.',
        'Reconcile monthly supplier statements and resolve price or quantity discrepancies.',
        'Prepare electronic funds transfer (EFT) payment batches for managerial release.'
      ],
      suggestedMinimumExperience: 2,
      suggestedPreferredExperience: 4,
      suggestedMinimumQualification: 'Matric / Certificate in Accounting (NQF 4/5)',
      suggestedFieldOfStudy: 'Accounting / Finance',
      suggestedCertifications: [],
      typicalMonthlySalaryRangeZar: [16000, 24000]
    }
  ]
};

export const STANDARD_BENEFITS_CATALOG = [
  'Medical Aid Contribution / Subsidy',
  'Retirement / Pension Fund (Company Contribution)',
  'Annual Performance Bonus',
  '13th Cheque / Year-End Bonus',
  'Remote Work Option / Work From Home Allowance',
  'Flexible Working Hours / Flexitime',
  'Continuous Training & Education Bursary',
  'Company Vehicle / Travel Allowance',
  'Cellphone & Fiber Internet Allowance',
  'Comprehensive Life, Disability & Dread Disease Cover',
  'Employee Assistance Program (EAP) & Mental Wellness',
  'Gym Membership / Wellness Benefit',
  'Employee Share Options Scheme (ESOP)',
  'Generous Annual & Study Leave'
];

export const QUALIFICATION_LEVELS = [
  'Matric / Grade 12 (NQF 4)',
  'Higher Certificate (NQF 5)',
  'National Diploma (NQF 6)',
  "Bachelor's Degree (NQF 7)",
  'BTech / Advanced Diploma (NQF 7)',
  'Honours Degree / Postgraduate Diploma (NQF 8)',
  "Master's Degree (NQF 9)",
  'Doctorate / PhD (NQF 10)',
  'Industry Certification / Equivalent Experience'
];

export const EMPLOYMENT_TYPES: Array<'Full Time' | 'Part Time' | 'Contract' | 'Temporary' | 'Internship' | 'Graduate / Entry Level'> = [
  'Full Time',
  'Part Time',
  'Contract',
  'Temporary',
  'Internship',
  'Graduate / Entry Level'
];

export const WORK_ARRANGEMENTS: Array<'On-Site' | 'Hybrid' | 'Remote'> = [
  'On-Site',
  'Hybrid',
  'Remote'
];

/**
 * Intelligent helper to query role suggestions by department
 */
export function getJobTitlesForDepartment(departmentName: string): string[] {
  if (!departmentName) return [];
  const cleanDept = departmentName.trim().toLowerCase();

  // 1. Direct key match
  for (const [key, items] of Object.entries(ROLE_INTELLIGENCE_CATALOG)) {
    if (key.toLowerCase().includes(cleanDept) || cleanDept.includes(key.toLowerCase())) {
      return items.map((i) => i.jobTitle);
    }
  }

  // 2. Keyword fallbacks
  if (cleanDept.includes('tech') || cleanDept.includes('it') || cleanDept.includes('software') || cleanDept.includes('dev') || cleanDept.includes('data')) {
    return (ROLE_INTELLIGENCE_CATALOG['Information Technology'] || []).map(i => i.jobTitle);
  }
  if (cleanDept.includes('hr') || cleanDept.includes('human') || cleanDept.includes('people') || cleanDept.includes('talent') || cleanDept.includes('recruit')) {
    return (ROLE_INTELLIGENCE_CATALOG['Human Resources'] || []).map(i => i.jobTitle);
  }
  if (cleanDept.includes('fin') || cleanDept.includes('account') || cleanDept.includes('money') || cleanDept.includes('audit')) {
    return (ROLE_INTELLIGENCE_CATALOG['Finance'] || []).map(i => i.jobTitle);
  }

  return [];
}

/**
 * Intelligent helper to find role intelligence details for a job title
 */
export function getRoleIntelligenceForTitle(jobTitle: string): RoleIntelligenceItem | null {
  if (!jobTitle) return null;
  const cleanTitle = jobTitle.trim().toLowerCase();

  for (const items of Object.values(ROLE_INTELLIGENCE_CATALOG)) {
    for (const item of items) {
      if (item.jobTitle.toLowerCase() === cleanTitle) {
        return item;
      }
      if (cleanTitle.includes(item.jobTitle.toLowerCase()) || item.jobTitle.toLowerCase().includes(cleanTitle)) {
        return item;
      }
    }
  }

  // Generic heuristic fallback for common tech titles
  if (cleanTitle.includes('react') || cleanTitle.includes('frontend') || cleanTitle.includes('front-end')) {
    return ROLE_INTELLIGENCE_CATALOG['Information Technology']?.find(i => i.jobTitle === 'Front-End Developer') || null;
  }
  if (cleanTitle.includes('full stack') || cleanTitle.includes('fullstack') || cleanTitle.includes('developer')) {
    return ROLE_INTELLIGENCE_CATALOG['Information Technology']?.find(i => i.jobTitle === 'Full Stack Developer') || null;
  }
  if (cleanTitle.includes('python') || cleanTitle.includes('data engineer')) {
    return ROLE_INTELLIGENCE_CATALOG['Information Technology']?.find(i => i.jobTitle === 'Data Engineer') || null;
  }
  if (cleanTitle.includes('data analyst') || cleanTitle.includes('power bi')) {
    return ROLE_INTELLIGENCE_CATALOG['Information Technology']?.find(i => i.jobTitle === 'Data Analyst') || null;
  }
  if (cleanTitle.includes('accountant') || cleanTitle.includes('accounting')) {
    return ROLE_INTELLIGENCE_CATALOG['Finance']?.find(i => i.jobTitle === 'Financial Accountant') || null;
  }
  if (cleanTitle.includes('recruiter') || cleanTitle.includes('talent')) {
    return ROLE_INTELLIGENCE_CATALOG['Human Resources']?.find(i => i.jobTitle === 'Talent Acquisition Specialist') || null;
  }

  return null;
}
