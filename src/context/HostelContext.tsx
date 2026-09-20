import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Hostel, Room, Bed, Tenant, RentDue, PaymentRecord, DepositStatus, PaymentMethod } from '../types/hostel';
import { INITIAL_HOSTELS, INITIAL_ROOMS, INITIAL_BEDS, INITIAL_TENANTS, INITIAL_DUES, INITIAL_PAYMENTS } from '../data/initialHostels';
import { evaluateDueStatus, getActiveCycleDueDate } from '../utils/dueEngine';
import { playSoundboxChime, playOnboardingChime } from '../utils/soundbox';

export interface OnboardTenantPayload {
  hostelId: string;
  roomId: string;
  bedId: string;
  fullName: string;
  phone: string;
  emergencyPhone?: string;
  joiningDate: string;
  baseRent: number;
  agreedRent: number;
  securityDeposit: number;
  depositStatus: DepositStatus;
  urjaviMeterId?: string;
  aadhaarNumber?: string;
  aadhaarFrontUrl?: string;
  aadhaarBackUrl?: string;
  photoUrl?: string;
  collegeOrCompany?: string;
  homeTown?: string;
}

export interface NewHostelPayload {
  name: string;
  area: string;
  address: string;
  ownerPhone: string;
  floorsCount: number;
  roomsPerFloor: number;
  sharingType: number;
  defaultPrice: number;
  defaultDeposit: number;
}

export interface VacateBedResult {
  netRefund: number;
  originalDeposit: number;
  maintenanceDeduction: number;
  unpaidDuesDeducted: number;
}

interface HostelContextType {
  hostels: Hostel[];
  activeHostelId: string;
  activeHostel: Hostel;
  switchHostel: (id: string) => void;
  addHostel: (payload: NewHostelPayload) => void;
  
  rooms: Room[];
  beds: Bed[];
  tenants: Tenant[];
  dues: RentDue[];
  payments: PaymentRecord[];
  
  currentSimulatedDate: string;
  setSimulatedDate: (date: string) => void;
  advanceDateByDays: (days: number) => void;
  
  onboardTenant: (payload: OnboardTenantPayload) => void;
  recordPayment: (dueId: string, method: PaymentMethod, amountOverride?: number) => void;
  vacateBed: (tenantId: string, maintenanceDeduction: number, notes?: string) => VacateBedResult;
  updateAgreedRent: (tenantId: string, newRent: number) => void;
  rechargeUrjaviMeter: (roomId: string, amountRupees: number) => void;

  getTenantById: (id?: string) => Tenant | undefined;
  getRoomById: (id?: string) => Room | undefined;
  getBedById: (id?: string) => Bed | undefined;
}

const HostelContext = createContext<HostelContextType | undefined>(undefined);

const STORAGE_KEYS = {
  HOSTELS: 'hostel_os_hostels_v2',
  ACTIVE_ID: 'hostel_os_active_hostel_id_v2',
  ROOMS: 'hostel_os_rooms_v2',
  BEDS: 'hostel_os_beds_v2',
  TENANTS: 'hostel_os_tenants_v2',
  DUES: 'hostel_os_dues_v2',
  PAYMENTS: 'hostel_os_payments_v2'
};

export const HostelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hostels, setHostels] = useState<Hostel[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HOSTELS);
    return saved ? JSON.parse(saved) : INITIAL_HOSTELS;
  });

  const [activeHostelId, setActiveHostelId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_ID);
    return saved && INITIAL_HOSTELS.some(h => h.id === saved) ? saved : 'hostel-kokapet';
  });

  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROOMS);
    return saved ? JSON.parse(saved) : INITIAL_ROOMS;
  });

  const [beds, setBeds] = useState<Bed[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BEDS);
    return saved ? JSON.parse(saved) : INITIAL_BEDS;
  });

  const [tenants, setTenants] = useState<Tenant[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TENANTS);
    return saved ? JSON.parse(saved) : INITIAL_TENANTS;
  });

  const [dues, setDues] = useState<RentDue[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DUES);
    return saved ? JSON.parse(saved) : INITIAL_DUES;
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  // Default simulated date is current date: 2026-09-20
  const [currentSimulatedDate, setCurrentSimulatedDateState] = useState<string>('2026-09-20');

  const setSimulatedDate = (newDate: string) => {
    setCurrentSimulatedDateState(newDate);
    setDues(prevDues =>
      prevDues.map(due => {
        if (due.status === 'PAID') return due;
        const evalResult = evaluateDueStatus(due.dueDate, newDate, false);
        return {
          ...due,
          status: evalResult.status,
          daysOverdue: evalResult.daysOverdue
        };
      })
    );
  };

  const advanceDateByDays = (days: number) => {
    const [y, m, d] = currentSimulatedDate.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    dateObj.setDate(dateObj.getDate() + days);
    const ny = dateObj.getFullYear();
    const nm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const nd = String(dateObj.getDate()).padStart(2, '0');
    setSimulatedDate(`${ny}-${nm}-${nd}`);
  };

  // Persistence effects
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HOSTELS, JSON.stringify(hostels));
  }, [hostels]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ID, activeHostelId);
  }, [activeHostelId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BEDS, JSON.stringify(beds));
  }, [beds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TENANTS, JSON.stringify(tenants));
  }, [tenants]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DUES, JSON.stringify(dues));
  }, [dues]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
  }, [payments]);

  const activeHostel = hostels.find(h => h.id === activeHostelId) || hostels[0];

  const switchHostel = (id: string) => {
    setActiveHostelId(id);
  };

  const addHostel = (payload: NewHostelPayload) => {
    const hostelId = `hostel-${Date.now()}`;
    const newHostel: Hostel = {
      id: hostelId,
      name: payload.name,
      area: payload.area,
      address: payload.address,
      ownerPhone: payload.ownerPhone,
      floorsCount: payload.floorsCount,
      policeStationJurisdiction: `${payload.area} Police Station (Cyberabad)`
    };

    const newRooms: Room[] = [];
    const newBeds: Bed[] = [];
    const bedLabels = ['A', 'B', 'C', 'D', 'E'];

    for (let f = 1; f <= payload.floorsCount; f++) {
      for (let r = 1; r <= payload.roomsPerFloor; r++) {
        const roomNumber = `${f}0${r}`;
        const roomId = `room-${hostelId}-${roomNumber}`;
        const meterId = `URJ-${payload.area.substring(0, 3).toUpperCase()}-${roomNumber}`;

        newRooms.push({
          id: roomId,
          hostelId,
          floorNumber: f,
          roomNumber,
          sharingType: payload.sharingType,
          defaultPrice: payload.defaultPrice,
          urjaviMeterId: meterId,
          urjaviBalanceUnits: 50.0,
          urjaviBalanceRupees: 350
        });

        for (let b = 0; b < payload.sharingType; b++) {
          newBeds.push({
            id: `bed-${roomId}-${bedLabels[b]}`,
            roomId,
            hostelId,
            bedLabel: bedLabels[b],
            isOccupied: false
          });
        }
      }
    }

    setHostels(prev => [...prev, newHostel]);
    setRooms(prev => [...prev, ...newRooms]);
    setBeds(prev => [...prev, ...newBeds]);
    setActiveHostelId(hostelId);
    playOnboardingChime();
  };

  const onboardTenant = (payload: OnboardTenantPayload) => {
    const tenantId = `tenant-${Date.now()}`;
    const [, , d] = payload.joiningDate.split('-').map(Number);
    const anchorDay = d || 20;

    const newTenant: Tenant = {
      id: tenantId,
      hostelId: payload.hostelId,
      roomId: payload.roomId,
      bedId: payload.bedId,
      fullName: payload.fullName,
      phone: payload.phone,
      emergencyPhone: payload.emergencyPhone || '',
      joiningDate: payload.joiningDate,
      anchorDueDay: anchorDay,
      agreedRent: payload.agreedRent,
      baseRent: payload.baseRent,
      securityDeposit: payload.securityDeposit,
      depositStatus: payload.depositStatus,
      depositDate: payload.depositStatus !== 'PENDING' ? payload.joiningDate : undefined,
      aadhaarNumber: payload.aadhaarNumber || '3456 7890 1234',
      aadhaarFrontUrl: payload.aadhaarFrontUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
      aadhaarBackUrl: payload.aadhaarBackUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
      photoUrl: payload.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      urjaviMeterId: payload.urjaviMeterId,
      collegeOrCompany: payload.collegeOrCompany || 'Hyderabad Professional',
      bloodGroup: 'O+',
      homeTown: payload.homeTown || 'Telangana',
      status: 'ACTIVE'
    };

    // Mark bed occupied
    setBeds(prevBeds =>
      prevBeds.map(b => b.id === payload.bedId ? { ...b, isOccupied: true, tenantId } : b)
    );

    // Calculate initial anniversary rent cycle
    const cycle = getActiveCycleDueDate(anchorDay, currentSimulatedDate);
    const evalResult = evaluateDueStatus(cycle.dueDate, currentSimulatedDate, false);

    const initialDue: RentDue = {
      id: `due-${Date.now()}`,
      tenantId,
      hostelId: payload.hostelId,
      roomId: payload.roomId,
      bedId: payload.bedId,
      dueDate: cycle.dueDate,
      amountDue: payload.agreedRent,
      status: evalResult.status,
      monthLabel: cycle.monthLabel,
      daysOverdue: evalResult.daysOverdue
    };

    setTenants(prev => [...prev, newTenant]);
    setDues(prev => [...prev, initialDue]);

    playOnboardingChime();
  };

  const recordPayment = (dueId: string, method: PaymentMethod, amountOverride?: number) => {
    const due = dues.find(d => d.id === dueId);
    if (!due) return;

    const amount = amountOverride || due.amountDue;
    const tenant = tenants.find(t => t.id === due.tenantId);
    const tenantName = tenant?.fullName || '';

    // Mark due paid
    setDues(prevDues =>
      prevDues.map(d =>
        d.id === dueId
          ? {
              ...d,
              status: 'PAID',
              daysOverdue: 0,
              paidDate: currentSimulatedDate,
              paidMethod: method
            }
          : d
      )
    );

    // Log payment record with accurate prefix
    const refPrefix =
      method === 'CASH'
        ? 'CSH'
        : method === 'RAZORPAY_UPI'
        ? 'RZP'
        : method === 'GPAY_UPI'
        ? 'GP'
        : method === 'PAYTM'
        ? 'PTM'
        : method === 'DEPOSIT_SETTLEMENT'
        ? 'DEP'
        : 'PP';

    const newPayment: PaymentRecord = {
      id: `pay-${Date.now()}`,
      tenantId: due.tenantId,
      hostelId: due.hostelId,
      amount,
      paymentMethod: method,
      transactionRef: `${refPrefix}${Date.now().toString().slice(-8)}`,
      timestamp: `${currentSimulatedDate} ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
      description: `${due.monthLabel} Rent - ${method.replace('_', ' ')}`,
      rentDueId: dueId
    };

    setPayments(prev => [newPayment, ...prev]);

    // Play high-fidelity soundbox chime & voice alert
    playSoundboxChime(amount, tenantName);
  };

  const vacateBed = (tenantId: string, maintenanceDeduction: number, notes?: string): VacateBedResult => {
    const tenant = tenants.find(t => t.id === tenantId);
    if (!tenant) return { netRefund: 0, originalDeposit: 0, maintenanceDeduction: 0, unpaidDuesDeducted: 0 };

    const originalDeposit = tenant.securityDeposit || 5000;

    // Calculate total unpaid rent dues for this tenant
    const openDues = dues.filter(d => d.tenantId === tenantId && d.status !== 'PAID');
    const unpaidDuesTotal = openDues.reduce((sum, d) => sum + d.amountDue, 0);

    // Net student refund after maintenance & unpaid dues
    const netRefund = Math.max(0, originalDeposit - maintenanceDeduction - unpaidDuesTotal);
    const unpaidDuesDeducted = Math.min(unpaidDuesTotal, Math.max(0, originalDeposit - maintenanceDeduction));

    // Free the bed to green (vacant)
    setBeds(prevBeds =>
      prevBeds.map(b => b.id === tenant.bedId ? { ...b, isOccupied: false, tenantId: undefined } : b)
    );

    // Mark tenant vacated
    setTenants(prevTenants =>
      prevTenants.map(t =>
        t.id === tenantId
          ? { ...t, status: 'VACATED', vacatedDate: currentSimulatedDate }
          : t
      )
    );

    // Mark open dues as PAID via DEPOSIT_SETTLEMENT
    setDues(prevDues =>
      prevDues.map(d => {
        if (d.tenantId === tenantId && d.status !== 'PAID') {
          return {
            ...d,
            status: 'PAID',
            daysOverdue: 0,
            paidDate: currentSimulatedDate,
            paidMethod: 'DEPOSIT_SETTLEMENT' as PaymentMethod,
            notes: notes ? `Deposit settlement: ${notes}` : 'Settled from Security Deposit upon checkout'
          };
        }
        return d;
      })
    );

    // If unpaid dues were deducted from deposit, record financial ledger payment entry
    if (unpaidDuesDeducted > 0) {
      const settlementPayment: PaymentRecord = {
        id: `pay-settle-${Date.now()}`,
        tenantId,
        hostelId: tenant.hostelId,
        amount: unpaidDuesDeducted,
        paymentMethod: 'DEPOSIT_SETTLEMENT',
        transactionRef: `DEP${Date.now().toString().slice(-8)}`,
        timestamp: `${currentSimulatedDate} ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
        description: `Rent Settled from Security Deposit upon Bed Vacate (Room ${getRoomById(tenant.roomId)?.roomNumber || ''})`
      };
      setPayments(prev => [settlementPayment, ...prev]);
    }

    return { netRefund, originalDeposit, maintenanceDeduction, unpaidDuesDeducted };
  };

  const updateAgreedRent = (tenantId: string, newRent: number) => {
    setTenants(prev =>
      prev.map(t => t.id === tenantId ? { ...t, agreedRent: newRent } : t)
    );
    // Also update any unpaid dues for this tenant
    setDues(prev =>
      prev.map(d => (d.tenantId === tenantId && d.status !== 'PAID') ? { ...d, amountDue: newRent } : d)
    );
  };

  const rechargeUrjaviMeter = (roomId: string, amountRupees: number) => {
    const unitsAdded = parseFloat((amountRupees / 7.0).toFixed(1)); // Approx ₹7 per unit
    setRooms(prev =>
      prev.map(r => {
        if (r.id === roomId) {
          return {
            ...r,
            urjaviBalanceRupees: r.urjaviBalanceRupees + amountRupees,
            urjaviBalanceUnits: parseFloat((r.urjaviBalanceUnits + unitsAdded).toFixed(1))
          };
        }
        return r;
      })
    );
    playSoundboxChime(amountRupees, 'Urjavi Meter Recharge');
  };

  const getTenantById = (id?: string) => (id ? tenants.find(t => t.id === id) : undefined);
  const getRoomById = (id?: string) => (id ? rooms.find(r => r.id === id) : undefined);
  const getBedById = (id?: string) => (id ? beds.find(b => b.id === id) : undefined);

  return (
    <HostelContext.Provider
      value={{
        hostels,
        activeHostelId,
        activeHostel,
        switchHostel,
        addHostel,
        rooms,
        beds,
        tenants,
        dues,
        payments,
        currentSimulatedDate,
        setSimulatedDate,
        advanceDateByDays,
        onboardTenant,
        recordPayment,
        vacateBed,
        updateAgreedRent,
        rechargeUrjaviMeter,
        getTenantById,
        getRoomById,
        getBedById
      }}
    >
      {children}
    </HostelContext.Provider>
  );
};

export const useHostel = () => {
  const context = useContext(HostelContext);
  if (!context) {
    throw new Error('useHostel must be used within a HostelProvider');
  }
  return context;
};
