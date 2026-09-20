import React, { useState } from 'react';
import { useHostel } from '../../context/HostelContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatINR, formatDate, formatLocalizedMonth } from '../../utils/dueEngine';
import { generateWhatsAppReminderUrl } from '../../utils/whatsapp';
import { Phone, MessageSquare, CheckCircle2, Clock, AlertTriangle, IndianRupee, ShieldCheck, Zap } from 'lucide-react';

interface MorningCallListProps {
  onSelectStudent: (studentId: string) => void;
}

export const MorningCallList: React.FC<MorningCallListProps> = ({ onSelectStudent }) => {
  const { dues, activeHostelId, activeHostel, tenants, rooms, beds, recordPayment } = useHostel();
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'OVERDUE' | 'DUE_TODAY' | 'UPCOMING' | 'PAID'>('DUE_TODAY');

  // Filter dues for the currently active hostel
  const hostelDues = dues.filter(d => d.hostelId === activeHostelId);

  const overdueList = hostelDues.filter(d => d.status === 'OVERDUE');
  const dueTodayList = hostelDues.filter(d => d.status === 'DUE_TODAY');
  const upcomingList = hostelDues.filter(d => d.status === 'UPCOMING');
  const paidList = hostelDues.filter(d => d.status === 'PAID');

  const currentList =
    activeTab === 'OVERDUE'
      ? overdueList
      : activeTab === 'DUE_TODAY'
      ? dueTodayList
      : activeTab === 'UPCOMING'
      ? upcomingList
      : paidList;

  const handleCashReceived = (dueId: string, amount: number, studentName: string) => {
    const confirmPrompt =
      language === 'te'
        ? `మీరు ${studentName} నుండి ${formatINR(amount)} నగదు స్వీకరించారని నిర్ధారించాలా?`
        : language === 'hi'
        ? `क्या आप पुष्टि करते हैं कि आपको ${studentName} से ${formatINR(amount)} नकद प्राप्त हुआ?`
        : `Are you sure you received cash of ${formatINR(amount)} from ${studentName}?`;

    if (window.confirm(confirmPrompt)) {
      recordPayment(dueId, 'CASH', amount);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white m-0">
                {t('morningCallList')}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {t('callListSubtitle')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-lg bg-white/10 backdrop-blur-xs border border-white/20 text-xs font-bold text-amber-300">
              {activeHostel.name}
            </span>
          </div>
        </div>

        {/* Priority Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5">
          <button
            onClick={() => setActiveTab('OVERDUE')}
            className={`p-3 rounded-xl text-left font-bold transition-all border cursor-pointer ${
              activeTab === 'OVERDUE'
                ? 'bg-rose-500 text-white border-rose-400 shadow-lg shadow-rose-950/40'
                : 'bg-white/10 hover:bg-white/15 text-rose-200 border-white/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider">{t('overdue')}</span>
              <AlertTriangle className="w-4 h-4 text-rose-300" />
            </div>
            <div className="text-2xl font-black mt-1">{overdueList.length}</div>
            <div className="text-[11px] opacity-80 mt-0.5">{t('overdueSubtext')}</div>
          </button>

          <button
            onClick={() => setActiveTab('DUE_TODAY')}
            className={`p-3 rounded-xl text-left font-bold transition-all border cursor-pointer ${
              activeTab === 'DUE_TODAY'
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-950/40 font-black'
                : 'bg-white/10 hover:bg-white/15 text-amber-200 border-white/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider">{t('dueToday')}</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black mt-1">{dueTodayList.length}</div>
            <div className="text-[11px] opacity-90 mt-0.5">{t('dueTodaySubtext')}</div>
          </button>

          <button
            onClick={() => setActiveTab('UPCOMING')}
            className={`p-3 rounded-xl text-left font-bold transition-all border cursor-pointer ${
              activeTab === 'UPCOMING'
                ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-950/40'
                : 'bg-white/10 hover:bg-white/15 text-blue-200 border-white/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider">{t('upcoming')}</span>
              <Clock className="w-4 h-4 text-blue-300" />
            </div>
            <div className="text-2xl font-black mt-1">{upcomingList.length}</div>
            <div className="text-[11px] opacity-80 mt-0.5">{t('upcomingSubtext')}</div>
          </button>

          <button
            onClick={() => setActiveTab('PAID')}
            className={`p-3 rounded-xl text-left font-bold transition-all border cursor-pointer ${
              activeTab === 'PAID'
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg shadow-emerald-950/40'
                : 'bg-white/10 hover:bg-white/15 text-emerald-200 border-white/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider">{t('allPaid')}</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            </div>
            <div className="text-2xl font-black mt-1">{paidList.length}</div>
            <div className="text-[11px] opacity-80 mt-0.5">{t('paidSubtext')}</div>
          </button>
        </div>
      </div>

      {/* List Container */}
      <div className="p-4 sm:p-6 bg-slate-50">
        {currentList.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">
              {activeTab === 'PAID' ? t('emptyPaidList') : t('emptyDuesList')}
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentList.map(due => {
              const tenant = tenants.find(t => t.id === due.tenantId);
              const room = rooms.find(r => r.id === due.roomId);
              const bed = beds.find(b => b.id === due.bedId);

              if (!tenant) return null;

              const whatsappUrl = generateWhatsAppReminderUrl({
                studentName: tenant.fullName,
                studentPhone: tenant.phone,
                hostelName: activeHostel.name,
                roomNumber: room?.roomNumber || t('room'),
                bedLabel: bed?.bedLabel || 'A',
                dueAmount: due.amountDue,
                dueDate: formatDate(due.dueDate, language),
                language
              });

              const isOverdue = due.status === 'OVERDUE';
              const isDueToday = due.status === 'DUE_TODAY';
              const isPaid = due.status === 'PAID';

              return (
                <div
                  key={due.id}
                  className={`bg-white rounded-xl border p-4 sm:p-5 shadow-xs transition-all hover:shadow-md flex flex-col justify-between ${
                    isOverdue
                      ? 'border-rose-300 ring-1 ring-rose-200'
                      : isDueToday
                      ? 'border-amber-300 ring-1 ring-amber-200'
                      : isPaid
                      ? 'border-emerald-200 opacity-90'
                      : 'border-slate-200'
                  }`}
                >
                  {/* Top section: Student details & Due Amount */}
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={tenant.photoUrl}
                          alt={tenant.fullName}
                          className="w-12 h-12 rounded-full object-cover border-2 border-slate-200 cursor-pointer"
                          onClick={() => onSelectStudent(tenant.id)}
                        />
                        <div>
                          <button
                            onClick={() => onSelectStudent(tenant.id)}
                            className="text-base font-black text-slate-900 hover:text-blue-600 text-left cursor-pointer"
                          >
                            {tenant.fullName}
                          </button>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                            <span>{t('room')} {room?.roomNumber}</span>
                            <span>•</span>
                            <span className="font-bold text-slate-700">{t('bed')} {bed?.bedLabel}</span>
                            <span>•</span>
                            <span className="text-slate-600">{tenant.phone}</span>
                          </div>
                        </div>
                      </div>

                      {/* Due Amount Box */}
                      <div className="text-right">
                        <div className="text-lg sm:text-xl font-black text-slate-900">
                          {formatINR(due.amountDue)}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {formatLocalizedMonth(due.monthLabel, language)}
                        </div>
                      </div>
                    </div>

                    {/* Operational Tags (Staggered Anniversary & Deposit & Urjavi) */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-slate-100 text-xs">
                      {/* Anchor Day Pill */}
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold border border-slate-200">
                        {language === 'en'
                          ? `Due Cycle: Day ${tenant.anchorDueDay}`
                          : language === 'te'
                          ? `చేరిన రోజు: ${tenant.anchorDueDay}వ తేదీ`
                          : `देय तारीख: ${tenant.anchorDueDay} तारीख`}
                      </span>

                      {/* Negotiated rent chip */}
                      {tenant.baseRent > tenant.agreedRent && (
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                          {t('rentDiscount')}: -{formatINR(tenant.baseRent - tenant.agreedRent)}
                        </span>
                      )}

                      {/* Security deposit status */}
                      <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-semibold border border-purple-200 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-purple-600" />
                        {t('deposit')}: {formatINR(tenant.securityDeposit)} ({tenant.depositStatus === 'PENDING' ? t('pending') : t('paid')})
                      </span>

                      {/* Urjavi Meter ID */}
                      {room?.urjaviMeterId && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-semibold border border-amber-200 flex items-center gap-1">
                          <Zap className="w-3 h-3 text-amber-600" />
                          {room.urjaviMeterId}
                        </span>
                      )}

                      {/* Due Status Tag */}
                      {isOverdue && (
                        <span className="ml-auto px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 font-black border border-rose-300">
                          ⚠️ {due.daysOverdue} {t('daysLate')}
                        </span>
                      )}
                      {isDueToday && (
                        <span className="ml-auto px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-black border border-amber-300">
                          ⚡ {t('dueToday')}
                        </span>
                      )}
                      {isPaid && (
                        <span className="ml-auto px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-black border border-emerald-300">
                          ✓ {t('paidTag')} ({due.paidMethod === 'PHONEPE_SOUNDBOX' ? t('methodSoundbox') : due.paidMethod === 'CASH' ? t('methodCash') : t('methodUpi')})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 3 Primary 1-Tap 56px Action Buttons */}
                  {!isPaid ? (
                    <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100">
                      
                      {/* Action 1: Native Phone Dialer */}
                      <a
                        href={`tel:${tenant.phone}`}
                        className="h-14 flex flex-col items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs active:scale-95 transition-all text-xs"
                      >
                        <Phone className="w-4 h-4 mb-0.5" />
                        <span>{t('callStudent')}</span>
                      </a>

                      {/* Action 2: WhatsApp Deep Link */}
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-14 flex flex-col items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs active:scale-95 transition-all text-xs"
                      >
                        <MessageSquare className="w-4 h-4 mb-0.5" />
                        <span>{t('sendWhatsApp')}</span>
                      </a>

                      {/* Action 3: 1-Tap Cash / Soundbox Reconciliation */}
                      <button
                        onClick={() => handleCashReceived(due.id, due.amountDue, tenant.fullName)}
                        className="h-14 flex flex-col items-center justify-center bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-xl font-black shadow-xs active:scale-95 transition-all text-xs border border-amber-500/30 cursor-pointer"
                      >
                        <IndianRupee className="w-4 h-4 mb-0.5 text-amber-400" />
                        <span>{t('cashReceived')}</span>
                      </button>

                    </div>
                  ) : (
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span>{t('paidDate')}: {formatDate(due.paidDate || due.dueDate, language)}</span>
                      <span className="text-emerald-700 font-bold">{t('soundboxConfirmed')}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
