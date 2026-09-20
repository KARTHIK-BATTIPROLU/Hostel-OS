import { describe, it, expect } from 'vitest';
import { getDaysInMonth, getDueDateForMonth, evaluateDueStatus, formatINR, formatDate, getActiveCycleDueDate, formatLocalizedMonth } from './dueEngine';

describe('dueEngine - Immutable Anchor Day & Due Logic', () => {
  it('correctly calculates days in month including leap years', () => {
    expect(getDaysInMonth(2026, 1)).toBe(31); // Jan
    expect(getDaysInMonth(2026, 2)).toBe(28); // Feb 2026 non-leap
    expect(getDaysInMonth(2024, 2)).toBe(29); // Feb 2024 leap year
    expect(getDaysInMonth(2026, 4)).toBe(30); // April
    expect(getDaysInMonth(2026, 9)).toBe(30); // September
    expect(getDaysInMonth(2026, 10)).toBe(31); // October
  });

  it('prevents 30-day and leap year cascade by preserving immutable anchor day 31', () => {
    const anchorDay = 31;

    // In August (31 days)
    expect(getDueDateForMonth(anchorDay, 2026, 8)).toBe('2026-08-31');

    // In September (30 days) -> clamps to 30
    expect(getDueDateForMonth(anchorDay, 2026, 9)).toBe('2026-09-30');

    // In October (31 days) -> RECOVERS 31st! (does not get permanently stuck at 30)
    expect(getDueDateForMonth(anchorDay, 2026, 10)).toBe('2026-10-31');

    // In February 2026 (non-leap: 28 days) -> clamps to 28
    expect(getDueDateForMonth(anchorDay, 2026, 2)).toBe('2026-02-28');

    // In February 2024 (leap: 29 days) -> clamps to 29
    expect(getDueDateForMonth(anchorDay, 2024, 2)).toBe('2024-02-29');

    // In March (31 days) -> RECOVERS 31st again!
    expect(getDueDateForMonth(anchorDay, 2026, 3)).toBe('2026-03-31');
  });

  it('handles regular anchor days e.g. 5th, 15th, 20th without alteration', () => {
    expect(getDueDateForMonth(5, 2026, 9)).toBe('2026-09-05');
    expect(getDueDateForMonth(5, 2026, 2)).toBe('2026-02-05');
    expect(getDueDateForMonth(20, 2026, 9)).toBe('2026-09-20');
  });

  it('computes active cycle due date using string reference date timezone-safely', () => {
    const cycleSep = getActiveCycleDueDate(31, '2026-09-20');
    expect(cycleSep.dueDate).toBe('2026-09-30'); // Clamped to 30th
    expect(cycleSep.monthLabel).toBe('September 2026');

    const cycleOct = getActiveCycleDueDate(31, '2026-10-15');
    expect(cycleOct.dueDate).toBe('2026-10-31'); // Recovers 31st
    expect(cycleOct.monthLabel).toBe('October 2026');

    const cycleFeb = getActiveCycleDueDate(31, '2026-02-10');
    expect(cycleFeb.dueDate).toBe('2026-02-28');
    expect(cycleFeb.monthLabel).toBe('February 2026');
  });

  it('evaluates due status accurately across boundaries', () => {
    // Due Today
    const todayRes = evaluateDueStatus('2026-09-20', '2026-09-20', false);
    expect(todayRes.status).toBe('DUE_TODAY');
    expect(todayRes.daysOverdue).toBe(0);

    // Overdue by 1 day
    const overdue1Res = evaluateDueStatus('2026-09-19', '2026-09-20', false);
    expect(overdue1Res.status).toBe('OVERDUE');
    expect(overdue1Res.daysOverdue).toBe(1);

    // Overdue by 15 days
    const overdueRes = evaluateDueStatus('2026-09-05', '2026-09-20', false);
    expect(overdueRes.status).toBe('OVERDUE');
    expect(overdueRes.daysOverdue).toBe(15);

    // Upcoming in future
    const upcomingRes = evaluateDueStatus('2026-09-30', '2026-09-20', false);
    expect(upcomingRes.status).toBe('UPCOMING');
    expect(upcomingRes.daysOverdue).toBe(0);

    // Paid
    const paidRes = evaluateDueStatus('2026-09-05', '2026-09-20', true);
    expect(paidRes.status).toBe('PAID');
    expect(paidRes.daysOverdue).toBe(0);
  });

  it('formats INR currency and dates accurately across languages', () => {
    const formatted = formatINR(7200);
    expect(formatted).toContain('7,200');
    expect(formatted).toContain('₹');

    const formattedDateEn = formatDate('2026-09-20', 'en');
    expect(formattedDateEn).toContain('20');
    expect(formattedDateEn).toContain('Sep');
    expect(formattedDateEn).toContain('2026');

    const formattedDateTe = formatDate('2026-09-20', 'te');
    expect(formattedDateTe).toBe('20 సెప్టెంబర్ 2026');

    const formattedDateHi = formatDate('2026-09-20', 'hi');
    expect(formattedDateHi).toBe('20 सितम्बर 2026');
  });

  it('localizes month labels accurately into Telugu, Hindi, and English', () => {
    expect(formatLocalizedMonth('September 2026', 'en')).toBe('September 2026');
    expect(formatLocalizedMonth('September 2026', 'te')).toBe('సెప్టెంబర్ 2026');
    expect(formatLocalizedMonth('September 2026', 'hi')).toBe('सितम्बर 2026');

    expect(formatLocalizedMonth('October 2026', 'te')).toBe('అక్టోబర్ 2026');
    expect(formatLocalizedMonth('January 2027', 'hi')).toBe('जनवरी 2027');
  });
});
