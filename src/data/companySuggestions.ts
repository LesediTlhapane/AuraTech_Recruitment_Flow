/**
 * Intelligent company directory for quick suggestions and known location mapping
 */

export interface CompanySuggestionItem {
  name: string;
  knownLocation: string;
  defaultLocationType: 'On-Site' | 'Remote' | 'Hybrid';
  industry: string;
  aliases?: string[];
}

export const KNOWN_COMPANY_CATALOG: CompanySuggestionItem[] = [
  {
    name: 'eStudy',
    knownLocation: 'Pretoria',
    defaultLocationType: 'Hybrid',
    industry: 'EdTech & Digital Learning',
    aliases: ['estudy', 'estudy sa', 'estudy south africa'],
  },
  {
    name: 'eStudy South Africa',
    knownLocation: 'Pretoria',
    defaultLocationType: 'Hybrid',
    industry: 'EdTech & Digital Learning',
    aliases: ['estudy', 'estudy south africa'],
  },
  {
    name: 'RetroRabbit',
    knownLocation: 'Pretoria',
    defaultLocationType: 'Hybrid',
    industry: 'Software Consulting',
    aliases: ['retrorabbit', 'retro rabbit'],
  },
  {
    name: 'FinTech Dynamics South Africa',
    knownLocation: 'Sandton, Johannesburg',
    defaultLocationType: 'Hybrid',
    industry: 'Financial Technology',
    aliases: ['fintech dynamics', 'fintech'],
  },
  {
    name: 'Capitec Bank',
    knownLocation: 'Stellenbosch, Western Cape',
    defaultLocationType: 'Hybrid',
    industry: 'Banking & Financial Services',
    aliases: ['capitec', 'capitec bank'],
  },
  {
    name: 'Discovery Health',
    knownLocation: 'Sandton, Johannesburg',
    defaultLocationType: 'Hybrid',
    industry: 'Insurance & Healthcare Tech',
    aliases: ['discovery', 'discovery health', 'discovery limited'],
  },
  {
    name: 'Takealot',
    knownLocation: 'Cape Town, Western Cape',
    defaultLocationType: 'Hybrid',
    industry: 'E-commerce & Logistics',
    aliases: ['takealot', 'takealot.com', 'takealot group'],
  },
  {
    name: 'Standard Bank South Africa',
    knownLocation: 'Rosebank, Johannesburg',
    defaultLocationType: 'Hybrid',
    industry: 'Banking & Financial Services',
    aliases: ['standard bank', 'sbsa'],
  },
  {
    name: 'Nedbank Digital',
    knownLocation: 'Sandton, Johannesburg',
    defaultLocationType: 'Hybrid',
    industry: 'Banking & Financial Services',
    aliases: ['nedbank', 'nedbank digital'],
  },
  {
    name: 'Vodacom South Africa',
    knownLocation: 'Midrand, Gauteng',
    defaultLocationType: 'Hybrid',
    industry: 'Telecommunications',
    aliases: ['vodacom', 'vodacom sa'],
  },
  {
    name: 'MTN South Africa',
    knownLocation: 'Fairland, Johannesburg',
    defaultLocationType: 'Hybrid',
    industry: 'Telecommunications',
    aliases: ['mtn', 'mtn sa'],
  },
  {
    name: 'Entelect',
    knownLocation: 'Melrose Arch, Johannesburg',
    defaultLocationType: 'Hybrid',
    industry: 'Software Engineering Solutions',
    aliases: ['entelect', 'entelect software'],
  },
  {
    name: 'Amazon Web Services',
    knownLocation: 'Cape Town, Western Cape',
    defaultLocationType: 'Hybrid',
    industry: 'Cloud Infrastructure',
    aliases: ['aws', 'amazon', 'amazon web services'],
  },
  {
    name: 'BBD Software',
    knownLocation: 'Johannesburg, Gauteng',
    defaultLocationType: 'Hybrid',
    industry: 'Software Consulting',
    aliases: ['bbd', 'bbd software'],
  },
  {
    name: 'Derivco',
    knownLocation: 'Durban, KwaZulu-Natal',
    defaultLocationType: 'Hybrid',
    industry: 'Online Gaming Software',
    aliases: ['derivco'],
  },
  {
    name: 'Investec',
    knownLocation: 'Sandton, Johannesburg',
    defaultLocationType: 'Hybrid',
    industry: 'Banking & Wealth Management',
    aliases: ['investec'],
  },
  {
    name: 'MultiChoice Group',
    knownLocation: 'Randburg, Johannesburg',
    defaultLocationType: 'Hybrid',
    industry: 'Media & Entertainment Tech',
    aliases: ['multichoice', 'dstv', 'showmax'],
  },
  {
    name: 'Naspers / Prosus',
    knownLocation: 'Cape Town, Western Cape',
    defaultLocationType: 'Hybrid',
    industry: 'Technology Investment',
    aliases: ['naspers', 'prosus'],
  },
];

/**
 * Searches company directory with matching score
 */
export function getCompanySuggestions(
  query: string,
  existingJobCompanies: string[] = []
): CompanySuggestionItem[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [];

  const results: CompanySuggestionItem[] = [];
  const seen = new Set<string>();

  // Search catalog first
  for (const item of KNOWN_COMPANY_CATALOG) {
    const nameLower = item.name.toLowerCase();
    const matchesName = nameLower.includes(trimmed);
    const matchesAlias = item.aliases?.some((a) => a.includes(trimmed));

    if (matchesName || matchesAlias) {
      results.push(item);
      seen.add(nameLower);
    }
  }

  // Include any custom companies from existing jobs
  for (const comp of existingJobCompanies) {
    if (!comp) continue;
    const compLower = comp.toLowerCase();
    if (!seen.has(compLower) && compLower.includes(trimmed)) {
      results.push({
        name: comp,
        knownLocation: 'South Africa',
        defaultLocationType: 'Hybrid',
        industry: 'Enterprise',
      });
      seen.add(compLower);
    }
  }

  return results.slice(0, 6);
}
