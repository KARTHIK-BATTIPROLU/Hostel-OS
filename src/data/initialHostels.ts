import type { Hostel, Room, Bed, Tenant, RentDue, PaymentRecord } from '../types/hostel';

export const INITIAL_HOSTELS: Hostel[] = [
  {
    id: 'hostel-kokapet',
    name: 'Sri Balaji Luxury Men\'s PG (Kokapet)',
    area: 'Kokapet',
    address: 'Plot 42, Golden Mile Road, Opp. Prestige Tranquil, Kokapet, Hyderabad - 500075',
    ownerPhone: '9848022338',
    floorsCount: 3,
    policeStationJurisdiction: 'Narsingi Police Station (Cyberabad)'
  },
  {
    id: 'hostel-gandipet',
    name: 'Sri Balaji Executive PG (Gandipet)',
    area: 'Gandipet',
    address: 'Survey 112, Near CBIT College Gate, Ocean Park Main Road, Gandipet, Hyderabad - 500075',
    ownerPhone: '9848022338',
    floorsCount: 3,
    policeStationJurisdiction: 'Narsingi Police Station (Cyberabad)'
  },
  {
    id: 'hostel-financial-dist',
    name: 'Sri Balaji Grand Coliving (Financial District)',
    area: 'Financial District',
    address: 'ISB Road, Opp. Waverock SEZ, Nanakramguda, Financial District, Hyderabad - 500032',
    ownerPhone: '9848022338',
    floorsCount: 4,
    policeStationJurisdiction: 'Gachibowli Police Station (Cyberabad)'
  },
  {
    id: 'hostel-gachibowli',
    name: 'Sri Balaji Residency (Gachibowli)',
    area: 'Gachibowli',
    address: 'Road No 3, Telecom Nagar, Near DLF Gate 2, Gachibowli, Hyderabad - 500032',
    ownerPhone: '9848022338',
    floorsCount: 3,
    policeStationJurisdiction: 'Gachibowli Police Station (Cyberabad)'
  },
  {
    id: 'hostel-madhapur',
    name: 'Sri Balaji Premium PG (Madhapur)',
    area: 'Madhapur',
    address: '100ft Road, Beside D-Mart Lane, Ayyappa Society, Madhapur, Hyderabad - 500081',
    ownerPhone: '9848022338',
    floorsCount: 4,
    policeStationJurisdiction: 'Madhapur Police Station (Cyberabad)'
  }
];

export const INITIAL_ROOMS: Room[] = [
  // Kokapet Floor 1
  {
    id: 'room-kok-101',
    hostelId: 'hostel-kokapet',
    floorNumber: 1,
    roomNumber: '101',
    sharingType: 2,
    defaultPrice: 8000,
    urjaviMeterId: 'URJ-KOK-101',
    urjaviBalanceUnits: 14.5,
    urjaviBalanceRupees: 98 // low balance alert
  },
  {
    id: 'room-kok-102',
    hostelId: 'hostel-kokapet',
    floorNumber: 1,
    roomNumber: '102',
    sharingType: 3,
    defaultPrice: 7000,
    urjaviMeterId: 'URJ-KOK-102',
    urjaviBalanceUnits: 48.2,
    urjaviBalanceRupees: 337
  },
  {
    id: 'room-kok-103',
    hostelId: 'hostel-kokapet',
    floorNumber: 1,
    roomNumber: '103',
    sharingType: 2,
    defaultPrice: 8500,
    urjaviMeterId: 'URJ-KOK-103',
    urjaviBalanceUnits: 62.0,
    urjaviBalanceRupees: 434
  },
  // Kokapet Floor 2
  {
    id: 'room-kok-201',
    hostelId: 'hostel-kokapet',
    floorNumber: 2,
    roomNumber: '201',
    sharingType: 2,
    defaultPrice: 8000,
    urjaviMeterId: 'URJ-KOK-201',
    urjaviBalanceUnits: 9.8,
    urjaviBalanceRupees: 68 // low balance alert
  },
  {
    id: 'room-kok-202',
    hostelId: 'hostel-kokapet',
    floorNumber: 2,
    roomNumber: '202',
    sharingType: 3,
    defaultPrice: 7000,
    urjaviMeterId: 'URJ-KOK-202',
    urjaviBalanceUnits: 78.4,
    urjaviBalanceRupees: 548
  },
  // Kokapet Floor 3
  {
    id: 'room-kok-301',
    hostelId: 'hostel-kokapet',
    floorNumber: 3,
    roomNumber: '301',
    sharingType: 2,
    defaultPrice: 8000,
    urjaviMeterId: 'URJ-KOK-301',
    urjaviBalanceUnits: 34.0,
    urjaviBalanceRupees: 238
  },

  // Gandipet Floor 1
  {
    id: 'room-gan-101',
    hostelId: 'hostel-gandipet',
    floorNumber: 1,
    roomNumber: '101',
    sharingType: 2,
    defaultPrice: 7500,
    urjaviMeterId: 'URJ-GAN-101',
    urjaviBalanceUnits: 42.0,
    urjaviBalanceRupees: 294
  },
  {
    id: 'room-gan-102',
    hostelId: 'hostel-gandipet',
    floorNumber: 1,
    roomNumber: '102',
    sharingType: 3,
    defaultPrice: 6500,
    urjaviMeterId: 'URJ-GAN-102',
    urjaviBalanceUnits: 12.0,
    urjaviBalanceRupees: 84
  },
  // Gandipet Floor 2
  {
    id: 'room-gan-201',
    hostelId: 'hostel-gandipet',
    floorNumber: 2,
    roomNumber: '201',
    sharingType: 2,
    defaultPrice: 7500,
    urjaviMeterId: 'URJ-GAN-201',
    urjaviBalanceUnits: 55.0,
    urjaviBalanceRupees: 385
  },

  // Financial District Floor 1
  {
    id: 'room-fin-101',
    hostelId: 'hostel-financial-dist',
    floorNumber: 1,
    roomNumber: '101',
    sharingType: 2,
    defaultPrice: 9500,
    urjaviMeterId: 'URJ-FIN-101',
    urjaviBalanceUnits: 88.0,
    urjaviBalanceRupees: 616
  },
  {
    id: 'room-fin-102',
    hostelId: 'hostel-financial-dist',
    floorNumber: 1,
    roomNumber: '102',
    sharingType: 2,
    defaultPrice: 9500,
    urjaviMeterId: 'URJ-FIN-102',
    urjaviBalanceUnits: 31.0,
    urjaviBalanceRupees: 217
  },

  // Gachibowli Floor 1
  {
    id: 'room-gac-101',
    hostelId: 'hostel-gachibowli',
    floorNumber: 1,
    roomNumber: '101',
    sharingType: 2,
    defaultPrice: 9000,
    urjaviMeterId: 'URJ-GAC-101',
    urjaviBalanceUnits: 45.0,
    urjaviBalanceRupees: 315
  },

  // Madhapur Floor 1
  {
    id: 'room-mad-101',
    hostelId: 'hostel-madhapur',
    floorNumber: 1,
    roomNumber: '101',
    sharingType: 2,
    defaultPrice: 9000,
    urjaviMeterId: 'URJ-MAD-101',
    urjaviBalanceUnits: 65.0,
    urjaviBalanceRupees: 455
  }
];

export const INITIAL_BEDS: Bed[] = [
  // Kokapet 101 (2-share)
  { id: 'bed-kok-101-A', roomId: 'room-kok-101', hostelId: 'hostel-kokapet', bedLabel: 'A', isOccupied: true, tenantId: 'tenant-1' },
  { id: 'bed-kok-101-B', roomId: 'room-kok-101', hostelId: 'hostel-kokapet', bedLabel: 'B', isOccupied: false },

  // Kokapet 102 (3-share)
  { id: 'bed-kok-102-A', roomId: 'room-kok-102', hostelId: 'hostel-kokapet', bedLabel: 'A', isOccupied: true, tenantId: 'tenant-2' },
  { id: 'bed-kok-102-B', roomId: 'room-kok-102', hostelId: 'hostel-kokapet', bedLabel: 'B', isOccupied: true, tenantId: 'tenant-3' },
  { id: 'bed-kok-102-C', roomId: 'room-kok-102', hostelId: 'hostel-kokapet', bedLabel: 'C', isOccupied: false },

  // Kokapet 103 (2-share)
  { id: 'bed-kok-103-A', roomId: 'room-kok-103', hostelId: 'hostel-kokapet', bedLabel: 'A', isOccupied: false },
  { id: 'bed-kok-103-B', roomId: 'room-kok-103', hostelId: 'hostel-kokapet', bedLabel: 'B', isOccupied: false },

  // Kokapet 201 (2-share)
  { id: 'bed-kok-201-A', roomId: 'room-kok-201', hostelId: 'hostel-kokapet', bedLabel: 'A', isOccupied: true, tenantId: 'tenant-4' },
  { id: 'bed-kok-201-B', roomId: 'room-kok-201', hostelId: 'hostel-kokapet', bedLabel: 'B', isOccupied: true, tenantId: 'tenant-5' },

  // Kokapet 202 (3-share)
  { id: 'bed-kok-202-A', roomId: 'room-kok-202', hostelId: 'hostel-kokapet', bedLabel: 'A', isOccupied: true, tenantId: 'tenant-6' },
  { id: 'bed-kok-202-B', roomId: 'room-kok-202', hostelId: 'hostel-kokapet', bedLabel: 'B', isOccupied: false },
  { id: 'bed-kok-202-C', roomId: 'room-kok-202', hostelId: 'hostel-kokapet', bedLabel: 'C', isOccupied: false },

  // Kokapet 301 (2-share)
  { id: 'bed-kok-301-A', roomId: 'room-kok-301', hostelId: 'hostel-kokapet', bedLabel: 'A', isOccupied: false },
  { id: 'bed-kok-301-B', roomId: 'room-kok-301', hostelId: 'hostel-kokapet', bedLabel: 'B', isOccupied: false },

  // Gandipet 101
  { id: 'bed-gan-101-A', roomId: 'room-gan-101', hostelId: 'hostel-gandipet', bedLabel: 'A', isOccupied: true, tenantId: 'tenant-7' },
  { id: 'bed-gan-101-B', roomId: 'room-gan-101', hostelId: 'hostel-gandipet', bedLabel: 'B', isOccupied: false },

  // Gandipet 102
  { id: 'bed-gan-102-A', roomId: 'room-gan-102', hostelId: 'hostel-gandipet', bedLabel: 'A', isOccupied: true, tenantId: 'tenant-8' },
  { id: 'bed-gan-102-B', roomId: 'room-gan-102', hostelId: 'hostel-gandipet', bedLabel: 'B', isOccupied: false },
  { id: 'bed-gan-102-C', roomId: 'room-gan-102', hostelId: 'hostel-gandipet', bedLabel: 'C', isOccupied: false },

  // Gandipet 201
  { id: 'bed-gan-201-A', roomId: 'room-gan-201', hostelId: 'hostel-gandipet', bedLabel: 'A', isOccupied: false },
  { id: 'bed-gan-201-B', roomId: 'room-gan-201', hostelId: 'hostel-gandipet', bedLabel: 'B', isOccupied: false },

  // Financial District 101
  { id: 'bed-fin-101-A', roomId: 'room-fin-101', hostelId: 'hostel-financial-dist', bedLabel: 'A', isOccupied: true, tenantId: 'tenant-9' },
  { id: 'bed-fin-101-B', roomId: 'room-fin-101', hostelId: 'hostel-financial-dist', bedLabel: 'B', isOccupied: false },

  // Financial District 102
  { id: 'bed-fin-102-A', roomId: 'room-fin-102', hostelId: 'hostel-financial-dist', bedLabel: 'A', isOccupied: false },
  { id: 'bed-fin-102-B', roomId: 'room-fin-102', hostelId: 'hostel-financial-dist', bedLabel: 'B', isOccupied: false },

  // Gachibowli 101
  { id: 'bed-gac-101-A', roomId: 'room-gac-101', hostelId: 'hostel-gachibowli', bedLabel: 'A', isOccupied: true, tenantId: 'tenant-10' },
  { id: 'bed-gac-101-B', roomId: 'room-gac-101', hostelId: 'hostel-gachibowli', bedLabel: 'B', isOccupied: false },

  // Madhapur 101
  { id: 'bed-mad-101-A', roomId: 'room-mad-101', hostelId: 'hostel-madhapur', bedLabel: 'A', isOccupied: true, tenantId: 'tenant-11' },
  { id: 'bed-mad-101-B', roomId: 'room-mad-101', hostelId: 'hostel-madhapur', bedLabel: 'B', isOccupied: false }
];

export const INITIAL_TENANTS: Tenant[] = [
  {
    id: 'tenant-1',
    hostelId: 'hostel-kokapet',
    roomId: 'room-kok-101',
    bedId: 'bed-kok-101-A',
    fullName: 'M. Sai Kiran',
    phone: '9849123456',
    emergencyPhone: '9440123999',
    joiningDate: '2026-08-20',
    anchorDueDay: 20, // Due today!
    agreedRent: 7200, // Negotiated from 8000
    baseRent: 8000,
    securityDeposit: 5000,
    depositStatus: 'PAID_UPI',
    depositDate: '2026-08-20',
    aadhaarNumber: '7845 9012 3456',
    aadhaarFrontUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    aadhaarBackUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    urjaviMeterId: 'URJ-KOK-101',
    collegeOrCompany: 'Cognizant (Financial District)',
    bloodGroup: 'O+',
    homeTown: 'Warangal, Telangana',
    status: 'ACTIVE'
  },
  {
    id: 'tenant-2',
    hostelId: 'hostel-kokapet',
    roomId: 'room-kok-102',
    bedId: 'bed-kok-102-A',
    fullName: 'K. Teja Reddy',
    phone: '9988776655',
    emergencyPhone: '9848011223',
    joiningDate: '2026-08-05',
    anchorDueDay: 5, // Overdue since Sep 5 (15 days overdue!)
    agreedRent: 6500, // Negotiated from 7000
    baseRent: 7000,
    securityDeposit: 5000,
    depositStatus: 'PAID_CASH',
    depositDate: '2026-08-05',
    aadhaarNumber: '8912 3456 7890',
    aadhaarFrontUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    aadhaarBackUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    urjaviMeterId: 'URJ-KOK-102',
    collegeOrCompany: 'Wipro (Gachibowli)',
    bloodGroup: 'B+',
    homeTown: 'Karimnagar, Telangana',
    status: 'ACTIVE'
  },
  {
    id: 'tenant-3',
    hostelId: 'hostel-kokapet',
    roomId: 'room-kok-102',
    bedId: 'bed-kok-102-B',
    fullName: 'B. Akhil Kumar',
    phone: '9701122334',
    emergencyPhone: '9949988776',
    joiningDate: '2026-08-31',
    anchorDueDay: 31, // Clamped to Sep 30 (Upcoming)
    agreedRent: 6800,
    baseRent: 7000,
    securityDeposit: 5000,
    depositStatus: 'PAID_UPI',
    depositDate: '2026-08-31',
    aadhaarNumber: '4567 8901 2345',
    aadhaarFrontUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    aadhaarBackUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    urjaviMeterId: 'URJ-KOK-102',
    collegeOrCompany: 'TCS Synergy Park',
    bloodGroup: 'A+',
    homeTown: 'Nizamabad, Telangana',
    status: 'ACTIVE'
  },
  {
    id: 'tenant-4',
    hostelId: 'hostel-kokapet',
    roomId: 'room-kok-201',
    bedId: 'bed-kok-201-A',
    fullName: 'P. Rahul Sharma',
    phone: '9123456780',
    emergencyPhone: '9876543210',
    joiningDate: '2026-08-15',
    anchorDueDay: 15, // Overdue by 5 days!
    agreedRent: 7500,
    baseRent: 8000,
    securityDeposit: 5000,
    depositStatus: 'PAID_CASH',
    depositDate: '2026-08-15',
    aadhaarNumber: '6789 0123 4567',
    aadhaarFrontUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    aadhaarBackUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&auto=format&fit=crop&q=80',
    urjaviMeterId: 'URJ-KOK-201',
    collegeOrCompany: 'Amazon (Financial District)',
    bloodGroup: 'AB+',
    homeTown: 'Jaipur, Rajasthan',
    status: 'ACTIVE'
  },
  {
    id: 'tenant-5',
    hostelId: 'hostel-kokapet',
    roomId: 'room-kok-201',
    bedId: 'bed-kok-201-B',
    fullName: 'S. Tarun Varma',
    phone: '9441234567',
    emergencyPhone: '9441112233',
    joiningDate: '2026-08-20',
    anchorDueDay: 20, // Due today!
    agreedRent: 7200,
    baseRent: 8000,
    securityDeposit: 5000,
    depositStatus: 'PENDING', // Security deposit pending
    depositDate: undefined,
    aadhaarNumber: '3456 7890 1234',
    aadhaarFrontUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    aadhaarBackUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
    urjaviMeterId: 'URJ-KOK-201',
    collegeOrCompany: 'Infosys (Pocharam)',
    bloodGroup: 'O-',
    homeTown: 'Vijayawada, Andhra Pradesh',
    status: 'ACTIVE'
  },
  {
    id: 'tenant-6',
    hostelId: 'hostel-kokapet',
    roomId: 'room-kok-202',
    bedId: 'bed-kok-202-A',
    fullName: 'G. Naveen Reddy',
    phone: '9550112233',
    emergencyPhone: '9550998877',
    joiningDate: '2026-08-01',
    anchorDueDay: 1, // Paid already on Sep 1
    agreedRent: 6500,
    baseRent: 7000,
    securityDeposit: 5000,
    depositStatus: 'PAID_UPI',
    depositDate: '2026-08-01',
    aadhaarNumber: '2345 6789 0123',
    aadhaarFrontUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    aadhaarBackUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    urjaviMeterId: 'URJ-KOK-202',
    collegeOrCompany: 'Capgemini',
    bloodGroup: 'B+',
    homeTown: 'Khammam, Telangana',
    status: 'ACTIVE'
  },

  // Gandipet Tenants
  {
    id: 'tenant-7',
    hostelId: 'hostel-gandipet',
    roomId: 'room-gan-101',
    bedId: 'bed-gan-101-A',
    fullName: 'Ch. Vamshi Krishna',
    phone: '9848556677',
    emergencyPhone: '9848000111',
    joiningDate: '2026-08-20',
    anchorDueDay: 20, // Due Today in Gandipet
    agreedRent: 7000,
    baseRent: 7500,
    securityDeposit: 5000,
    depositStatus: 'PAID_CASH',
    depositDate: '2026-08-20',
    aadhaarNumber: '1234 5678 9012',
    aadhaarFrontUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    aadhaarBackUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
    urjaviMeterId: 'URJ-GAN-101',
    collegeOrCompany: 'CBIT Gandipet (4th Year CSE)',
    bloodGroup: 'O+',
    homeTown: 'Nalgonda, Telangana',
    status: 'ACTIVE'
  },
  {
    id: 'tenant-8',
    hostelId: 'hostel-gandipet',
    roomId: 'room-gan-102',
    bedId: 'bed-gan-102-A',
    fullName: 'D. Rohit Yadav',
    phone: '9177889900',
    emergencyPhone: '9177001122',
    joiningDate: '2026-08-10',
    anchorDueDay: 10, // Overdue by 10 days!
    agreedRent: 6000,
    baseRent: 6500,
    securityDeposit: 5000,
    depositStatus: 'PAID_UPI',
    depositDate: '2026-08-10',
    aadhaarNumber: '5678 9012 3456',
    aadhaarFrontUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    aadhaarBackUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    urjaviMeterId: 'URJ-GAN-102',
    collegeOrCompany: 'MGIT Gandipet',
    bloodGroup: 'A-',
    homeTown: 'Mahabubnagar, Telangana',
    status: 'ACTIVE'
  },

  // Financial District Tenant
  {
    id: 'tenant-9',
    hostelId: 'hostel-financial-dist',
    roomId: 'room-fin-101',
    bedId: 'bed-fin-101-A',
    fullName: 'N. Sandeep Kumar',
    phone: '9966332211',
    emergencyPhone: '9966000011',
    joiningDate: '2026-08-18',
    anchorDueDay: 18, // Overdue by 2 days
    agreedRent: 8800,
    baseRent: 9500,
    securityDeposit: 5000,
    depositStatus: 'PAID_UPI',
    depositDate: '2026-08-18',
    aadhaarNumber: '9012 3456 7890',
    aadhaarFrontUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    aadhaarBackUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    urjaviMeterId: 'URJ-FIN-101',
    collegeOrCompany: 'Microsoft (Financial District)',
    bloodGroup: 'O+',
    homeTown: 'Hyderabad, Telangana',
    status: 'ACTIVE'
  },

  // Gachibowli Tenant
  {
    id: 'tenant-10',
    hostelId: 'hostel-gachibowli',
    roomId: 'room-gac-101',
    bedId: 'bed-gac-101-A',
    fullName: 'J. Pradeep Raj',
    phone: '9849900112',
    emergencyPhone: '9849900000',
    joiningDate: '2026-08-20',
    anchorDueDay: 20, // Due Today
    agreedRent: 8500,
    baseRent: 9000,
    securityDeposit: 5000,
    depositStatus: 'PAID_CASH',
    depositDate: '2026-08-20',
    aadhaarNumber: '3456 1234 7890',
    aadhaarFrontUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    aadhaarBackUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    photoUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=200&auto=format&fit=crop&q=80',
    urjaviMeterId: 'URJ-GAC-101',
    collegeOrCompany: 'Google Hyderabad (DLF)',
    bloodGroup: 'B+',
    homeTown: 'Guntur, Andhra Pradesh',
    status: 'ACTIVE'
  },

  // Madhapur Tenant
  {
    id: 'tenant-11',
    hostelId: 'hostel-madhapur',
    roomId: 'room-mad-101',
    bedId: 'bed-mad-101-A',
    fullName: 'Y. Harshavardhan',
    phone: '9000112233',
    emergencyPhone: '9000001122',
    joiningDate: '2026-08-08',
    anchorDueDay: 8, // Overdue by 12 days
    agreedRent: 8500,
    baseRent: 9000,
    securityDeposit: 5000,
    depositStatus: 'PAID_UPI',
    depositDate: '2026-08-08',
    aadhaarNumber: '2345 8901 6789',
    aadhaarFrontUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    aadhaarBackUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    photoUrl: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=80',
    urjaviMeterId: 'URJ-MAD-101',
    collegeOrCompany: 'Inorbit Mindspace Techie',
    bloodGroup: 'A+',
    homeTown: 'Kurnool, Andhra Pradesh',
    status: 'ACTIVE'
  }
];

export const INITIAL_DUES: RentDue[] = [
  // Due Today in Kokapet
  {
    id: 'due-1',
    tenantId: 'tenant-1',
    hostelId: 'hostel-kokapet',
    roomId: 'room-kok-101',
    bedId: 'bed-kok-101-A',
    dueDate: '2026-09-20',
    amountDue: 7200,
    status: 'DUE_TODAY',
    monthLabel: 'September 2026',
    daysOverdue: 0
  },
  // Overdue in Kokapet (Joined Aug 5, due Sep 5)
  {
    id: 'due-2',
    tenantId: 'tenant-2',
    hostelId: 'hostel-kokapet',
    roomId: 'room-kok-102',
    bedId: 'bed-kok-102-A',
    dueDate: '2026-09-05',
    amountDue: 6500,
    status: 'OVERDUE',
    monthLabel: 'September 2026',
    daysOverdue: 15
  },
  // Upcoming in Kokapet (Joined Aug 31, due Sep 30)
  {
    id: 'due-3',
    tenantId: 'tenant-3',
    hostelId: 'hostel-kokapet',
    roomId: 'room-kok-102',
    bedId: 'bed-kok-102-B',
    dueDate: '2026-09-30',
    amountDue: 6800,
    status: 'UPCOMING',
    monthLabel: 'September 2026',
    daysOverdue: 0
  },
  // Overdue in Kokapet (Joined Aug 15, due Sep 15)
  {
    id: 'due-4',
    tenantId: 'tenant-4',
    hostelId: 'hostel-kokapet',
    roomId: 'room-kok-201',
    bedId: 'bed-kok-201-A',
    dueDate: '2026-09-15',
    amountDue: 7500,
    status: 'OVERDUE',
    monthLabel: 'September 2026',
    daysOverdue: 5
  },
  // Due Today in Kokapet
  {
    id: 'due-5',
    tenantId: 'tenant-5',
    hostelId: 'hostel-kokapet',
    roomId: 'room-kok-201',
    bedId: 'bed-kok-201-B',
    dueDate: '2026-09-20',
    amountDue: 7200,
    status: 'DUE_TODAY',
    monthLabel: 'September 2026',
    daysOverdue: 0
  },
  // Already Paid in Kokapet (Joined Aug 1, paid Sep 1)
  {
    id: 'due-6',
    tenantId: 'tenant-6',
    hostelId: 'hostel-kokapet',
    roomId: 'room-kok-202',
    bedId: 'bed-kok-202-A',
    dueDate: '2026-09-01',
    amountDue: 6500,
    status: 'PAID',
    monthLabel: 'September 2026',
    daysOverdue: 0,
    paidDate: '2026-09-01',
    paidMethod: 'PHONEPE_SOUNDBOX'
  },

  // Gandipet dues
  {
    id: 'due-7',
    tenantId: 'tenant-7',
    hostelId: 'hostel-gandipet',
    roomId: 'room-gan-101',
    bedId: 'bed-gan-101-A',
    dueDate: '2026-09-20',
    amountDue: 7000,
    status: 'DUE_TODAY',
    monthLabel: 'September 2026',
    daysOverdue: 0
  },
  {
    id: 'due-8',
    tenantId: 'tenant-8',
    hostelId: 'hostel-gandipet',
    roomId: 'room-gan-102',
    bedId: 'bed-gan-102-A',
    dueDate: '2026-09-10',
    amountDue: 6000,
    status: 'OVERDUE',
    monthLabel: 'September 2026',
    daysOverdue: 10
  },

  // Financial District dues
  {
    id: 'due-9',
    tenantId: 'tenant-9',
    hostelId: 'hostel-financial-dist',
    roomId: 'room-fin-101',
    bedId: 'bed-fin-101-A',
    dueDate: '2026-09-18',
    amountDue: 8800,
    status: 'OVERDUE',
    monthLabel: 'September 2026',
    daysOverdue: 2
  },

  // Gachibowli dues
  {
    id: 'due-10',
    tenantId: 'tenant-10',
    hostelId: 'hostel-gachibowli',
    roomId: 'room-gac-101',
    bedId: 'bed-gac-101-A',
    dueDate: '2026-09-20',
    amountDue: 8500,
    status: 'DUE_TODAY',
    monthLabel: 'September 2026',
    daysOverdue: 0
  },

  // Madhapur dues
  {
    id: 'due-11',
    tenantId: 'tenant-11',
    hostelId: 'hostel-madhapur',
    roomId: 'room-mad-101',
    bedId: 'bed-mad-101-A',
    dueDate: '2026-09-08',
    amountDue: 8500,
    status: 'OVERDUE',
    monthLabel: 'September 2026',
    daysOverdue: 12
  }
];

export const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: 'pay-1',
    tenantId: 'tenant-6',
    hostelId: 'hostel-kokapet',
    amount: 6500,
    paymentMethod: 'PHONEPE_SOUNDBOX',
    transactionRef: 'PP26090178921',
    timestamp: '2026-09-01 10:24 AM',
    description: 'September 2026 Rent - Received on PhonePe Soundbox',
    rentDueId: 'due-6'
  }
];
