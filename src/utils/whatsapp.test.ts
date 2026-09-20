import { describe, it, expect } from 'vitest';
import { generateWhatsAppReminderUrl } from './whatsapp';

describe('whatsapp - Localized WhatsApp deep-link generator', () => {
  it('generates Telugu reminder message with payment link and 91 country code', () => {
    const url = generateWhatsAppReminderUrl({
      studentName: 'M. Sai Kiran',
      studentPhone: '9849123456',
      hostelName: 'Sri Balaji Luxury Men\'s PG',
      roomNumber: '101',
      bedLabel: 'A',
      dueAmount: 7200,
      dueDate: '20 Sep 2026',
      language: 'te',
      paymentUrl: 'https://hostel-os.com/pay'
    });

    expect(url).toContain('https://wa.me/919849123456');
    const decoded = decodeURIComponent(url);
    expect(decoded).toContain('నమస్కారం M. Sai Kiran గారు');
    expect(decoded).toContain('Sri Balaji Luxury Men\'s PG');
    expect(decoded).toContain('7,200');
    expect(decoded).toContain('https://hostel-os.com/pay');
  });

  it('generates English reminder message correctly', () => {
    const url = generateWhatsAppReminderUrl({
      studentName: 'P. Rahul Sharma',
      studentPhone: '9123456780',
      hostelName: 'Sri Balaji Grand Coliving',
      roomNumber: '201',
      bedLabel: 'B',
      dueAmount: 7500,
      dueDate: '20 Sep 2026',
      language: 'en'
    });

    expect(url).toContain('https://wa.me/919123456780');
    const decoded = decodeURIComponent(url);
    expect(decoded).toContain('Hello P. Rahul Sharma');
    expect(decoded).toContain('Sri Balaji Grand Coliving');
    expect(decoded).toContain('7,500');
  });

  it('handles numbers that already have country code 91', () => {
    const url = generateWhatsAppReminderUrl({
      studentName: 'Test Student',
      studentPhone: '919849123456',
      hostelName: 'Sri Balaji PG',
      roomNumber: '101',
      bedLabel: 'A',
      dueAmount: 8000,
      dueDate: '20 Sep 2026',
      language: 'en'
    });

    expect(url).toContain('https://wa.me/919849123456');
    expect(url).not.toContain('91919849123456');
  });
});
