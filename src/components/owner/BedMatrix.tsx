import React, { useState } from 'react';
import { useHostel } from '../../context/HostelContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatINR } from '../../utils/dueEngine';
import { Zap, Layers } from 'lucide-react';
import type { Bed, Room } from '../../types/hostel';

interface BedMatrixProps {
  onSelectVacantBed: (room: Room, bed: Bed) => void;
  onSelectOccupiedBed: (tenantId: string) => void;
  onOpenUrjaviRecharge: (room: Room) => void;
}

export const BedMatrix: React.FC<BedMatrixProps> = ({
  onSelectVacantBed,
  onSelectOccupiedBed,
  onOpenUrjaviRecharge
}) => {
  const { activeHostelId, activeHostel, rooms, beds, tenants, dues } = useHostel();
  const { language, t } = useLanguage();
  const [selectedFloor, setSelectedFloor] = useState<number | 'ALL'>('ALL');

  // Filter rooms and beds for the active hostel
  const hostelRooms = rooms.filter(r => r.hostelId === activeHostelId);
  const hostelBeds = beds.filter(b => b.hostelId === activeHostelId);

  // Group rooms by floor
  const floors = Array.from(new Set(hostelRooms.map(r => r.floorNumber))).sort((a, b) => a - b);

  const displayedRooms =
    selectedFloor === 'ALL'
      ? hostelRooms
      : hostelRooms.filter(r => r.floorNumber === selectedFloor);

  // Overall stats
  const totalBeds = hostelBeds.length;
  const occupiedBeds = hostelBeds.filter(b => b.isOccupied).length;
  const vacantBeds = totalBeds - occupiedBeds;
  const occupancyPercent = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Controls: Floor Tabs & Inventory Counter */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Left: Section title & Floor filter */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Layers className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg sm:text-xl font-black text-slate-900 m-0">
              {t('bedMatrix')} — {activeHostel.name}
            </h2>
          </div>

          {/* Floor Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedFloor('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedFloor === 'ALL'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {t('allBeds')} ({totalBeds})
            </button>
            {floors.map(f => {
              const floorBeds = hostelBeds.filter(b => {
                const r = rooms.find(rm => rm.id === b.roomId);
                return r?.floorNumber === f;
              });
              const floorVacant = floorBeds.filter(b => !b.isOccupied).length;
              return (
                <button
                  key={f}
                  onClick={() => setSelectedFloor(f)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    selectedFloor === f
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{t('floor')} {f}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    selectedFloor === f ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {floorVacant} {t('vacantBed')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Quick Inventory Legend & Stats */}
        <div className="flex items-center gap-3 self-start md:self-auto bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
            <span className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-300"></span>
            <span>{vacantBeds} {t('vacantBed')}</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <span className="w-3 h-3 rounded-full bg-slate-700 ring-2 ring-slate-400"></span>
            <span>{occupiedBeds} {t('occupiedBed')}</span>
          </div>
          <span className="text-slate-300">|</span>
          <span className="text-xs font-extrabold text-blue-700">
            {occupancyPercent}% {t('occupancy')}
          </span>
        </div>

      </div>

      {/* Room Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayedRooms.map(room => {
          const roomBeds = hostelBeds.filter(b => b.roomId === room.id);
          const isLowUrjavi = room.urjaviBalanceUnits < 20;

          return (
            <div
              key={room.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              {/* Room Header */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-black text-slate-900">
                        {t('room')} {room.roomNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                        {room.sharingType === 1 ? t('singleRoom') : room.sharingType === 2 ? t('doubleSharing') : room.sharingType === 3 ? t('tripleSharing') : t('fourSharing')}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 font-medium mt-0.5">
                      {t('floor')} {room.floorNumber} • {t('baseRent')} {formatINR(room.defaultPrice)}{t('monthSuffix')}
                    </div>
                  </div>

                  {/* Urjavi Smart Meter Pill */}
                  <button
                    onClick={() => onOpenUrjaviRecharge(room)}
                    title={t('rechargeUrjavi')}
                    className={`flex flex-col items-end px-2.5 py-1 rounded-xl text-right border transition-all cursor-pointer ${
                      isLowUrjavi
                        ? 'bg-amber-50 border-amber-300 hover:bg-amber-100 text-amber-900'
                        : 'bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-900'
                    }`}
                  >
                    <div className="flex items-center gap-1 text-[11px] font-black">
                      <Zap className={`w-3.5 h-3.5 ${isLowUrjavi ? 'text-amber-600 animate-bounce' : 'text-blue-600'}`} />
                      <span>{room.urjaviMeterId || t('urjaviMeter')}</span>
                    </div>
                    <div className="text-[10px] font-bold">
                      {room.urjaviBalanceUnits} {t('units')} ({formatINR(room.urjaviBalanceRupees)})
                    </div>
                    {isLowUrjavi && (
                      <span className="text-[9px] font-black text-rose-600 uppercase tracking-tighter">
                        {t('rechargeUrgent')}
                      </span>
                    )}
                  </button>
                </div>

                {/* Beds in Room */}
                <div className="grid grid-cols-2 gap-2.5 mt-4">
                  {roomBeds.map(bed => {
                    if (!bed.isOccupied) {
                      // VACANT BED: High contrast green button for 60-second onboarding
                      return (
                        <button
                          key={bed.id}
                          onClick={() => onSelectVacantBed(room, bed)}
                          className="p-3.5 rounded-xl border-2 border-dashed border-emerald-400 bg-emerald-50/70 hover:bg-emerald-100/90 text-emerald-800 transition-all text-left flex flex-col justify-between group active:scale-95 shadow-xs cursor-pointer min-h-[96px]"
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="text-xs font-black px-2 py-0.5 rounded-md bg-emerald-600 text-white shadow-xs">
                              {t('bed')} {bed.bedLabel}
                            </span>
                            <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-xs group-hover:rotate-90 transition-transform">
                              +
                            </span>
                          </div>
                          <div>
                            <div className="text-xs font-black text-emerald-900">
                              {t('vacantBed')}
                            </div>
                            <div className="text-[10px] text-emerald-700 font-bold">
                              {t('onboardBed')}
                            </div>
                          </div>
                        </button>
                      );
                    }

                    // OCCUPIED BED: Slate card with tenant name, negotiated rent, and due status
                    const tenant = tenants.find(t => t.id === bed.tenantId);
                    const tenantDue = dues.find(d => d.tenantId === tenant?.id && d.status !== 'PAID');

                    return (
                      <button
                        key={bed.id}
                        onClick={() => tenant && onSelectOccupiedBed(tenant.id)}
                        className="p-3 rounded-xl border border-slate-300 bg-slate-800 hover:bg-slate-900 text-white transition-all text-left flex flex-col justify-between active:scale-95 shadow-xs cursor-pointer min-h-[96px]"
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-slate-700 text-slate-200">
                            {t('bed')} {bed.bedLabel}
                          </span>
                          {tenantDue ? (
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                                tenantDue.status === 'OVERDUE'
                                  ? 'bg-rose-500 text-white'
                                  : 'bg-amber-400 text-slate-950'
                              }`}
                            >
                              {tenantDue.status === 'OVERDUE' ? t('overdue') : t('dueToday')}
                            </span>
                          ) : (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-500/40">
                              {t('allPaid')} ✓
                            </span>
                          )}
                        </div>

                        <div className="mt-2">
                          <div className="text-xs font-black text-white truncate max-w-[130px]">
                            {tenant?.fullName || t('occupiedBed')}
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-slate-300 mt-0.5 font-medium">
                            <span className="text-amber-300 font-bold">
                              {tenant ? formatINR(tenant.agreedRent) : ''}
                            </span>
                            <span className="text-slate-400">
                              {tenant
                                ? language === 'en'
                                  ? `Day ${tenant.anchorDueDay}`
                                  : language === 'te'
                                  ? `${tenant.anchorDueDay}వ తేదీ`
                                  : `${tenant.anchorDueDay} तारीख`
                                : ''}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Card Summary */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>
                  {t('vacantBed')}: {roomBeds.filter(b => !b.isOccupied).length} / {room.sharingType}
                </span>
                <span className="text-slate-400 font-medium">
                  {room.sharingType === 1 ? t('singleRoom') : room.sharingType === 2 ? t('doubleSharing') : room.sharingType === 3 ? t('tripleSharing') : t('fourSharing')}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
