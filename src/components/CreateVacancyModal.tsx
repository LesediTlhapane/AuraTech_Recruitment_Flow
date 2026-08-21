import React, { useState, useEffect } from 'react';
import { JobProfile, EmploymentType, LocationType } from '../types';
import {
  Sparkles,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  Clock,
  FileText,
  CheckCircle2,
  Info,
  Plus,
  Trash2,
  X,
  Briefcase,
  GraduationCap,
  Award,
  ChevronRight,
  HelpCircle,
  Layers,
  Check,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { analyzeJobWithAi } from '../services/api';
import {
  formatMonthlySalaryRange,
  calculateAnnualPackage,
  getClosingDateIndicator,
  formatLocationDisplay,
} from '../utils/vacancyUtils';
import { getCompanySuggestions, CompanySuggestionItem } from '../data/companySuggestions';
import {
  SOUTH_AFRICA_PROVINCES,
  DEPARTMENT_SUGGESTIONS,
  ROLE_INTELLIGENCE_CATALOG,
  STANDARD_BENEFITS_CATALOG,
  QUALIFICATION_LEVELS,
  EMPLOYMENT_TYPES,
  WORK_ARRANGEMENTS,
  getJobTitlesForDepartment,
  getRoleIntelligenceForTitle,
  RoleIntelligenceItem,
} from '../data/recruitmentCatalog';

interface CreateVacancyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddJob: (job: JobProfile) => Promise<void> | void;
}

export const CreateVacancyModal: React.FC<CreateVacancyModalProps> = ({
  isOpen,
  onClose,
  onAddJob,
}) => {
  // Primary Form State - empty uninitiated values so users can start from scratch
  const [jobTitle, setJobTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [company, setCompany] = useState('');
  const [industry, setIndustry] = useState('');
  const [employmentType, setEmploymentType] = useState<EmploymentType | ''>('');
  const [workArrangement, setWorkArrangement] = useState<LocationType | ''>('');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [specificLocation, setSpecificLocation] = useState('');
  const [jobRefNumber, setJobRefNumber] = useState(() => `AURA-VAC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
  
  // Salary State (uninitiated / empty)
  const [salaryMinMonthly, setSalaryMinMonthly] = useState<number | ''>('');
  const [salaryMaxMonthly, setSalaryMaxMonthly] = useState<number | ''>('');

  // Closing Date (empty)
  const [closingDate, setClosingDate] = useState('');

  // Description & Responsibilities (empty)
  const [aboutRole, setAboutRole] = useState('');
  const [responsibilities, setResponsibilities] = useState<string[]>([]);
  const [newResponsibilityInput, setNewResponsibilityInput] = useState('');

  // Requirements & Qualifications (empty)
  const [minimumExperienceYears, setMinimumExperienceYears] = useState<number | ''>('');
  const [preferredExperienceYears, setPreferredExperienceYears] = useState<number | ''>('');
  const [experienceDescription, setExperienceDescription] = useState('');
  const [minimumQualification, setMinimumQualification] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [preferredQualification, setPreferredQualification] = useState('');
  
  // Certifications Tags (empty)
  const [certifications, setCertifications] = useState<string[]>([]);
  const [newCertInput, setNewCertInput] = useState('');

  // Skills (empty)
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [preferredSkills, setPreferredSkills] = useState<string[]>([]);
  const [newRequiredSkillInput, setNewRequiredSkillInput] = useState('');
  const [newPreferredSkillInput, setNewPreferredSkillInput] = useState('');

  // Benefits (empty)
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([]);
  const [customBenefitInput, setCustomBenefitInput] = useState('');

  // AI Parser State
  const [rawSpecText, setRawSpecText] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showAiSuggestionsModal, setShowAiSuggestionsModal] = useState(false);
  const [parsedSuggestions, setParsedSuggestions] = useState<Partial<JobProfile> | null>(null);

  // Suggestions & Contextual State
  const [companySuggestions, setCompanySuggestions] = useState<CompanySuggestionItem[]>([]);
  const [availableJobTitles, setAvailableJobTitles] = useState<string[]>([]);
  const [roleIntelligence, setRoleIntelligence] = useState<RoleIntelligenceItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form helper
  const resetForm = () => {
    setJobTitle('');
    setDepartment('');
    setCompany('');
    setIndustry('');
    setEmploymentType('');
    setWorkArrangement('');
    setProvince('');
    setCity('');
    setSpecificLocation('');
    setJobRefNumber(`AURA-VAC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
    setSalaryMinMonthly('');
    setSalaryMaxMonthly('');
    setClosingDate('');
    setAboutRole('');
    setResponsibilities([]);
    setNewResponsibilityInput('');
    setMinimumExperienceYears('');
    setPreferredExperienceYears('');
    setExperienceDescription('');
    setMinimumQualification('');
    setFieldOfStudy('');
    setPreferredQualification('');
    setCertifications([]);
    setNewCertInput('');
    setRequiredSkills([]);
    setPreferredSkills([]);
    setNewRequiredSkillInput('');
    setNewPreferredSkillInput('');
    setSelectedBenefits([]);
    setCustomBenefitInput('');
    setRawSpecText('');
    setParsedSuggestions(null);
    setShowAiSuggestionsModal(false);
    setCompanySuggestions([]);
    setRoleIntelligence(null);
  };

  // Reset fields each time the modal opens
  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  // Update available job titles when department changes
  useEffect(() => {
    if (department) {
      const titles = getJobTitlesForDepartment(department);
      setAvailableJobTitles(titles);
    } else {
      setAvailableJobTitles([]);
    }
  }, [department]);

  // Update role intelligence when job title changes
  useEffect(() => {
    if (jobTitle.trim()) {
      const intel = getRoleIntelligenceForTitle(jobTitle);
      setRoleIntelligence(intel);
    } else {
      setRoleIntelligence(null);
    }
  }, [jobTitle]);

  // Cities for selected province
  const currentProvinceData = SOUTH_AFRICA_PROVINCES.find((p) => p.province === province);
  const availableCities = currentProvinceData 
    ? currentProvinceData.majorCities 
    : ['Johannesburg', 'Pretoria', 'Cape Town', 'Durban', 'Gqeberha', 'Bloemfontein', 'Polokwane', 'Mbombela'];

  // Live Annual Package
  const annualPackage = calculateAnnualPackage(Number(salaryMinMonthly || 0), Number(salaryMaxMonthly || 0));
  const closingIndicator = getClosingDateIndicator(closingDate);

  if (!isOpen) return null;

  // Handle Company autocomplete
  const handleCompanyChange = (val: string) => {
    setCompany(val);
    if (val.length >= 2) {
      const matches = getCompanySuggestions(val, [company]);
      setCompanySuggestions(matches);
    } else {
      setCompanySuggestions([]);
    }
  };

  const handleSelectCompany = (item: CompanySuggestionItem) => {
    setCompany(item.name);
    setIndustry(item.industry);
    setWorkArrangement(item.defaultLocationType);
    if (item.knownLocation.includes(',')) {
      const parts = item.knownLocation.split(',');
      const cityPart = parts[0].trim();
      const provPart = parts[1].trim();
      setCity(cityPart);
      if (provPart.includes('Gauteng')) setProvince('Gauteng');
      else if (provPart.includes('Western Cape')) setProvince('Western Cape');
      else if (provPart.includes('KwaZulu')) setProvince('KwaZulu-Natal');
    } else {
      setCity(item.knownLocation);
    }
    setCompanySuggestions([]);
  };

  // Apply Role Intelligence preset to form (Intelligent Suggestions)
  const handleApplyRoleIntelligence = (intel: RoleIntelligenceItem) => {
    setJobTitle(intel.jobTitle);
    if (intel.suggestedRequiredSkills?.length) {
      setRequiredSkills(intel.suggestedRequiredSkills);
    }
    if (intel.suggestedPreferredSkills?.length) {
      setPreferredSkills(intel.suggestedPreferredSkills);
    }
    if (intel.suggestedResponsibilities?.length) {
      setResponsibilities(intel.suggestedResponsibilities);
    }
    if (intel.suggestedMinimumExperience) {
      setMinimumExperienceYears(intel.suggestedMinimumExperience);
    }
    if (intel.suggestedPreferredExperience) {
      setPreferredExperienceYears(intel.suggestedPreferredExperience);
    }
    if (intel.suggestedMinimumQualification) {
      setMinimumQualification(intel.suggestedMinimumQualification);
    }
    if (intel.suggestedFieldOfStudy) {
      setFieldOfStudy(intel.suggestedFieldOfStudy);
    }
    if (intel.suggestedCertifications?.length) {
      setCertifications(intel.suggestedCertifications);
    }
    if (intel.typicalMonthlySalaryRangeZar) {
      setSalaryMinMonthly(intel.typicalMonthlySalaryRangeZar[0]);
      setSalaryMaxMonthly(intel.typicalMonthlySalaryRangeZar[1]);
    }
  };

  // Add/Remove Skills
  const handleAddRequiredSkill = (skill: string) => {
    const clean = skill.trim();
    if (!clean) return;
    if (!requiredSkills.includes(clean)) {
      setRequiredSkills([...requiredSkills, clean]);
      setPreferredSkills(preferredSkills.filter(s => s !== clean));
    }
    setNewRequiredSkillInput('');
  };

  const handleAddPreferredSkill = (skill: string) => {
    const clean = skill.trim();
    if (!clean) return;
    if (!preferredSkills.includes(clean)) {
      setPreferredSkills([...preferredSkills, clean]);
      setRequiredSkills(requiredSkills.filter(s => s !== clean));
    }
    setNewPreferredSkillInput('');
  };

  const handleToggleSkillPriority = (skill: string, current: 'required' | 'preferred') => {
    if (current === 'required') {
      setRequiredSkills(requiredSkills.filter(s => s !== skill));
      if (!preferredSkills.includes(skill)) setPreferredSkills([...preferredSkills, skill]);
    } else {
      setPreferredSkills(preferredSkills.filter(s => s !== skill));
      if (!requiredSkills.includes(skill)) setRequiredSkills([...requiredSkills, skill]);
    }
  };

  // Add/Remove Responsibilities
  const handleAddResponsibility = () => {
    const clean = newResponsibilityInput.trim();
    if (clean && !responsibilities.includes(clean)) {
      setResponsibilities([...responsibilities, clean]);
      setNewResponsibilityInput('');
    }
  };

  const handleRemoveResponsibility = (index: number) => {
    setResponsibilities(responsibilities.filter((_, i) => i !== index));
  };

  // Add/Remove Certifications
  const handleAddCert = () => {
    const clean = newCertInput.trim();
    if (clean && !certifications.includes(clean)) {
      setCertifications([...certifications, clean]);
      setNewCertInput('');
    }
  };

  // Toggle Benefits
  const handleToggleBenefit = (b: string) => {
    if (selectedBenefits.includes(b)) {
      setSelectedBenefits(selectedBenefits.filter(item => item !== b));
    } else {
      setSelectedBenefits([...selectedBenefits, b]);
    }
  };

  const handleAddCustomBenefit = () => {
    const clean = customBenefitInput.trim();
    if (clean && !selectedBenefits.includes(clean)) {
      setSelectedBenefits([...selectedBenefits, clean]);
      setCustomBenefitInput('');
    }
  };

  // AI Quick Spec Parser
  const handleRunAiParser = async () => {
    if (!rawSpecText.trim()) return;
    setIsAiLoading(true);
    try {
      const parsed = await analyzeJobWithAi(rawSpecText);
      setParsedSuggestions(parsed);
      setShowAiSuggestionsModal(true);
    } catch (err) {
      console.error('AI quick parse error:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Apply parsed AI suggestions (Non-destructive merge)
  const handleApplyAiSuggestions = (overwriteAll: boolean) => {
    if (!parsedSuggestions) return;
    const p = parsedSuggestions;

    if (overwriteAll || !jobTitle) if (p.jobTitle) setJobTitle(p.jobTitle);
    if (overwriteAll || !department) if (p.department) setDepartment(p.department);
    if (overwriteAll || !company) if (p.company) setCompany(p.company);
    if (overwriteAll || !industry) if (p.industry) setIndustry(p.industry);
    if (p.locationType) setWorkArrangement(p.locationType);
    if (p.employmentType) setEmploymentType(p.employmentType);
    
    if (p.salaryMinZar) setSalaryMinMonthly(p.salaryMinZar);
    if (p.salaryMaxZar) setSalaryMaxMonthly(p.salaryMaxZar);
    if (p.minimumExperienceYears) setMinimumExperienceYears(p.minimumExperienceYears);
    if (p.preferredExperienceYears) setPreferredExperienceYears(p.preferredExperienceYears);
    if (p.minimumQualification) setMinimumQualification(p.minimumQualification);
    if (p.fieldOfStudy) setFieldOfStudy(p.fieldOfStudy);
    if (p.preferredQualification) setPreferredQualification(p.preferredQualification);

    if (Array.isArray(p.requiredSkills) && p.requiredSkills.length > 0) {
      setRequiredSkills(overwriteAll ? p.requiredSkills : Array.from(new Set([...requiredSkills, ...p.requiredSkills])));
    }
    if (Array.isArray(p.preferredSkills) && p.preferredSkills.length > 0) {
      setPreferredSkills(overwriteAll ? p.preferredSkills : Array.from(new Set([...preferredSkills, ...p.preferredSkills])));
    }
    if (Array.isArray(p.responsibilities) && p.responsibilities.length > 0) {
      setResponsibilities(overwriteAll ? p.responsibilities : Array.from(new Set([...responsibilities, ...p.responsibilities])));
    }
    if (Array.isArray(p.certifications) && p.certifications.length > 0) {
      setCertifications(overwriteAll ? p.certifications : Array.from(new Set([...certifications, ...p.certifications])));
    }
    if (Array.isArray(p.benefits) && p.benefits.length > 0) {
      setSelectedBenefits(overwriteAll ? p.benefits : Array.from(new Set([...selectedBenefits, ...p.benefits])));
    }
    if (p.aboutRole) setAboutRole(p.aboutRole);
    if (p.closingDate) setClosingDate(p.closingDate);

    setShowAiSuggestionsModal(false);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim()) return;

    setIsSubmitting(true);

    const safeProvince = province || 'Gauteng';
    const safeCity = city || 'South Africa';
    const safeLocationType = (workArrangement || 'On-Site') as LocationType;
    const safeEmploymentType = (employmentType || 'Full Time') as EmploymentType;

    const fullLocation = workArrangement === 'Remote' 
      ? `Remote (${city || 'South Africa'})` 
      : specificLocation.trim() 
        ? `${specificLocation}, ${city || 'South Africa'}, ${province || ''}` 
        : city ? `${city}, ${province || 'South Africa'}` : (province || 'South Africa');

    const assembledDescription = aboutRole.trim() || 
      `${jobTitle} position${company ? ` at ${company}` : ''}.${minimumExperienceYears ? ` Minimum ${minimumExperienceYears} years of professional experience required.` : ''}${requiredSkills.length > 0 ? ` Seeking key proficiencies in ${requiredSkills.join(', ')}.` : ''}`;

    const qualificationsList: string[] = [
      minimumQualification,
      fieldOfStudy ? `Field: ${fieldOfStudy}` : '',
      preferredQualification ? `Preferred: ${preferredQualification}` : '',
      ...certifications
    ].filter(Boolean);

    const newJob: JobProfile = {
      id: `vac-${Date.now()}`,
      jobTitle: jobTitle.trim(),
      title: jobTitle.trim(), // ensures compatibility
      department: department.trim() || 'General',
      company: company.trim() || 'Company',
      industry: industry.trim(),
      location: fullLocation,
      province: safeProvince,
      city: safeCity,
      specificLocation: specificLocation.trim(),
      locationType: safeLocationType,
      workArrangement: safeLocationType,
      employmentType: safeEmploymentType,
      salaryMinZar: Number(salaryMinMonthly || 0),
      salaryMaxZar: Number(salaryMaxMonthly || 0),
      salaryMinMonthly: Number(salaryMinMonthly || 0),
      salaryMaxMonthly: Number(salaryMaxMonthly || 0),
      salaryMinAnnual: Number(salaryMinMonthly || 0) * 12,
      salaryMaxAnnual: Number(salaryMaxMonthly || 0) * 12,
      requiredSkills,
      preferredSkills,
      minimumExperienceYears: Number(minimumExperienceYears || 0),
      preferredExperienceYears: Number(preferredExperienceYears || 0),
      experienceDescription: experienceDescription.trim(),
      qualifications: qualificationsList,
      minimumQualification,
      fieldOfStudy,
      preferredQualification,
      certifications,
      responsibilities,
      benefits: selectedBenefits,
      aboutRole: aboutRole.trim(),
      jobDescription: assembledDescription,
      closingDate: closingDate || '',
      createdDate: new Date().toISOString().split('T')[0],
      status: 'Open',
      applicantCount: 0,
      jobRefNumber: jobRefNumber.trim(),
    };

    try {
      await onAddJob(newJob);
      setIsSubmitting(false);
      onClose();
    } catch (err) {
      console.error('Error adding job profile:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="create-vacancy-modal-overlay"
      className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <div
        id="create-vacancy-modal-container"
        className="bg-white border border-slate-200/90 rounded-2xl max-w-4xl w-full text-slate-800 shadow-[0_20px_60px_rgba(15,23,42,0.14)] my-6 flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 bg-gradient-to-r from-slate-50/90 via-white to-slate-50/90 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-cyan-600/20">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">Create Professional Vacancy</h2>
                <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2 py-0.5 rounded-full">
                  Step 1: Role Specification
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Define structured recruitment criteria, verified skill sets, and compensation benchmarks.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-7 text-xs">
          
          {/* AI Quick Spec Parser (Non-destructive) */}
          <div className="bg-gradient-to-br from-indigo-50/70 to-cyan-50/40 p-4 rounded-xl border border-indigo-200/90 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                </span>
                <span className="text-xs font-bold text-indigo-950">Intelligent Quick Job Spec Parser</span>
                <span className="text-[10px] text-indigo-600 bg-white/80 border border-indigo-200 px-2 py-0.5 rounded-full font-medium">
                  Auto-populates fields without overwriting
                </span>
              </div>
              <button
                type="button"
                id="ai-quick-spec-btn"
                onClick={handleRunAiParser}
                disabled={isAiLoading || !rawSpecText.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs px-3.5 py-1.5 rounded-lg font-semibold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                {isAiLoading ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>{isAiLoading ? 'Analyzing Spec...' : 'Extract & Fill Form'}</span>
              </button>
            </div>

            <textarea
              value={rawSpecText}
              onChange={(e) => setRawSpecText(e.target.value)}
              placeholder="Paste any raw job spec or brief prompt (e.g. 'Senior Full Stack Developer for a fintech company in Johannesburg, 5 years experience, React and Node.js required, hybrid, R45,000–R60,000 per month')..."
              className="w-full bg-white border border-indigo-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 h-16 placeholder:text-slate-400"
            />
          </div>

          <form id="create-vacancy-form" onSubmit={handleSubmit} className="space-y-7">

            {/* ============================================================ */}
            {/* SECTION 1: JOB INFORMATION */}
            {/* ============================================================ */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-[11px]">1</span>
                  Job Information & Structure
                </h3>
                <span className="text-[11px] text-slate-500 font-mono">Ref: {jobRefNumber}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Department */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Department *
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold"
                  >
                    <option value="">-- Select Department --</option>
                    {DEPARTMENT_SUGGESTIONS.map((d, i) => (
                      <option key={i} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                {/* Job Title */}
                <div className="lg:col-span-2 relative">
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Full Stack Developer, Financial Analyst, HR Officer..."
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white text-xs font-bold"
                  />
                  {/* Suggestions for Job Title based on Department */}
                  {availableJobTitles.length > 0 && !jobTitle && (
                    <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] text-slate-500 font-medium">Suggested titles:</span>
                      {availableJobTitles.slice(0, 4).map((t, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setJobTitle(t)}
                          className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-[11px] font-medium transition"
                        >
                          + {t}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Company Name */}
                <div className="relative">
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Corp, eStudy South Africa, Nedbank..."
                    value={company}
                    onChange={(e) => handleCompanyChange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold"
                  />
                  {companySuggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-30 overflow-hidden text-xs">
                      <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase">
                        Company Suggestions
                      </div>
                      {companySuggestions.map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectCompany(item)}
                          className="w-full text-left px-3 py-2 hover:bg-cyan-50 transition flex items-center justify-between border-b border-slate-50 last:border-0"
                        >
                          <span className="font-bold text-slate-900">{item.name}</span>
                          <span className="text-[10px] text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                            {item.knownLocation}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Industry */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Industry Sector
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Information Technology, Financial Services, Healthcare..."
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white text-xs"
                  />
                </div>

                {/* Employment Type */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Employment Type *
                  </label>
                  <select
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold"
                  >
                    <option value="">-- Select Employment Type --</option>
                    {EMPLOYMENT_TYPES.map((t, idx) => (
                      <option key={idx} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Work Arrangement */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Work Arrangement *
                  </label>
                  <select
                    value={workArrangement}
                    onChange={(e) => setWorkArrangement(e.target.value as LocationType)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold"
                  >
                    <option value="">-- Select Work Arrangement --</option>
                    {WORK_ARRANGEMENTS.map((a, idx) => (
                      <option key={idx} value={a}>{a}</option>
                    ))}
                  </select>
                </div>

                {/* South Africa Province */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Province (South Africa)
                  </label>
                  <select
                    value={province}
                    onChange={(e) => {
                      setProvince(e.target.value);
                      setCity('');
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white text-xs"
                  >
                    <option value="">-- Select Province --</option>
                    {SOUTH_AFRICA_PROVINCES.map((p, idx) => (
                      <option key={idx} value={p.province}>{p.province}</option>
                    ))}
                  </select>
                </div>

                {/* City Selection */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    City / Metro
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold"
                  >
                    <option value="">-- Select City / Metro --</option>
                    {availableCities.map((c, idx) => (
                      <option key={idx} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Specific Location / Office Address */}
                <div className="lg:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Office Address / Suburb (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Menlyn Maine, Sandton CBD, Foreshore, Umhlanga..."
                    value={specificLocation}
                    onChange={(e) => setSpecificLocation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white text-xs"
                  />
                </div>

                {/* Closing Date & Live Deadline Status */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                      Application Closing Date (Optional)
                    </label>
                  </div>
                  <input
                    type="date"
                    value={closingDate}
                    onChange={(e) => setClosingDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white text-xs font-medium"
                  />
                  {closingDate ? (
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] ${closingIndicator.badgeClass}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${closingIndicator.dotClass}`} />
                        {closingIndicator.label}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-400 mt-1 block">Optional: Leave blank for open vacancy</span>
                  )}
                </div>
              </div>

              {/* Role Intelligence Suggestion Bar if available */}
              {roleIntelligence && (
                <div className="bg-emerald-50/70 border border-emerald-200/90 rounded-xl p-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-emerald-950">
                        Intelligent Template Available for "{roleIntelligence.jobTitle}"
                      </span>
                      <p className="text-[11px] text-emerald-800 mt-0.5">
                        Load verified requirements, skills, responsibilities, and benchmark salary.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleApplyRoleIntelligence(roleIntelligence)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-xs shrink-0 cursor-pointer"
                  >
                    Apply Role Template
                  </button>
                </div>
              )}
            </div>

            {/* ============================================================ */}
            {/* SECTION 2: JOB DESCRIPTION & RESPONSIBILITIES */}
            {/* ============================================================ */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-[11px]">2</span>
                  Job Description & Key Responsibilities
                </h3>
              </div>

              {/* About the role */}
              <div>
                <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                  About the Role / Executive Summary
                </label>
                <textarea
                  rows={3}
                  value={aboutRole}
                  onChange={(e) => setAboutRole(e.target.value)}
                  placeholder="Outline the core purpose, mission, team context, and growth opportunities of this position..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white text-xs leading-relaxed"
                />
              </div>

              {/* Dynamic Responsibilities List */}
              <div className="space-y-2">
                <label className="block text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                  Key Responsibilities (Dynamic Bullet Points) ({responsibilities.length})
                </label>

                {responsibilities.length === 0 ? (
                  <div className="p-3 bg-slate-50/80 border border-dashed border-slate-200 rounded-lg text-slate-400 text-xs italic text-center">
                    No key responsibilities added yet. Enter a duty below and click Add, or use the AI Spec Parser above.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {responsibilities.map((resp, idx) => (
                      <div key={idx} className="flex items-start gap-2 bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 text-slate-800">
                        <span className="text-indigo-600 font-bold mt-0.5">•</span>
                        <span className="flex-1 text-xs">{resp}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveResponsibility(idx)}
                          className="text-slate-400 hover:text-rose-600 p-0.5 transition"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="e.g. Manage core stakeholder relationships and execute quarterly strategic goals..."
                    value={newResponsibilityInput}
                    onChange={(e) => setNewResponsibilityInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddResponsibility();
                      }
                    }}
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddResponsibility}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
              </div>
            </div>

            {/* ============================================================ */}
            {/* SECTION 3: REQUIREMENTS & QUALIFICATIONS */}
            {/* ============================================================ */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-[11px]">3</span>
                  Experience & Qualifications Standards
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Min Experience Years */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Minimum Experience (Years)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={30}
                    placeholder="e.g. 3"
                    value={minimumExperienceYears === '' ? '' : minimumExperienceYears}
                    onChange={(e) => setMinimumExperienceYears(e.target.value === '' ? '' : parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white text-xs font-bold"
                  />
                </div>

                {/* Preferred Experience */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Preferred Experience (Years)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={30}
                    placeholder="e.g. 5"
                    value={preferredExperienceYears === '' ? '' : preferredExperienceYears}
                    onChange={(e) => setPreferredExperienceYears(e.target.value === '' ? '' : parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold"
                  />
                </div>

                {/* Minimum Qualification */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Minimum Qualification Level
                  </label>
                  <select
                    value={minimumQualification}
                    onChange={(e) => setMinimumQualification(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white text-xs font-semibold"
                  >
                    <option value="">-- Select Minimum Qualification --</option>
                    {QUALIFICATION_LEVELS.map((q, idx) => (
                      <option key={idx} value={q}>{q}</option>
                    ))}
                  </select>
                </div>

                {/* Field of Study */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Field of Study
                  </label>
                  <input
                    type="text"
                    value={fieldOfStudy}
                    onChange={(e) => setFieldOfStudy(e.target.value)}
                    placeholder="e.g. Computer Science, Accounting, Marketing, HR..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white text-xs"
                  />
                </div>

                {/* Preferred Qualification */}
                <div className="lg:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Preferred / Advantageous Qualification
                  </label>
                  <select
                    value={preferredQualification}
                    onChange={(e) => setPreferredQualification(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white text-xs"
                  >
                    <option value="">-- Select Preferred Qualification (Optional) --</option>
                    {QUALIFICATION_LEVELS.map((q, idx) => (
                      <option key={idx} value={q}>{q}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Experience Description */}
              <div>
                <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                  Specific Experience Requirements / Context
                </label>
                <input
                  type="text"
                  value={experienceDescription}
                  onChange={(e) => setExperienceDescription(e.target.value)}
                  placeholder="e.g. Proven track record managing full life-cycle projects in agile enterprise environments."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white text-xs"
                />
              </div>

              {/* Certifications Tags */}
              <div className="space-y-2">
                <label className="block text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                  Required / Preferred Certifications ({certifications.length})
                </label>

                {certifications.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {certifications.map((cert, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-800 border border-indigo-200 px-2.5 py-1 rounded-lg text-xs font-semibold"
                      >
                        <Award className="w-3.5 h-3.5 text-indigo-600" />
                        {cert}
                        <button
                          type="button"
                          onClick={() => setCertifications(certifications.filter((_, i) => i !== idx))}
                          className="text-indigo-400 hover:text-indigo-900 ml-1"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. AWS Certified Solutions Architect, SAICA CA(SA), Prince2, CKA..."
                    value={newCertInput}
                    onChange={(e) => setNewCertInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCert();
                      }
                    }}
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddCert}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-2 rounded-lg text-xs font-semibold transition cursor-pointer"
                  >
                    Add Certification
                  </button>
                </div>
              </div>
            </div>

            {/* ============================================================ */}
            {/* SECTION 4: SKILLS (REQUIRED VS PREFERRED) */}
            {/* ============================================================ */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-[11px]">4</span>
                    Skills Competency Framework
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Separated into mandatory required skills and value-adding preferred skills.
                  </p>
                </div>
              </div>

              {/* Contextual Suggested Skills */}
              {roleIntelligence && (
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 space-y-2">
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    Contextual Skill Suggestions for {roleIntelligence.jobTitle}:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[...roleIntelligence.suggestedRequiredSkills, ...roleIntelligence.suggestedPreferredSkills]
                      .filter(s => !requiredSkills.includes(s) && !preferredSkills.includes(s))
                      .map((s, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleAddRequiredSkill(s)}
                          className="bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 px-2 py-1 rounded-md text-[11px] font-medium transition cursor-pointer"
                        >
                          + {s}
                        </button>
                      ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Required Skills Column */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-indigo-900 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-600" />
                      Required Skills (Mandatory) ({requiredSkills.length})
                    </label>
                  </div>

                  <div className="min-h-[90px] p-2.5 bg-indigo-50/40 border border-indigo-200/80 rounded-xl flex flex-wrap gap-1.5 content-start">
                    {requiredSkills.length === 0 && (
                      <span className="text-[11px] text-slate-400 italic p-1">No required skills added yet. Type below and click Add.</span>
                    )}
                    {requiredSkills.map((s, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 bg-white text-indigo-900 border border-indigo-200 px-2.5 py-1 rounded-lg text-xs font-bold shadow-2xs"
                      >
                        {s}
                        <button
                          type="button"
                          onClick={() => handleToggleSkillPriority(s, 'required')}
                          title="Move to Preferred Skills"
                          className="text-slate-400 hover:text-amber-600 text-[10px] ml-0.5"
                        >
                          →Pref
                        </button>
                        <button
                          type="button"
                          onClick={() => setRequiredSkills(requiredSkills.filter((_, i) => i !== idx))}
                          className="text-slate-400 hover:text-rose-600 ml-0.5 font-bold"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add required skill (e.g. Python, SQL, Financial Modeling)..."
                      value={newRequiredSkillInput}
                      onChange={(e) => setNewRequiredSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddRequiredSkill(newRequiredSkillInput);
                        }
                      }}
                      className="flex-1 bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddRequiredSkill(newRequiredSkillInput)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-xs font-semibold transition cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>
                </div>

                {/* Preferred Skills Column */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-cyan-900 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-600" />
                      Preferred Skills (Nice-to-Have) ({preferredSkills.length})
                    </label>
                  </div>

                  <div className="min-h-[90px] p-2.5 bg-cyan-50/40 border border-cyan-200/80 rounded-xl flex flex-wrap gap-1.5 content-start">
                    {preferredSkills.length === 0 && (
                      <span className="text-[11px] text-slate-400 italic p-1">No preferred skills added yet. Type below and click Add.</span>
                    )}
                    {preferredSkills.map((s, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 bg-white text-cyan-900 border border-cyan-200 px-2.5 py-1 rounded-lg text-xs font-semibold shadow-2xs"
                      >
                        {s}
                        <button
                          type="button"
                          onClick={() => handleToggleSkillPriority(s, 'preferred')}
                          title="Move to Required Skills"
                          className="text-slate-400 hover:text-indigo-600 text-[10px] ml-0.5"
                        >
                          →Req
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreferredSkills(preferredSkills.filter((_, i) => i !== idx))}
                          className="text-slate-400 hover:text-rose-600 ml-0.5 font-bold"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add preferred skill (e.g. Docker, AWS, PowerBI)..."
                      value={newPreferredSkillInput}
                      onChange={(e) => setNewPreferredSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddPreferredSkill(newPreferredSkillInput);
                        }
                      }}
                      className="flex-1 bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddPreferredSkill(newPreferredSkillInput)}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-2 rounded-lg text-xs font-semibold transition cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ============================================================ */}
            {/* SECTION 5: SALARY, COMPENSATION & BENEFITS */}
            {/* ============================================================ */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-[11px]">5</span>
                    Salary Benchmark & Company Benefits
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Standard monthly remuneration with automatic annual total cost to company (CTC) package calculation.
                  </p>
                </div>
              </div>

              {/* Monthly Salary Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Minimum Monthly Salary (ZAR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-500 font-bold text-xs">R</span>
                    <input
                      type="number"
                      min={0}
                      step={500}
                      placeholder="e.g. 30000"
                      value={salaryMinMonthly === '' ? '' : salaryMinMonthly}
                      onChange={(e) => setSalaryMinMonthly(e.target.value === '' ? '' : Number(e.target.value) || 0)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-7 p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white text-xs font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Maximum Monthly Salary (ZAR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-500 font-bold text-xs">R</span>
                    <input
                      type="number"
                      min={0}
                      step={500}
                      placeholder="e.g. 45000"
                      value={salaryMaxMonthly === '' ? '' : salaryMaxMonthly}
                      onChange={(e) => setSalaryMaxMonthly(e.target.value === '' ? '' : Number(e.target.value) || 0)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-7 p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Live Annual Package Banner */}
              {Number(salaryMinMonthly || 0) > 0 || Number(salaryMaxMonthly || 0) > 0 ? (
                <div className="bg-gradient-to-r from-indigo-50/80 via-white to-cyan-50/80 border border-indigo-200/90 rounded-xl p-3.5 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                      pa
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
                        Live Calculated Annual Remuneration (Monthly × 12)
                      </span>
                      <p className="text-sm font-black text-indigo-950 mt-0.5">
                        {annualPackage.displayText}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {formatMonthlySalaryRange(Number(salaryMinMonthly || 0), Number(salaryMaxMonthly || 0))}
                  </span>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs text-slate-500 flex items-center gap-2">
                  <Info className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Enter monthly salary figures above to calculate the annual total remuneration package (monthly × 12).</span>
                </div>
              )}

              {/* Benefits Selection */}
              <div className="space-y-2">
                <label className="block text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                  Included Benefits & Perks ({selectedBenefits.length} selected)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {STANDARD_BENEFITS_CATALOG.map((benefit, idx) => {
                    const isSelected = selectedBenefits.includes(benefit);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleToggleBenefit(benefit)}
                        className={`text-left p-2 rounded-lg border text-xs flex items-center justify-between transition cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-50/80 border-indigo-300 text-indigo-950 font-semibold'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span>{benefit}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 ml-1.5" />}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Add custom benefit or perk..."
                    value={customBenefitInput}
                    onChange={(e) => setCustomBenefitInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomBenefit();
                      }
                    }}
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomBenefit}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-2 rounded-lg text-xs font-semibold transition cursor-pointer"
                  >
                    Add Benefit
                  </button>
                </div>
              </div>
            </div>

            {/* Submit & Cancel Footer */}
            <div className="border-t border-slate-200 pt-5 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold transition text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="submit-create-vacancy-btn"
                disabled={isSubmitting || !jobTitle.trim()}
                className="bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-bold transition shadow-md shadow-cyan-600/20 text-xs flex items-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating Structured Vacancy...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Publish Vacancy Profile</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ============================================================ */}
      {/* AI SUGGESTIONS REVIEW / MERGE MODAL */}
      {/* ============================================================ */}
      {showAiSuggestionsModal && parsedSuggestions && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-60 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 text-slate-900 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">AI Spec Parser Results</h4>
                <p className="text-[11px] text-slate-500">
                  Review extracted parameters before applying to your form.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3.5 space-y-2 text-xs border border-slate-200/80 max-h-60 overflow-y-auto">
              <div className="flex justify-between"><span className="text-slate-500">Job Title:</span> <span className="font-bold">{parsedSuggestions.jobTitle || 'N/A'}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Department:</span> <span className="font-semibold">{parsedSuggestions.department || 'N/A'}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Arrangement:</span> <span className="font-semibold">{parsedSuggestions.locationType || 'N/A'}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Salary:</span> <span className="font-bold text-indigo-700">R{(parsedSuggestions.salaryMinZar || 0).toLocaleString()} - R{(parsedSuggestions.salaryMaxZar || 0).toLocaleString()} pm</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Min Experience:</span> <span className="font-semibold">{parsedSuggestions.minimumExperienceYears || 0} years</span></div>
              <div><span className="text-slate-500">Required Skills:</span> <span className="font-semibold">{parsedSuggestions.requiredSkills?.join(', ') || 'None'}</span></div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowAiSuggestionsModal(false)}
                className="px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Dismiss
              </button>
              <button
                type="button"
                onClick={() => handleApplyAiSuggestions(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-2 rounded-lg text-xs font-bold transition"
              >
                Fill Empty Fields Only
              </button>
              <button
                type="button"
                onClick={() => handleApplyAiSuggestions(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition shadow-xs"
              >
                Apply All Extracted
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
