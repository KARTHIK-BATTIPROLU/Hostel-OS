import React, { useState, useRef } from 'react';
import { useHostel } from '../../context/HostelContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatINR } from '../../utils/dueEngine';
import type { Room, Bed, DepositStatus } from '../../types/hostel';
import { X, Check, ShieldCheck, Zap, Sparkles, Camera, Upload } from 'lucide-react';

interface QuickOnboardingModalProps {
  room: Room;
  bed: Bed;
  onClose: () => void;
}

export const QuickOnboardingModal: React.FC<QuickOnboardingModalProps> = ({
  room,
  bed,
  onClose
}) => {
  const { onboardTenant, currentSimulatedDate } = useHostel();
  const { language, t } = useLanguage();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [joiningDate, setJoiningDate] = useState(currentSimulatedDate);
  const [collegeOrCompany, setCollegeOrCompany] = useState('');
  const [homeTown, setHomeTown] = useState('');

  // Dynamic Negotiated Rent
  const basePrice = room.defaultPrice || 8000;
  const [agreedRent, setAgreedRent] = useState(basePrice);

  // Security Deposit: Default 5000, chips 3000, 5000, 10000, custom
  const [depositChip, setDepositChip] = useState<'3000' | '5000' | '10000' | 'CUSTOM'>('5000');
  const [securityDeposit, setSecurityDeposit] = useState(5000);
  const [depositStatus, setDepositStatus] = useState<DepositStatus>('PAID_UPI');

  // Urjavi Meter ID
  const [urjaviMeterId, setUrjaviMeterId] = useState(room.urjaviMeterId || '');

  // Aadhaar Photo Upload & Camera Capture
  const defaultFront = 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80';
  const defaultBack = 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80';
  const defaultPhoto = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80';

  const [aadhaarFrontUrl, setAadhaarFrontUrl] = useState(defaultFront);
  const [aadhaarBackUrl, setAadhaarBackUrl] = useState(defaultBack);
  const [aadhaarFrontName, setAadhaarFrontName] = useState('aadhaar_front.jpg');
  const [aadhaarBackName, setAadhaarBackName] = useState('aadhaar_back.jpg');

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  // Timezone-safe anchor day calculation
  const anchorDay = Number(joiningDate.split('-')[2]) || 20;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          if (side === 'front') {
            setAadhaarFrontUrl(reader.result);
            setAadhaarFrontName(file.name);
          } else {
            setAadhaarBackUrl(reader.result);
            setAadhaarBackName(file.name);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDepositChipClick = (val: '3000' | '5000' | '10000' | 'CUSTOM') => {
    setDepositChip(val);
    if (val !== 'CUSTOM') {
      setSecurityDeposit(Number(val));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      alert(t('pleaseEnterName'));
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      alert(t('pleaseEnterPhone'));
      return;
    }

    onboardTenant({
      hostelId: room.hostelId,
      roomId: room.id,
      bedId: bed.id,
      fullName: fullName.trim(),
      phone: phone.trim(),
      emergencyPhone: emergencyPhone.trim() || '9440123999',
      joiningDate,
      baseRent: basePrice,
      agreedRent: Number(agreedRent),
      securityDeposit: Number(securityDeposit),
      depositStatus,
      urjaviMeterId,
      aadhaarFrontUrl,
      aadhaarBackUrl,
      photoUrl: defaultPhoto,
      collegeOrCompany: collegeOrCompany.trim() || 'Hyderabad Professional',
      homeTown: homeTown.trim() || 'Telangana'
    });

    onClose();
  };

  const handleQuickDiscount = (discount: number) => {
    setAgreedRent(Math.max(1000, basePrice - discount));
  };

  const loadSampleStudentData = () => {
    setFullName('Ch. Vamsi Krishna');
    setPhone('9849556677');
    setEmergencyPhone('9440112233');
    setAgreedRent(basePrice - 800);
    setDepositChip('5000');
    setSecurityDeposit(5000);
    setDepositStatus('PAID_UPI');
    setCollegeOrCompany('Infosys (Pocharam)');
    setHomeTown('Warangal, Telangana');
  };

  const namePlaceholder = language === 'en' ? 'e.g. M. Sai Kiran' : language === 'te' ? 'ఉదా: ఎం. సాయి కిరణ్' : 'उदा: एम. साई किरण';
  const phonePlaceholder = language === 'en' ? '10-digit mobile number' : language === 'te' ? '10 అంకెల మొబైల్ నంబర్' : '10 अंकों का मोबाइल नंबर';
  const emergencyPlaceholder = language === 'en' ? 'Parent / Emergency phone' : language === 'te' ? 'తల్లిదండ్రుల ఫోన్ నంబర్' : 'अभिभावक का फोन नंबर';
  const urjaviPlaceholder = 'e.g. URJ-KOK-101';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-4 sm:p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/15 backdrop-blur-xs">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black m-0 text-white">
                {t('studentOnboarding')}
              </h3>
              <div className="flex items-center gap-2 text-xs text-blue-100 mt-0.5">
                <span className="font-black bg-white/20 px-2 py-0.5 rounded">
                  {t('room')} {room.roomNumber}
                </span>
                <span>•</span>
                <span className="font-black bg-white/20 px-2 py-0.5 rounded">
                  {t('bed')} {bed.bedLabel}
                </span>
                <span>•</span>
                <span>{t('baseRent')}: {formatINR(basePrice)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadSampleStudentData}
              className="text-[11px] font-bold px-2 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg shadow-xs cursor-pointer"
            >
              {t('sampleData')}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[82vh] overflow-y-auto">
          
          {/* 1. Basic Student Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('studentName')} *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder={namePlaceholder}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-sm font-semibold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('phoneNumber')} *
              </label>
              <input
                type="tel"
                required
                maxLength={10}
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder={phonePlaceholder}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-sm font-semibold text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('emergencyContact')}
              </label>
              <input
                type="tel"
                value={emergencyPhone}
                onChange={e => setEmergencyPhone(e.target.value)}
                placeholder={emergencyPlaceholder}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-sm font-semibold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('joiningDate')} & {t('anchorDueDay')}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={joiningDate}
                  onChange={e => setJoiningDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-sm font-semibold text-slate-900"
                />
                <span className="shrink-0 px-2.5 py-2 rounded-xl bg-blue-50 text-blue-800 text-xs font-black border border-blue-200">
                  {language === 'en'
                    ? `Day ${anchorDay}`
                    : language === 'te'
                    ? `${anchorDay}వ తేదీ`
                    : `${anchorDay} तारीख`}
                </span>
              </div>
            </div>
          </div>

          {/* 2. Dynamic Negotiated Rent Override */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-black text-slate-800">
                {t('agreedRent')}
              </label>
              <div className="text-xs text-slate-500">
                {t('baseRent')}: <span className="line-through">{formatINR(basePrice)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  value={agreedRent}
                  onChange={e => setAgreedRent(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 font-black text-lg text-blue-700 bg-white"
                />
              </div>
              {basePrice > agreedRent && (
                <span className="px-2.5 py-2 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
                  -{formatINR(basePrice - agreedRent)} {t('discountOffered')}
                </span>
              )}
            </div>

            {/* Quick Discount Chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-slate-400">{t('quickChips')}:</span>
              <button
                type="button"
                onClick={() => setAgreedRent(basePrice)}
                className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold hover:bg-slate-100 cursor-pointer"
              >
                {t('baseRent')} ({formatINR(basePrice)})
              </button>
              <button
                type="button"
                onClick={() => handleQuickDiscount(500)}
                className="px-2 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold hover:bg-blue-100 cursor-pointer"
              >
                -₹500 ({formatINR(basePrice - 500)})
              </button>
              <button
                type="button"
                onClick={() => handleQuickDiscount(800)}
                className="px-2 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold hover:bg-blue-100 cursor-pointer"
              >
                -₹800 ({formatINR(basePrice - 800)})
              </button>
              <button
                type="button"
                onClick={() => handleQuickDiscount(1000)}
                className="px-2 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold hover:bg-blue-100 cursor-pointer"
              >
                -₹1,000 ({formatINR(basePrice - 1000)})
              </button>
            </div>
          </div>

          {/* 3. Security Deposit Standard (₹5,000 default + chips + Custom) & Status */}
          <div className="bg-purple-50/60 p-3.5 rounded-xl border border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-purple-700" />
                <label className="text-xs font-black text-purple-950">
                  {t('securityDeposit')}
                </label>
              </div>
              <span className="text-xs font-black text-purple-800">
                {formatINR(securityDeposit)}
              </span>
            </div>

            {/* Deposit amount chips including Custom */}
            <div className="flex items-center gap-1.5 mb-2.5 flex-wrap">
              {(['3000', '5000', '10000'] as const).map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleDepositChipClick(amt)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    depositChip === amt
                      ? 'bg-purple-700 text-white shadow-xs'
                      : 'bg-white text-purple-900 border border-purple-200 hover:bg-purple-100'
                  }`}
                >
                  ₹{Number(amt).toLocaleString('en-IN')} {amt === '5000' ? `(${t('standard')})` : ''}
                </button>
              ))}

              <button
                type="button"
                onClick={() => handleDepositChipClick('CUSTOM')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  depositChip === 'CUSTOM'
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'bg-white text-purple-900 border border-purple-200 hover:bg-purple-100'
                }`}
              >
                {t('customDeposit')}
              </button>
            </div>

            {/* Custom Deposit Input if selected */}
            {depositChip === 'CUSTOM' && (
              <div className="mb-3">
                <div className="relative">
                  <span className="absolute left-3 top-2 text-purple-400 font-bold">₹</span>
                  <input
                    type="number"
                    value={securityDeposit}
                    onChange={e => setSecurityDeposit(Number(e.target.value))}
                    placeholder={t('enterDepositPlaceholder')}
                    className="w-full pl-7 pr-3 py-1.5 rounded-lg border border-purple-300 text-sm font-bold bg-white text-purple-900"
                  />
                </div>
              </div>
            )}

            {/* Deposit status toggle */}
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => setDepositStatus('PAID_UPI')}
                className={`py-2 px-1 rounded-lg text-xs font-black text-center transition-all border cursor-pointer ${
                  depositStatus === 'PAID_UPI'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                ⚡ {t('paidUpi')}
              </button>
              <button
                type="button"
                onClick={() => setDepositStatus('PAID_CASH')}
                className={`py-2 px-1 rounded-lg text-xs font-black text-center transition-all border cursor-pointer ${
                  depositStatus === 'PAID_CASH'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                💵 {t('paidCash')}
              </button>
              <button
                type="button"
                onClick={() => setDepositStatus('PENDING')}
                className={`py-2 px-1 rounded-lg text-xs font-black text-center transition-all border cursor-pointer ${
                  depositStatus === 'PENDING'
                    ? 'bg-rose-600 text-white border-rose-500 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                ⏳ {t('pending')}
              </button>
            </div>
          </div>

          {/* 4. Urjavi Meter ID Reference */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50/60 border border-amber-200">
            <Zap className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="flex-1">
              <div className="text-xs font-bold text-amber-950">
                {t('urjaviMeter')}
              </div>
              <input
                type="text"
                value={urjaviMeterId}
                onChange={e => setUrjaviMeterId(e.target.value)}
                placeholder={urjaviPlaceholder}
                className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-amber-300 text-xs font-black text-amber-900 bg-white"
              />
            </div>
          </div>

          {/* 5. Aadhaar Card Photo Capture & File Upload with Preview */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700">
                {t('aadhaarCard')}
              </label>
              <span className="text-[10px] text-slate-500 font-medium">
                Cyberabad HawkEye
              </span>
            </div>

            {/* Hidden file inputs */}
            <input
              ref={frontInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={e => handleFileUpload(e, 'front')}
            />
            <input
              ref={backInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={e => handleFileUpload(e, 'back')}
            />

            <div className="grid grid-cols-2 gap-3">
              {/* Front side upload / preview card */}
              <div className="border border-slate-200 rounded-xl p-2.5 text-center bg-slate-50 flex flex-col justify-between">
                <div>
                  <img
                    src={aadhaarFrontUrl}
                    alt="Aadhaar Front"
                    className="w-full h-24 object-cover rounded-lg mb-1.5 border border-slate-200 shadow-2xs"
                  />
                  <span className="text-[11px] font-bold text-slate-700 block truncate">
                    {t('frontSide')}
                  </span>
                  <span className="text-[9px] text-slate-400 block truncate">
                    {aadhaarFrontName}
                  </span>
                </div>

                <div className="flex items-center gap-1 mt-2">
                  <button
                    type="button"
                    onClick={() => frontInputRef.current?.click()}
                    className="flex-1 py-1.5 px-2 bg-white hover:bg-slate-100 text-blue-700 border border-slate-300 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <Upload className="w-3 h-3" />
                    <span>{t('upload')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => frontInputRef.current?.click()}
                    className="py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-lg text-[10px] font-bold flex items-center justify-center cursor-pointer transition-colors"
                    title={t('camera')}
                  >
                    <Camera className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Back side upload / preview card */}
              <div className="border border-slate-200 rounded-xl p-2.5 text-center bg-slate-50 flex flex-col justify-between">
                <div>
                  <img
                    src={aadhaarBackUrl}
                    alt="Aadhaar Back"
                    className="w-full h-24 object-cover rounded-lg mb-1.5 border border-slate-200 shadow-2xs"
                  />
                  <span className="text-[11px] font-bold text-slate-700 block truncate">
                    {t('backSide')}
                  </span>
                  <span className="text-[9px] text-slate-400 block truncate">
                    {aadhaarBackName}
                  </span>
                </div>

                <div className="flex items-center gap-1 mt-2">
                  <button
                    type="button"
                    onClick={() => backInputRef.current?.click()}
                    className="flex-1 py-1.5 px-2 bg-white hover:bg-slate-100 text-blue-700 border border-slate-300 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <Upload className="w-3 h-3" />
                    <span>{t('upload')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => backInputRef.current?.click()}
                    className="py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-lg text-[10px] font-bold flex items-center justify-center cursor-pointer transition-colors"
                    title={t('camera')}
                  >
                    <Camera className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 6. Big 56px Action Button */}
          <button
            type="submit"
            className="w-full h-14 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl font-black text-base shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
          >
            <Check className="w-5 h-5" />
            <span>{t('saveStudent')}</span>
          </button>

        </form>

      </div>
    </div>
  );
};
