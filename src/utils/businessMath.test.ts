import { describe, it, expect } from 'vitest';

describe('Business Logic & Mathematical Edge Cases', () => {
  it('calculates security deposit refund accurately with standard ₹5,000 and ₹1,000 maintenance deduction', () => {
    const originalDeposit = 5000;
    const maintenanceDeduction = 1000;
    const unpaidDues = 0;

    const netRefund = Math.max(0, originalDeposit - maintenanceDeduction - unpaidDues);
    expect(netRefund).toBe(4000);
  });

  it('deducts unpaid rent dues from security deposit upon vacating', () => {
    const originalDeposit = 5000;
    const maintenanceDeduction = 1000;
    const unpaidDues = 2500; // partial rent pending

    const netRefund = Math.max(0, originalDeposit - maintenanceDeduction - unpaidDues);
    const unpaidDuesDeducted = Math.min(unpaidDues, Math.max(0, originalDeposit - maintenanceDeduction));

    expect(netRefund).toBe(1500);
    expect(unpaidDuesDeducted).toBe(2500);
  });

  it('guarantees net refund does not drop below 0 when dues exceed deposit', () => {
    const originalDeposit = 5000;
    const maintenanceDeduction = 1000;
    const unpaidDues = 7200; // dues exceed deposit

    const netRefund = Math.max(0, originalDeposit - maintenanceDeduction - unpaidDues);
    const unpaidDuesDeducted = Math.min(unpaidDues, Math.max(0, originalDeposit - maintenanceDeduction));

    expect(netRefund).toBe(0);
    expect(unpaidDuesDeducted).toBe(4000); // Only remaining deposit after maintenance is deducted
  });

  it('handles custom deposit chips (₹3,000, ₹10,000, custom ₹7,500)', () => {
    const customDeposit1 = 3000;
    expect(Math.max(0, customDeposit1 - 1000)).toBe(2000);

    const customDeposit2 = 10000;
    expect(Math.max(0, customDeposit2 - 1000)).toBe(9000);

    const customDeposit3 = 7500;
    expect(Math.max(0, customDeposit3 - 1000)).toBe(6500);
  });

  it('calculates dynamic negotiated rent discount correctly', () => {
    const basePrice = 8000;
    const negotiatedRent = 7200;
    const discount = basePrice - negotiatedRent;

    expect(discount).toBe(800);
    expect(negotiatedRent).toBeLessThan(basePrice);
  });

  it('calculates Urjavi prepaid power units correctly at ₹7 per unit', () => {
    const recharge200 = parseFloat((200 / 7.0).toFixed(1));
    expect(recharge200).toBe(28.6);

    const recharge500 = parseFloat((500 / 7.0).toFixed(1));
    expect(recharge500).toBe(71.4);

    const recharge1000 = parseFloat((1000 / 7.0).toFixed(1));
    expect(recharge1000).toBe(142.9);

    const recharge2000 = parseFloat((2000 / 7.0).toFixed(1));
    expect(recharge2000).toBe(285.7);
  });
});
