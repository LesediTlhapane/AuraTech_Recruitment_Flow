/**
 * Aura Tech Intelligence - Vacancy Utility Functions
 * Strict adherence to light/white design system & enterprise HR standards
 */

import { LocationType } from '../types';

export interface ClosingDateIndicator {
  label: string;
  shortLabel: string;
  daysRemaining: number | null;
  status: 'safe' | 'warning' | 'urgent' | 'expired' | 'none';
  badgeClass: string;
  dotClass: string;
}

/**
 * Normalizes salary numbers to monthly ZAR amount.
 * If legacy data had annual amounts (> R150 000), it converts to monthly (divide by 12).
 */
export function normalizeMonthlySalary(amount: number | null | undefined, defaultVal = 25000): number {
  if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
    return defaultVal;
  }
  // If number is clearly an annual salary (e.g. 300,000 to 1,200,000), divide by 12
  if (amount > 150000) {
    return Math.round(amount / 12);
  }
  return Math.round(amount);
}

/**
 * Formats standard South African Rand amounts with spaces (e.g. R8 000, R12 000)
 */
export function formatZar(amount: number): string {
  const formatted = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `R${formatted}`;
}

/**
 * Formats monthly salary range
 * Example: R8 000 - R12 000 p.m.
 */
export function formatMonthlySalaryRange(minMonthly: number, maxMonthly: number): string {
  const normalizedMin = normalizeMonthlySalary(minMonthly, 8000);
  const normalizedMax = normalizeMonthlySalary(maxMonthly, 12000);
  
  if (normalizedMin === normalizedMax) {
    return `${formatZar(normalizedMin)} p.m.`;
  }
  return `${formatZar(normalizedMin)} - ${formatZar(normalizedMax)} p.m.`;
}

/**
 * Automatically calculates annual package from monthly salary (monthly × 12)
 * Example: R96 000 - R144 000 p.a.
 */
export function calculateAnnualPackage(minMonthly: number, maxMonthly: number): {
  minAnnual: number;
  maxAnnual: number;
  displayText: string;
} {
  const normalizedMin = normalizeMonthlySalary(minMonthly, 8000);
  const normalizedMax = normalizeMonthlySalary(maxMonthly, 12000);

  const minAnnual = normalizedMin * 12;
  const maxAnnual = normalizedMax * 12;

  let displayText = '';
  if (minAnnual === maxAnnual) {
    displayText = `${formatZar(minAnnual)} p.a.`;
  } else {
    displayText = `${formatZar(minAnnual)} - ${formatZar(maxAnnual)} p.a.`;
  }

  return {
    minAnnual,
    maxAnnual,
    displayText,
  };
}

/**
 * Evaluates the closing date dynamically against current local date.
 * Rules:
 * - > 30 days remaining: GREEN (More than 30 days remaining)
 * - 8–30 days remaining: ORANGE (Approaching deadline)
 * - 0–7 days remaining: RED (Close to closing)
 * - Expired (< 0 days): Closed / Expired
 */
export function getClosingDateIndicator(closingDateStr?: string | null): ClosingDateIndicator {
  if (!closingDateStr || !closingDateStr.trim()) {
    return {
      label: 'No closing date set',
      shortLabel: 'Open',
      daysRemaining: null,
      status: 'none',
      badgeClass: 'bg-slate-100 text-slate-600 border border-slate-200',
      dotClass: 'bg-slate-400',
    };
  }

  // Parse YYYY-MM-DD or ISO timestamp
  const targetDate = new Date(closingDateStr);
  if (isNaN(targetDate.getTime())) {
    return {
      label: closingDateStr,
      shortLabel: 'Open',
      daysRemaining: null,
      status: 'none',
      badgeClass: 'bg-slate-100 text-slate-600 border border-slate-200',
      dotClass: 'bg-slate-400',
    };
  }

  // Calculate midnight diff for accurate calendar days
  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const targetMidnight = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()).getTime();

  const diffMs = targetMidnight - todayMidnight;
  const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (daysRemaining < 0) {
    return {
      label: 'Closed (Deadline passed)',
      shortLabel: 'Closed',
      daysRemaining,
      status: 'expired',
      badgeClass: 'bg-slate-100 text-slate-600 border border-slate-300/80',
      dotClass: 'bg-slate-400',
    };
  }

  if (daysRemaining <= 7) {
    const dayText = daysRemaining === 0 ? 'Closes today' : daysRemaining === 1 ? '1 day remaining' : `${daysRemaining} days remaining`;
    return {
      label: `${dayText} (0–7 days)`,
      shortLabel: dayText,
      daysRemaining,
      status: 'urgent',
      badgeClass: 'bg-rose-50 text-rose-700 border border-rose-200 font-bold',
      dotClass: 'bg-rose-500 animate-pulse',
    };
  }

  if (daysRemaining <= 30) {
    return {
      label: `${daysRemaining} days remaining (8–30 days)`,
      shortLabel: `${daysRemaining} days left`,
      daysRemaining,
      status: 'warning',
      badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200 font-semibold',
      dotClass: 'bg-amber-500',
    };
  }

  // > 30 days
  return {
    label: `${daysRemaining} days remaining (>30 days)`,
    shortLabel: `${daysRemaining} days left`,
    daysRemaining,
    status: 'safe',
    badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold',
    dotClass: 'bg-emerald-500',
  };
}

/**
 * Formats location and location type cleanly
 */
export function formatLocationDisplay(location?: string, locationType?: LocationType): string {
  const cleanLocation = location?.trim() || 'South Africa';
  if (!locationType) return cleanLocation;

  // Avoid repeating locationType if location already includes it
  if (cleanLocation.toLowerCase().includes(locationType.toLowerCase())) {
    return cleanLocation;
  }
  return `${cleanLocation} (${locationType})`;
}
