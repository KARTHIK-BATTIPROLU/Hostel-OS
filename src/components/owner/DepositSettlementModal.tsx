import React, { useState } from 'react';
import { useHostel } from '../../context/HostelContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatINR } from '../../utils/dueEngine';
import { X, ShieldCheck, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';

interface DepositSettlementModalProps {
  tenantId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const DepositSettlementModal: React.FC<DepositSettlementModalProps> = ({
  tenantId,
  onClose,
  onSuccess
}) => {
  const { getTenantById, getRoomById, getBedById, dues, vacateBed } = useHostel();
  const { language, t } = useLanguage();

  const tenant = getTenantById(tenantId);
  const room = tenant ? getRoomById(tenant.roomId) : undefined;
  const bed = tenant ? getBedById(tenant.bedId) : undefined;

  const originalDeposit = tenant?.securityDeposit || 5000;
  const [maintenanceDeduction, setMaintenanceDeduction] = useState(1000);
  const [notes, setNotes] = useState('');
  const [isSettled, setIsSettled] = useState(false);

  // Check if tenant has any unpaid dues
  const unpaidDues = dues.filter(d => d.tenantId === tenantId && d.status !== 'PAID');
  const unpaidDuesTotal = unpaidDues.reduce((sum, d) => sum + d.amountDue, 0);

  const netRefund = Math.max(0, originalDeposit - maintenanceDeduction - unpaidDuesTotal);

  if (!tenant) return null;

  const handleConfirmVacate = () => {
    const confirmPrompt =
      language === 'te'
        ? `రూమ్ ${room?.roomNumber}, బెడ్ ${bed?.bedLabel} ఖాళీ చేసి, ${tenant.fullName}కు ${formatINR(netRefund)} రీఫండ్ చేయాలని నిర్ధారించాలా?`
        : language === 'hi'
        ? `क्या आप कमरा ${room?.roomNumber}, बेड ${bed?.bedLabel} खाली कर ${tenant.fullName} को ${formatINR(netRefund)} रिफंड करने की पुष्टि करते हैं?`
        : `Confirm vacating Bed ${bed?.bedLabel} (Room ${room?.roomNumber}) and refunding ${formatINR(netRefund)} to ${tenant.fullName}?`;

    if (window.confirm(confirmPrompt)) {
      vacateBed(tenant.id, maintenanceDeduction, notes);
      setIsSettled(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-700 to-red-800 p-4 sm:p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/15">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white m-0">
                {t('settleDeposit')}
              </h3>
              <div className="text-xs text-rose-100 mt-0.5">
                {tenant.fullName} • {t('room')} {room?.roomNumber}, {t('bed')} {bed?.bedLabel}
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

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-4">
          
          {isSettled ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
              <h4 className="text-xl font-black text-slate-900">
                {t('vacateSuccess')}
              </h4>
              <p className="text-sm text-slate-600">
                {t('vacateSuccessSub')}
              </p>
            </div>
          ) : (
            <>
              {/* Tenant Deposit Card */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center text-sm font-bold text-slate-700">
                  <span>{t('securityDeposit')}:</span>
                  <span className="text-base font-black text-slate-900">{formatINR(originalDeposit)}</span>
                </div>

                {/* Maintenance & Painting Deduction */}
                <div className="pt-2 border-t border-slate-200">
                  <div className="flex justify-between items-center text-sm font-bold text-rose-700 mb-1.5">
                    <span>- {t('maintenanceDeduction')}:</span>
                    <span className="font-black text-base">- {formatINR(maintenanceDeduction)}</span>
                  </div>

                  {/* Deduction Quick Chips */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {[500, 1000, 1500, 2000].map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setMaintenanceDeduction(amt)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          maintenanceDeduction === amt
                            ? 'bg-rose-700 text-white shadow-xs'
                            : 'bg-white text-rose-900 border border-rose-200 hover:bg-rose-50'
                        }`}
                      >
                        ₹{amt} {amt === 1000 ? `(${t('standard')})` : ''}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Unpaid dues if any */}
                {unpaidDuesTotal > 0 && (
                  <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-bold text-rose-800">
                    <span className="flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      - {t('unpaidDues')}:
                    </span>
                    <span className="font-black text-base">- {formatINR(unpaidDuesTotal)}</span>
                  </div>
                )}

                {/* Net Refund Calculation Result */}
                <div className="pt-3 border-t-2 border-dashed border-slate-300 flex justify-between items-center">
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 block">
                      {t('netRefundAmount')}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {t('netRefundSub')}
                    </span>
                  </div>
                  <div className="text-2xl font-black text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                    {formatINR(netRefund)}
                  </div>
                </div>
              </div>

              {/* Vacate notes input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('vacateReason')}
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder={t('vacateReasonPlaceholder')}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium"
                />
              </div>

              {/* Big Confirm Button */}
              <button
                type="button"
                onClick={handleConfirmVacate}
                className="w-full h-14 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-black text-sm sm:text-base shadow-lg shadow-rose-900/20 flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
              >
                <span>{t('settleAndVacate')}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </>
          )}

        </div>

      </div>
    </div>
  );
};
