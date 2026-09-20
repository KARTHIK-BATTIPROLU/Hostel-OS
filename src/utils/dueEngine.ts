import type { DueStatus } from '../types/hostel';
import type { Language } from '../types/language';

/**
 * Returns number of days in a given year and month (1-indexed month: 1=Jan, 12=Dec)
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/**
 * Clamps anchor day to month's max days (e.g. 31st clamped to 30th in September),
 * WITHOUT mutating the tenant's immutable anchorDueDay.
 */
export function getDueDateForMonth(anchorDueDay: number, year: number, month: number): string {
  const maxDays = getDaysInMonth(year, month);
  const effectiveDay = Math.min(anchorDueDay, maxDays);
  const mm = String(month).padStart(2, '0');
  const dd = String(effectiveDay).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}

/**
 * Given an anchor day and reference date, finds the active/current billing cycle due date.
 * Accepts either a Date instance or a YYYY-MM-DD string.
 */
export function getActiveCycleDueDate(anchorDueDay: number, refDate: Date | string = new Date()): {
  dueDate: string;
  monthLabel: string;
  cycleYear: number;
  cycleMonth: number;
} {
  let year: number;
  let month: number; // 1-12

  if (typeof refDate === 'string') {
    const parts = refDate.split('-').map(Number);
    year = parts[0] || new Date().getFullYear();
    month = parts[1] || (new Date().getMonth() + 1);
  } else {
    year = refDate.getFullYear();
    month = refDate.getMonth() + 1;
  }
  
  // Calculate this month's due date
  const thisMonthDueDate = getDueDateForMonth(anchorDueDay, year, month);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return {
    dueDate: thisMonthDueDate,
    monthLabel: `${monthNames[month - 1]} ${year}`,
    cycleYear: year,
    cycleMonth: month
  };
}

/**
 * Calculates due status (OVERDUE, DUE_TODAY, UPCOMING, PAID) based on reference date string (YYYY-MM-DD).
 */
export function evaluateDueStatus(
  dueDateStr: string,
  referenceDateStr: string,
  isPaid: boolean = false
): { status: DueStatus; daysOverdue: number } {
  if (isPaid) {
    return { status: 'PAID', daysOverdue: 0 };
  }

  const [dY, dM, dD] = dueDateStr.split('-').map(Number);
  const [rY, rM, rD] = referenceDateStr.split('-').map(Number);

  const due = new Date(dY, dM - 1, dD);
  const ref = new Date(rY, rM - 1, rD);

  const diffTime = ref.getTime() - due.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return { status: 'DUE_TODAY', daysOverdue: 0 };
  } else if (diffDays > 0) {
    return { status: 'OVERDUE', daysOverdue: diffDays };
  } else {
    // negative diffDays means due date is in the future
    return { status: 'UPCOMING', daysOverdue: 0 };
  }
}

/**
 * Format currency in Indian Rupees notation (e.g. ₹7,200)
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Format date nicely e.g. "20 Sep 2026" or localized in Telugu / Hindi
 */
export function formatDate(dateStr: string, lang: Language = 'en'): string {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  if (!y || !m || !d) return dateStr;

  const teluguMonths = [
    'జనవరి', 'ఫిబ్రవరి', 'మార్చి', 'ఏప్రిల్', 'మే', 'జూన్',
    'జూలై', 'ఆగస్టు', 'సెప్టెంబర్', 'అక్టోబర్', 'నవంబర్', 'డిసెంబర్'
  ];

  const hindiMonths = [
    'जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
    'जुलाई', 'अगस्त', 'सितम्बर', 'अक्टूबर', 'नवम्बर', 'दिसम्बर'
  ];

  if (lang === 'te') {
    return `${d} ${teluguMonths[m - 1]} ${y}`;
  } else if (lang === 'hi') {
    return `${d} ${hindiMonths[m - 1]} ${y}`;
  }

  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

/**
 * Localizes standard month label e.g. "September 2026" into Telugu or Hindi
 */
export function formatLocalizedMonth(monthLabel: string, lang: Language): string {
  if (!monthLabel || lang === 'en') return monthLabel;

  const teluguMonths: Record<string, string> = {
    January: 'జనవరి',
    February: 'ఫిబ్రవరి',
    March: 'మార్చి',
    April: 'ఏప్రిల్',
    May: 'మే',
    June: 'జూన్',
    July: 'జూలై',
    August: 'ఆగస్టు',
    September: 'సెప్టెంబర్',
    October: 'అక్టోబర్',
    November: 'నవంబర్',
    December: 'డిసెంబర్'
  };

  const hindiMonths: Record<string, string> = {
    January: 'जनवरी',
    February: 'फ़रवरी',
    March: 'मार्च',
    April: 'अप्रैल',
    May: 'मई',
    June: 'जून',
    July: 'जुलाई',
    August: 'अगस्त',
    September: 'सितम्बर',
    October: 'अक्टूबर',
    November: 'नवम्बर',
    December: 'दिसम्बर'
  };

  const map = lang === 'te' ? teluguMonths : hindiMonths;
  let result = monthLabel;
  for (const [enMonth, locMonth] of Object.entries(map)) {
    if (result.includes(enMonth)) {
      result = result.replace(enMonth, locMonth);
    }
  }
  return result;
}
