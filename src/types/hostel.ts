export type DepositStatus = 'PAID_CASH' | 'PAID_UPI' | 'PENDING';
export type DueStatus = 'DUE_TODAY' | 'OVERDUE' | 'UPCOMING' | 'PAID';
export type PaymentMethod = 'RAZORPAY_UPI' | 'PHONEPE_SOUNDBOX' | 'CASH' | 'GPAY_UPI' | 'PAYTM' | 'DEPOSIT_SETTLEMENT';

export interface Hostel {
  id: string;
  name: string;
  area: string; // Kokapet, Gandipet, Financial District, Gachibowli, Madhapur
  address: string;
  ownerPhone: string;
  floorsCount: number;
  policeStationJurisdiction: string; // e.g. Narsingi PS (Cyberabad), Gachibowli PS
}

export interface Room {
  id: string;
  hostelId: string;
  floorNumber: number;
  roomNumber: string;
  sharingType: number; // 1, 2, 3, 4, 5
  defaultPrice: number; // e.g. 8000
  urjaviMeterId?: string; // e.g. "URJ-KOK-101"
  urjaviBalanceUnits: number; // e.g. 22.4 kWh
  urjaviBalanceRupees: number; // e.g. 156
}

export interface Bed {
  id: string;
  roomId: string;
  hostelId: string;
  bedLabel: string; // "A", "B", "C"
  isOccupied: boolean;
  tenantId?: string;
}

export interface Tenant {
  id: string;
  hostelId: string;
  roomId: string;
  bedId: string;
  fullName: string;
  phone: string;
  emergencyPhone: string;
  joiningDate: string; // YYYY-MM-DD
  anchorDueDay: number; // 1-31 immutable anchor day
  agreedRent: number; // Negotiated rent e.g. 7200
  baseRent: number; // Default price e.g. 8000
  securityDeposit: number; // Default 5000
  depositStatus: DepositStatus;
  depositDate?: string;
  aadhaarNumber: string;
  aadhaarFrontUrl: string;
  aadhaarBackUrl: string;
  photoUrl: string;
  urjaviMeterId?: string;
  collegeOrCompany?: string;
  bloodGroup?: string;
  homeTown?: string;
  status: 'ACTIVE' | 'VACATED';
  vacatedDate?: string;
}

export interface RentDue {
  id: string;
  tenantId: string;
  hostelId: string;
  roomId: string;
  bedId: string;
  dueDate: string; // YYYY-MM-DD
  amountDue: number;
  status: DueStatus;
  monthLabel: string; // e.g. "September 2026"
  daysOverdue: number;
  lastCallDate?: string;
  notes?: string;
  paidDate?: string;
  paidMethod?: PaymentMethod;
}

export interface PaymentRecord {
  id: string;
  tenantId: string;
  hostelId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionRef: string;
  timestamp: string;
  description: string;
  rentDueId?: string;
}
