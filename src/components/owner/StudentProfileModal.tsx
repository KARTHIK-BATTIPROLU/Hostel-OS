import React, { useState } from 'react';
import { useHostel } from '../../context/HostelContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { formatINR, formatDate } from '../../utils/dueEngine';
import { X, Phone, MessageSquare, Zap, FileText, LogOut, Edit3, Check, ExternalLink } from 'lucide-react';

interface StudentProfileModalProps {
  tenantId: string;
  onClose: () => void;
  onOpenPoliceCard: (tenantId: string) => void;
  onOpenVacateModal: (tenantId: string) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  tenantId,
  onClose,
  onOpenPoliceCard,
  onOpenVacateModal
}) => {
  const { getTenantById, getRoomById, getBedById, activeHostel, updateAgreedRent } = useHostel();
  const { language, t } = useLanguage();
  const { loginAsStudent } = useAuth();

  const tenant = getTenantById(tenantId);
  const room = tenant ? getRoomById(tenant.roomId) : undefined;
  const bed = tenant ? getBedById(tenant.bedId) : undefined;

  const [isEditingRent, setIsEditingRent] = useState(false);
  const [rentInput, setRentInput] = useState(tenant ? tenant.agreedRent : 0);

  if (!tenant) return null;

  const handleSaveRent = () => {
    if (rentInput > 0) {
      updateAgreedRent(tenant.id, rentInput);
      setIsEditingRent(false);
    }
  };

  const handlePreviewAsStudent = () => {
    loginAsStudent(tenant.id);
    onClose();
  };

  const discountText =
    language === 'en'
      ? `Discount: -${formatINR(tenant.baseRent - tenant.agreedRent)} from sticker ${formatINR(tenant.baseRent)}`
      : language === 'te'
      ? `స్టిక్కర్ ${formatINR(tenant.baseRent)} నుండి -${formatINR(tenant.baseRent - tenant.agreedRent)} రెంట్ తగ్గించాం`
      : `मूल किराये ${formatINR(tenant.baseRent)} से -${formatINR(tenant.baseRent - tenant.agreedRent)} छूट`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-4 sm:p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={tenant.photoUrl}
              alt={tenant.fullName}
              className="w-14 h-14 rounded-full object-cover border-2 border-amber-400 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-white m-0">
                  {tenant.fullName}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/30 text-emerald-300 border border-emerald-500/40">
                  {t('activeStudent')}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300 mt-1 font-medium">
                <span>{t('room')} {room?.roomNumber}</span>
                <span>•</span>
                <span className="text-amber-400 font-bold">{t('bed')} {bed?.bedLabel}</span>
                <span>•</span>
                <span>{activeHostel.name}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto text-slate-800">
          
          {/* Quick Contact Bar */}
          <div className="flex items-center gap-2">
            <a
              href={`tel:${tenant.phone}`}
              className="flex-1 py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center gap-2 border border-blue-200 transition-colors"
            >
              <Phone className="w-4 h-4 text-blue-600" />
              <span>{t('call')}: {tenant.phone}</span>
            </a>
            <a
              href={`https://wa.me/91${tenant.phone.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center gap-2 border border-emerald-200 transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>{t('whatsAppMsg')}</span>
            </a>
          </div>

          {/* Key Stay Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 block">{t('joiningDate')}</span>
              <span className="text-sm font-black text-slate-900 mt-0.5 block">
                {formatDate(tenant.joiningDate, language)}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 block">{t('monthlyCycle')}</span>
              <span className="text-sm font-black text-blue-700 mt-0.5 block">
                {language === 'en'
                  ? `Every Day ${tenant.anchorDueDay}`
                  : language === 'te'
                  ? `ప్రతి ${tenant.anchorDueDay}వ తేదీ`
                  : `हर महीने ${tenant.anchorDueDay} तारीख`}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
              <span className="text-[11px] font-bold text-slate-500 block">{t('securityDeposit')}</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-sm font-black text-purple-800">
                  {formatINR(tenant.securityDeposit)}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-sm bg-emerald-100 text-emerald-800 font-bold">
                  {tenant.depositStatus === 'PENDING' ? t('pending') : t('paid')}
                </span>
              </div>
            </div>
          </div>

          {/* Dynamic Negotiated Rent Details */}
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-600 block">
                  {t('agreedRent')}
                </span>
                {!isEditingRent ? (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xl font-black text-blue-900">
                      {formatINR(tenant.agreedRent)}{t('monthSuffix')}
                    </span>
                    {tenant.baseRent > tenant.agreedRent && (
                      <span className="text-xs px-2 py-0.5 rounded-md bg-blue-200 text-blue-900 font-bold">
                        {discountText}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="number"
                      value={rentInput}
                      onChange={e => setRentInput(Number(e.target.value))}
                      className="w-32 px-2.5 py-1 text-sm font-bold border border-blue-300 rounded-lg bg-white"
                    />
                    <button
                      onClick={handleSaveRent}
                      className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      {t('save')}
                    </button>
                    <button
                      onClick={() => setIsEditingRent(false)}
                      className="px-2 py-1 text-slate-500 text-xs cursor-pointer"
                    >
                      {t('cancel')}
                    </button>
                  </div>
                )}
              </div>

              {!isEditingRent && (
                <button
                  onClick={() => setIsEditingRent(true)}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  {t('edit')}
                </button>
              )}
            </div>
          </div>

          {/* Urjavi Meter & Room Info */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
            <div className="flex items-center gap-2.5">
              <Zap className="w-5 h-5 text-amber-600" />
              <div>
                <span className="text-xs font-black text-amber-950 block">
                  {t('urjaviMeter')} ({room?.urjaviMeterId})
                </span>
                <span className="text-[11px] text-amber-800">
                  {room?.urjaviBalanceUnits} {t('units')} ({formatINR(room?.urjaviBalanceRupees || 0)})
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-900 bg-white px-2 py-1 rounded-lg border border-amber-300">
              {t('urjaviConnected')}
            </span>
          </div>

          {/* Additional KYC info */}
          <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="flex justify-between">
              <span className="font-semibold">{t('collegeCompany')}</span>
              <span className="font-bold text-slate-800">{tenant.collegeOrCompany || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">{t('hometown')}</span>
              <span className="font-bold text-slate-800">{tenant.homeTown || 'Telangana'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">{t('emergencyContact')}:</span>
              <span className="font-bold text-slate-800">{tenant.emergencyPhone}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">{t('bloodGroup')}</span>
              <span className="font-bold text-slate-800">{tenant.bloodGroup || 'O+'}</span>
            </div>
          </div>

          {/* Aadhaar Preview */}
          <div>
            <span className="text-xs font-bold text-slate-700 mb-1.5 block">
              {t('aadhaarPhotos')} ({tenant.aadhaarNumber})
            </span>
            <div className="grid grid-cols-2 gap-2">
              <img
                src={tenant.aadhaarFrontUrl}
                alt="Aadhaar Front"
                className="w-full h-24 object-cover rounded-xl border border-slate-200 shadow-xs"
              />
              <img
                src={tenant.aadhaarBackUrl}
                alt="Aadhaar Back"
                className="w-full h-24 object-cover rounded-xl border border-slate-200 shadow-xs"
              />
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 border-t border-slate-200 space-y-2">
            
            {/* Action 1: Cyberabad Police HawkEye Sheet */}
            <button
              onClick={() => onOpenPoliceCard(tenant.id)}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-black text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>{t('cyberabadPoliceVerification')}</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              {/* Action 2: Preview as Student */}
              <button
                onClick={handlePreviewAsStudent}
                className="py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center gap-1.5 border border-blue-200 transition-colors cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>{t('studentPortalLogin')}</span>
              </button>

              {/* Action 3: Vacate Bed & Settle Deposit */}
              <button
                onClick={() => onOpenVacateModal(tenant.id)}
                className="py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center gap-1.5 border border-rose-200 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('vacateBed')}</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
