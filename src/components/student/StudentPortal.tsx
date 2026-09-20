import React, { useState, useEffect } from 'react';
import { useHostel } from '../../context/HostelContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { formatINR, formatDate, formatLocalizedMonth } from '../../utils/dueEngine';
import { RazorpayCheckoutModal } from './RazorpayCheckoutModal';
import { PaymentReceiptModal } from './PaymentReceiptModal';
import { UrjaviRechargeModal } from '../owner/UrjaviRechargeModal';
import {
  Zap,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  Receipt,
  Download,
  ArrowRight,
  Smartphone,
  CreditCard,
  LogOut,
  CheckCircle2,
  KeyRound
} from 'lucide-react';
import type { PaymentRecord } from '../../types/hostel';

export const StudentPortal: React.FC = () => {
  const { hostels, tenants, rooms, beds, dues, payments } = useHostel();
  const { language, t } = useLanguage();
  const {
    currentStudentId,
    setCurrentStudentId,
    loginAsOwner,
    autoTriggerPay,
    setAutoTriggerPay,
    loginWithPhone
  } = useAuth();

  // Find enrolled active students
  const activeTenants = tenants.filter(t => t.status === 'ACTIVE');
  const currentTenant = activeTenants.find(t => t.id === currentStudentId) || activeTenants[0];

  const currentHostel = currentTenant ? hostels.find(h => h.id === currentTenant.hostelId) || hostels[0] : hostels[0];
  const currentRoom = currentTenant ? rooms.find(r => r.id === currentTenant.roomId) : undefined;
  const currentBed = currentTenant ? beds.find(b => b.id === currentTenant.bedId) : undefined;

  // Active due for current tenant
  const activeDue = currentTenant
    ? dues.find(d => d.tenantId === currentTenant.id && d.status !== 'PAID')
    : undefined;

  // Past payments for current tenant
  const tenantPayments = currentTenant
    ? payments.filter(p => p.tenantId === currentTenant.id)
    : [];

  // State for modals
  const [showCheckout, setShowCheckout] = useState(false);
  const [showUrjaviModal, setShowUrjaviModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentRecord | null>(null);

  // Mobile Login states
  const [showMobileLogin, setShowMobileLogin] = useState(!currentStudentId);
  const [phoneInput, setPhoneInput] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [otpInput, setOtpInput] = useState('4826');
  const [loginError, setLoginError] = useState('');

  // Auto trigger pay from deep link (?student=...&action=pay)
  useEffect(() => {
    if (autoTriggerPay && activeDue) {
      setShowCheckout(true);
      setAutoTriggerPay(false);
    }
  }, [autoTriggerPay, activeDue, setAutoTriggerPay]);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const clean = phoneInput.replace(/\D/g, '');
    if (clean.length < 10) {
      setLoginError(t('pleaseEnterPhone'));
      return;
    }
    const res = loginWithPhone(clean);
    if (!res.success) {
      setLoginError(res.error || t('studentNotFound'));
      return;
    }
    setOtpStep(true);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput === '4826' || otpInput.length === 4) {
      setShowMobileLogin(false);
      setOtpStep(false);
    } else {
      setLoginError(t('invalidOtp'));
    }
  };

  const handleQuickStudentSelect = (studentPhone: string) => {
    setPhoneInput(studentPhone);
    const res = loginWithPhone(studentPhone);
    if (res.success) {
      setShowMobileLogin(false);
      setOtpStep(false);
    }
  };

  const isLowUrjavi = (currentRoom?.urjaviBalanceUnits || 0) < 20;

  const handlePaymentSuccess = () => {
    setShowCheckout(false);
    const latestPayment = payments.find(p => p.tenantId === currentTenant?.id);
    if (latestPayment) {
      setSelectedReceipt(latestPayment);
    }
  };

  // Mobile Login Screen View
  if (showMobileLogin) {
    return (
      <div className="max-w-md mx-auto py-8 px-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in zoom-in-95 duration-150">
          
          <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-6 text-white text-center">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-xs rounded-2xl flex items-center justify-center mx-auto mb-3 border border-white/20">
              <Smartphone className="w-7 h-7 text-amber-300" />
            </div>
            <h2 className="text-xl font-black text-white m-0">
              {t('loginStudent')}
            </h2>
            <p className="text-xs text-blue-100 mt-1">
              {t('noAppRequired')}
            </p>
          </div>

          <div className="p-6 space-y-4">
            {!otpStep ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('enterMobile')} *
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-2.5 bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-700">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={phoneInput}
                      onChange={e => setPhoneInput(e.target.value)}
                      placeholder="9849123456"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {loginError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-bold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{loginError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  {t('getOtp')}
                </button>

                {/* Quick 1-Tap Test Demo Logins */}
                <div className="pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 block mb-2">
                    {t('demoStudentSelect')}
                  </span>
                  <div className="space-y-1.5">
                    {activeTenants.slice(0, 4).map(tn => (
                      <button
                        key={tn.id}
                        type="button"
                        onClick={() => handleQuickStudentSelect(tn.phone)}
                        className="w-full p-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 text-left flex items-center justify-between text-xs cursor-pointer transition-colors"
                      >
                        <span className="font-bold text-slate-800">{tn.fullName}</span>
                        <span className="text-[11px] text-blue-600 font-semibold">{tn.phone}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="text-center">
                  <div className="inline-flex p-2 bg-emerald-50 rounded-full text-emerald-600 mb-2">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900">
                    {t('otpVerification')}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {t('otpSentTo')} {phoneInput}
                  </p>
                </div>

                <div>
                  <input
                    type="text"
                    maxLength={4}
                    value={otpInput}
                    onChange={e => setOtpInput(e.target.value)}
                    className="w-full text-center tracking-widest text-2xl font-black py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-slate-900"
                    placeholder="4826"
                  />
                  <span className="text-[10px] text-slate-400 text-center block mt-1">
                    {t('demoOtpNotice')}
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-xl shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t('verifyOtp')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOtpStep(false)}
                  className="w-full text-center text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  {t('changeMobile')}
                </button>
              </form>
            )}

            <div className="pt-2 text-center">
              <button
                onClick={loginAsOwner}
                className="text-xs text-blue-600 font-bold hover:underline cursor-pointer"
              >
                {t('goToOwner')}
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  }

  if (!currentTenant) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 text-center">
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <Smartphone className="w-12 h-12 text-blue-600 mx-auto mb-3" />
          <h3 className="text-lg font-black text-slate-900">
            {t('noStudentsInHostel')}
          </h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            {t('noStudentsSub')}
          </p>
          <button
            onClick={loginAsOwner}
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl text-sm cursor-pointer"
          >
            {t('goToOwner')}
          </button>
        </div>
      </div>
    );
  }

  const rentCycleText =
    language === 'en'
      ? `Every Day ${currentTenant.anchorDueDay} Monthly Due Cycle`
      : language === 'te'
      ? `ప్రతినెల ${currentTenant.anchorDueDay}న అద్దె సైకిల్`
      : `हर महीने ${currentTenant.anchorDueDay} तारीख को किराया चक्र`;

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-5">
      
      {/* Quick Student Switcher & Mobile Account Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">{t('loginLabel')}</span>
          <select
            value={currentTenant.id}
            onChange={e => setCurrentStudentId(e.target.value)}
            className="text-xs font-black text-blue-900 bg-blue-50 py-1.5 px-2.5 rounded-xl border border-blue-200 cursor-pointer"
          >
            {activeTenants.map(tn => {
              const r = rooms.find(rm => rm.id === tn.roomId);
              return (
                <option key={tn.id} value={tn.id}>
                  {tn.fullName} ({t('room')} {r?.roomNumber || ''})
                </option>
              );
            })}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMobileLogin(true)}
            className="text-[11px] font-bold text-slate-600 hover:text-blue-600 flex items-center gap-1 cursor-pointer"
            title={t('switchLabel')}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t('switchLabel')}</span>
          </button>
          <span className="text-slate-300">|</span>
          <button
            onClick={loginAsOwner}
            className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
          >
            {t('ownerView')}
          </button>
        </div>
      </div>

      {/* 1. Student Identity Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
        <div className="flex items-start gap-3.5 relative z-10">
          <img
            src={currentTenant.photoUrl}
            alt={currentTenant.fullName}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-md shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white m-0">
                {currentTenant.fullName}
              </h2>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-400 text-slate-950">
                {t('verifiedInmate')}
              </span>
            </div>
            <div className="text-xs text-slate-300 mt-1">
              <span>{t('room')} {currentRoom?.roomNumber}</span> •{' '}
              <span className="text-amber-400 font-bold">{t('bed')} {currentBed?.bedLabel}</span> •{' '}
              <span>{currentHostel.name}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-2 font-medium">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>{t('joiningDate')}: {formatDate(currentTenant.joiningDate, language)}</span>
              <span>•</span>
              <span className="text-amber-300 font-bold">
                {rentCycleText}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Urjavi Smart Electricity Meter Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-900">
              <Zap className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-slate-900 m-0">
                  {t('urjaviMeter')}
                </h3>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {t('meterIdLabel')} <span className="font-bold text-slate-900">{currentRoom?.urjaviMeterId || 'URJ-ROOM'}</span>
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-lg font-black text-slate-900 block">
              {currentRoom?.urjaviBalanceUnits} kWh
            </span>
            <span className="text-xs font-bold text-slate-500">
              ({formatINR(currentRoom?.urjaviBalanceRupees || 0)})
            </span>
          </div>
        </div>

        {/* Warning if low balance */}
        {isLowUrjavi && (
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs font-bold text-amber-900 flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{t('lowBalanceWarning')}</span>
          </div>
        )}

        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => setShowUrjaviModal(true)}
            className="flex-1 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
          >
            <Zap className="w-4 h-4" />
            <span>{t('rechargeUrjaviBtn')}</span>
          </button>
          
          <a
            href="https://urjava.in"
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
          >
            Urjavi App
          </a>
        </div>
      </div>

      {/* 3. Live Rent Due Card */}
      <div className="bg-white rounded-2xl border-2 border-blue-500 p-5 shadow-sm space-y-4">
        
        {/* Due Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                {activeDue ? formatLocalizedMonth(activeDue.monthLabel, language) : t('rentStatus')}
              </span>
              {activeDue ? (
                <span
                  className={`text-[11px] font-black px-2 py-0.5 rounded-md ${
                    activeDue.status === 'OVERDUE'
                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                      : activeDue.status === 'DUE_TODAY'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {activeDue.status === 'OVERDUE'
                    ? `⚠️ ${activeDue.daysOverdue} ${t('daysLate')}`
                    : activeDue.status === 'DUE_TODAY'
                    ? `⚡ ${t('dueToday')}`
                    : t('upcoming')}
                </span>
              ) : (
                <span className="text-[11px] font-black px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {t('allPaidStatus')}
                </span>
              )}
            </div>
            
            <div className="text-3xl font-black text-slate-900 mt-1">
              {activeDue ? formatINR(activeDue.amountDue) : formatINR(currentTenant.agreedRent)}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {activeDue ? `${t('dueDateLabel')} ${formatDate(activeDue.dueDate, language)}` : t('rentPaidNote')}
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-blue-50 border border-blue-200">
            <CreditCard className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        {/* Rent & Deposit Breakdown */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>{t('basePriceLabel')}</span>
            <span className="font-bold text-slate-800">{formatINR(currentTenant.baseRent)}</span>
          </div>

          {currentTenant.baseRent > currentTenant.agreedRent && (
            <div className="flex justify-between text-emerald-700 font-bold">
              <span>{t('ownerDiscountLabel')}</span>
              <span>-{formatINR(currentTenant.baseRent - currentTenant.agreedRent)}</span>
            </div>
          )}

          <div className="flex justify-between text-slate-600 pt-1.5 border-t border-slate-200">
            <span>{t('depositRecordLabel')}</span>
            <span className="font-black text-purple-800">
              {formatINR(currentTenant.securityDeposit)} ({currentTenant.depositStatus === 'PENDING' ? t('pending') : t('depositReceived')})
            </span>
          </div>
        </div>

        {/* Razorpay UPI Action Button */}
        {activeDue ? (
          <button
            type="button"
            onClick={() => setShowCheckout(true)}
            className="w-full h-14 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black text-base rounded-xl shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
          >
            <span>{formatINR(activeDue.amountDue)} — {t('payRentBtn')}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center text-xs font-bold text-emerald-800">
            {t('noDuesPending')}
          </div>
        )}

      </div>

      {/* 4. Past Payment Receipts & Downloads */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-slate-600" />
            <h3 className="text-sm font-black text-slate-900 m-0">
              {t('digitalReceipts')}
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-bold">
            {tenantPayments.length} {t('records')}
          </span>
        </div>

        {tenantPayments.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400">
            {t('noReceipts')}
          </div>
        ) : (
          <div className="space-y-2">
            {tenantPayments.map(payment => (
              <div
                key={payment.id}
                className="p-3 bg-slate-50 hover:bg-blue-50/50 rounded-xl border border-slate-200 flex items-center justify-between transition-colors"
              >
                <div>
                  <span className="text-xs font-black text-slate-900 block">
                    {formatINR(payment.amount)} • {payment.description}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Ref: {payment.transactionRef} • {payment.timestamp}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedReceipt(payment)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-blue-300 text-blue-700 text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{t('receiptBtn')}</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Cyberabad Police HawkEye Verified Badge */}
      <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 flex items-center gap-3">
        <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
        <div className="text-xs text-slate-600 leading-snug">
          <span className="font-bold text-slate-900 block">
            {t('hawkEyeVerifiedRecord')}
          </span>
          {t('kycVerifiedBanner')}
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && activeDue && (
        <RazorpayCheckoutModal
          tenant={currentTenant}
          due={activeDue}
          onClose={() => setShowCheckout(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* Urjavi Modal */}
      {showUrjaviModal && currentRoom && (
        <UrjaviRechargeModal
          room={currentRoom}
          onClose={() => setShowUrjaviModal(false)}
        />
      )}

      {/* Receipt Modal */}
      {selectedReceipt && (
        <PaymentReceiptModal
          payment={selectedReceipt}
          tenant={currentTenant}
          onClose={() => setSelectedReceipt(null)}
        />
      )}

    </div>
  );
};
