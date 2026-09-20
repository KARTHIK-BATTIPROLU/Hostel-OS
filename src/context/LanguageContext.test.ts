import { describe, it, expect } from 'vitest';
import type { Translations } from '../types/language';
import { translations } from './LanguageContext';

// Regular expression for Telugu Unicode block (\u0C00-\u0C7F)
const TELUGU_REGEX = /[\u0C00-\u0C7F]/;
// Regular expression for Devanagari / Hindi Unicode block (\u0900-\u097F)
const HINDI_REGEX = /[\u0900-\u097F]/;

describe('LanguageContext - Strict Separation & Complete Translation Dictionaries', () => {
  const allKeys = Object.keys(translations.en) as (keyof Translations)[];

  it('contains non-empty translations for all keys across en, te, and hi', () => {
    expect(allKeys.length).toBeGreaterThan(70);

    for (const key of allKeys) {
      expect(translations.en[key], `English key "${key}" is missing or empty`).toBeTruthy();
      expect(translations.te[key], `Telugu key "${key}" is missing or empty`).toBeTruthy();
      expect(translations.hi[key], `Hindi key "${key}" is missing or empty`).toBeTruthy();
    }
  });

  it('guarantees English translations have ZERO Telugu or Hindi characters and NO clumsy bilingual uppercase brackets', () => {
    for (const key of allKeys) {
      const text = translations.en[key];
      expect(TELUGU_REGEX.test(text), `English key "${key}" contains Telugu characters: "${text}"`).toBe(false);
      expect(HINDI_REGEX.test(text), `English key "${key}" contains Hindi characters: "${text}"`).toBe(false);

      // Verify no clumsy bilingual brackets like (TOTAL BEDS)
      expect(text).not.toContain('(TOTAL BEDS)');
      expect(text).not.toContain('(VACANT)');
      expect(text).not.toContain('(PENDING)');
      expect(text).not.toContain('(COLLECTED)');
    }

    // Check key UI element strings in English
    expect(translations.en.totalBedsCard).toBe('Total Beds');
    expect(translations.en.vacantBedsCard).toBe('Vacant Beds');
    expect(translations.en.pendingDuesCard).toBe('Pending Dues');
    expect(translations.en.collectedRentCard).toBe('Rent Collected');
    expect(translations.en.settings).toBe('Settings & Preferences');
    expect(translations.en.locationCyberabad).toBe('Cyberabad, Hyderabad');
    expect(translations.en.overdueSubtext).toBe('Overdue');
    expect(translations.en.dueTodaySubtext).toBe('Collect Today');
    expect(translations.en.active).toBe('Active');
    expect(translations.en.units).toBe('units');
    expect(translations.en.methodCash).toBe('Cash');
    expect(translations.en.methodSoundbox).toBe('Soundbox');
  });

  it('guarantees Telugu translations are authentic and free from English brackets', () => {
    expect(translations.te.totalBedsCard).toBe('మొత్తం బెడ్స్');
    expect(translations.te.vacantBedsCard).toBe('ఖాళీ బెడ్స్');
    expect(translations.te.pendingDuesCard).toBe('వసూలు చేయాల్సినవి');
    expect(translations.te.collectedRentCard).toBe('వచ్చిన అద్దె');
    expect(translations.te.settings).toBe('సెట్టింగ్స్ & ప్రాధాన్యతలు');
    expect(translations.te.locationCyberabad).toBe('హైదరాబాద్ (సైబరాబాద్)');
    expect(translations.te.active).toBe('యాక్టివ్');
    expect(translations.te.units).toBe('యూనిట్లు');
    expect(translations.te.methodCash).toBe('నగదు');
    expect(translations.te.methodSoundbox).toBe('సౌండ్‌బాక్స్');

    // No clumsy bilingual brackets in Telugu key elements
    expect(translations.te.totalBedsCard).not.toContain('(Total Beds)');
    expect(translations.te.vacantBedsCard).not.toContain('(Vacant)');
    expect(translations.te.pendingDuesCard).not.toContain('(Pending)');
    expect(translations.te.collectedRentCard).not.toContain('(Collected)');
    expect(translations.te.dueToday).not.toContain('(Due Today)');

    // Check Telugu script presence
    expect(TELUGU_REGEX.test(translations.te.appName)).toBe(true);
    expect(TELUGU_REGEX.test(translations.te.totalBedsCard)).toBe(true);
    expect(TELUGU_REGEX.test(translations.te.callListSubtitle)).toBe(true);
  });

  it('guarantees Hindi translations are natural and free from English brackets', () => {
    expect(translations.hi.totalBedsCard).toBe('कुल बेड');
    expect(translations.hi.vacantBedsCard).toBe('खाली बेड');
    expect(translations.hi.pendingDuesCard).toBe('बकाया राशि');
    expect(translations.hi.collectedRentCard).toBe('प्राप्त किराया');
    expect(translations.hi.settings).toBe('सेटिंग्स और प्राथमिकताएं');
    expect(translations.hi.active).toBe('सक्रिय');
    expect(translations.hi.units).toBe('यूनिट');
    expect(translations.hi.methodCash).toBe('नकद');
    expect(translations.hi.methodSoundbox).toBe('साउंडबॉक्स');

    expect(translations.hi.totalBedsCard).not.toContain('(Total Beds)');
    expect(translations.hi.vacantBedsCard).not.toContain('(Vacant)');

    // Check Hindi script presence
    expect(HINDI_REGEX.test(translations.hi.appName)).toBe(true);
    expect(HINDI_REGEX.test(translations.hi.totalBedsCard)).toBe(true);
    expect(HINDI_REGEX.test(translations.hi.settings)).toBe(true);
  });

  it('strictly validates natural Telugu hostel terms without awkward English brackets', () => {
    // Spoken hostel terms naturally written in Telugu script
    expect(translations.te.appName).toContain('హాస్టల్');
    expect(translations.te.bedMatrix).toContain('బెడ్');
    expect(translations.te.sendWhatsApp).toContain('వాట్సాప్');
    expect(translations.te.callStudent).toContain('కాల్');
    expect(translations.te.securityDeposit).toContain('డిపాజిట్');
    expect(translations.te.agreedRent).toContain('రెంట్');
    expect(translations.te.methodSoundbox).toBe('సౌండ్‌బాక్స్');

    // No trailing uppercase or lowercase English brackets in Telugu terms
    for (const key of Object.keys(translations.te) as (keyof Translations)[]) {
      const val = translations.te[key];
      expect(val).not.toContain('(TOTAL BEDS)');
      expect(val).not.toContain('(VACANT)');
      expect(val).not.toContain('(PENDING)');
      expect(val).not.toContain('(COLLECTED)');
      expect(val).not.toContain('(Due Today)');
    }
  });

  it('guarantees 100% clean English mode with zero Telugu script leakage across all keys', () => {
    for (const key of Object.keys(translations.en) as (keyof Translations)[]) {
      const val = translations.en[key];
      expect(TELUGU_REGEX.test(val), `Key "${key}" contains Telugu leakage: "${val}"`).toBe(false);
      expect(HINDI_REGEX.test(val), `Key "${key}" contains Hindi leakage: "${val}"`).toBe(false);
    }
  });
});
