import React, { useState } from 'react';
import { useHostel } from '../../context/HostelContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatINR } from '../../utils/dueEngine';
import { MorningCallList } from './MorningCallList';
import { BedMatrix } from './BedMatrix';
import { QuickOnboardingModal } from './QuickOnboardingModal';
import { StudentProfileModal } from './StudentProfileModal';
import { DepositSettlementModal } from './DepositSettlementModal';
import { PoliceVerificationModal } from './PoliceVerificationModal';
import { UrjaviRechargeModal } from './UrjaviRechargeModal';
import { AddHostelModal } from './AddHostelModal';
import type { Room, Bed } from '../../types/hostel';
import { Building2, IndianRupee, Users, ShieldAlert } from 'lucide-react';

interface OwnerDashboardProps {
  isAddHostelOpen: boolean;
  setIsAddHostelOpen: (open: boolean) => void;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  isAddHostelOpen,
  setIsAddHostelOpen
}) => {
  const { activeHostelId, beds, dues, payments } = useHostel();
  const { t } = useLanguage();

  // State for onboarding modal
  const [onboardingTarget, setOnboardingTarget] = useState<{ room: Room; bed: Bed } | null>(null);

  // State for student profile modal
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // State for vacate modal
  const [vacateStudentId, setVacateStudentId] = useState<string | null>(null);

  // State for police verification card modal
  const [policeStudentId, setPoliceStudentId] = useState<string | null>(null);

  // State for Urjavi recharge modal
  const [urjaviRoom, setUrjaviRoom] = useState<Room | null>(null);

  // Stats calculation for active hostel
  const hostelBeds = beds.filter(b => b.hostelId === activeHostelId);
  const totalBeds = hostelBeds.length;
  const occupiedBeds = hostelBeds.filter(b => b.isOccupied).length;
  const vacantBeds = totalBeds - occupiedBeds;

  const hostelDues = dues.filter(d => d.hostelId === activeHostelId);
  const pendingAmount = hostelDues
    .filter(d => d.status === 'OVERDUE' || d.status === 'DUE_TODAY')
    .reduce((sum, d) => sum + d.amountDue, 0);

  const hostelPayments = payments.filter(p => p.hostelId === activeHostelId);
  const collectedAmount = hostelPayments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Top Hostel Banner & Key Performance Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Total Beds */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-700">
            <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              {t('totalBedsCard')}
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
              {totalBeds} <span className="text-xs font-semibold text-slate-400">{t('bedsLabel')}</span>
            </div>
          </div>
        </div>

        {/* Vacant Beds */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700">
            <Users className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
              {t('vacantBedsCard')}
            </span>
            <div className="text-xl sm:text-2xl font-black text-emerald-600 mt-0.5">
              {vacantBeds} <span className="text-xs font-semibold text-emerald-700">{t('readyForAdmission')}</span>
            </div>
          </div>
        </div>

        {/* Pending Due Collections */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-700">
            <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
              {t('pendingDuesCard')}
            </span>
            <div className="text-xl sm:text-2xl font-black text-amber-600 mt-0.5">
              {formatINR(pendingAmount)}
            </div>
          </div>
        </div>

        {/* Total Collected */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-50 text-purple-700">
            <IndianRupee className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-purple-800 uppercase tracking-wider block">
              {t('collectedRentCard')}
            </span>
            <div className="text-xl sm:text-2xl font-black text-purple-700 mt-0.5">
              {formatINR(collectedAmount)}
            </div>
          </div>
        </div>

      </div>

      {/* 1. Morning 8:00 AM Priority Call List */}
      <MorningCallList
        onSelectStudent={studentId => setSelectedStudentId(studentId)}
      />

      {/* 2. Visual Bed Board Matrix */}
      <BedMatrix
        onSelectVacantBed={(room, bed) => setOnboardingTarget({ room, bed })}
        onSelectOccupiedBed={studentId => setSelectedStudentId(studentId)}
        onOpenUrjaviRecharge={room => setUrjaviRoom(room)}
      />

      {/* Modal: 60-Second Onboarding */}
      {onboardingTarget && (
        <QuickOnboardingModal
          room={onboardingTarget.room}
          bed={onboardingTarget.bed}
          onClose={() => setOnboardingTarget(null)}
        />
      )}

      {/* Modal: Student Profile */}
      {selectedStudentId && (
        <StudentProfileModal
          tenantId={selectedStudentId}
          onClose={() => setSelectedStudentId(null)}
          onOpenPoliceCard={tenantId => {
            setSelectedStudentId(null);
            setPoliceStudentId(tenantId);
          }}
          onOpenVacateModal={tenantId => {
            setSelectedStudentId(null);
            setVacateStudentId(tenantId);
          }}
        />
      )}

      {/* Modal: Deposit Settlement & Vacate Bed */}
      {vacateStudentId && (
        <DepositSettlementModal
          tenantId={vacateStudentId}
          onClose={() => setVacateStudentId(null)}
          onSuccess={() => {}}
        />
      )}

      {/* Modal: Cyberabad Police HawkEye Verification Card */}
      {policeStudentId && (
        <PoliceVerificationModal
          tenantId={policeStudentId}
          onClose={() => setPoliceStudentId(null)}
        />
      )}

      {/* Modal: Urjavi Electricity Meter Recharge */}
      {urjaviRoom && (
        <UrjaviRechargeModal
          room={urjaviRoom}
          onClose={() => setUrjaviRoom(null)}
        />
      )}

      {/* Modal: Add New Hostel Branch */}
      {isAddHostelOpen && (
        <AddHostelModal
          onClose={() => setIsAddHostelOpen(false)}
        />
      )}

    </div>
  );
};
