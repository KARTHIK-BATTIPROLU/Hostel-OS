import React, { useState } from 'react';
import { useHostel } from '../../context/HostelContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatINR, formatLocalizedMonth } from '../../utils/dueEngine';
import type { Tenant, RentDue, PaymentMethod } from '../../types/hostel';
import { X, Lock, CheckCircle2, ArrowRight, Loader2, QrCode } from 'lucide-react';

interface RazorpayCheckoutModalProps {
  tenant: Tenant;
  due: RentDue;
  onClose: () => void;
  onSuccess: (paymentId: string) => void;
}

export const RazorpayCheckoutModal: React.FC<RazorpayCheckoutModalProps> = ({
  tenant,
  due,
  onClose,
  onSuccess
}) => {
  const { activeHostel, recordPayment } = useHostel();
  const { language, t } = useLanguage();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('PHONEPE_SOUNDBOX');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsCompleted(true);
      recordPayment(due.id, selectedMethod, due.amountDue);
      setTimeout(() => {
        onSuccess(due.id);
      }, 1200);
    }, 1200);
  };

  const soundboxSubtext =
    language === 'en'
      ? 'Instant Soundbox voice alert & digital receipt'
      : language === 'te'
      ? 'తక్షణ సౌండ్‌బాక్స్ అలర్ట్ & డిజిటల్ రసీదు'
      : 'त्वरित साउंडबॉक्स अलर्ट एवं डिजिटल रसीद';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in zoom-in-95 duration-150">
        
        {/* Razorpay Brand Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 p-4 sm:p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-white text-blue-800 flex items-center justify-center font-black text-base shadow-sm">
              ₹
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black tracking-tight text-white">
                  Razorpay Checkout
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-black bg-amber-400 text-slate-950 uppercase tracking-tight">
                  Test Mode
                </span>
              </div>
              <p className="text-xs text-blue-100 truncate max-w-[200px]">
                {activeHostel.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-4">
          
          {isCompleted ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
              <h4 className="text-xl font-black text-slate-900">
                {t('paymentSuccess')}
              </h4>
              <p className="text-sm font-semibold text-emerald-700">
                {t('soundboxSuccessMsg')}
              </p>
              <div className="text-xs text-slate-500">
                {t('loadingReceipt')}
              </div>
            </div>
          ) : (
            <>
              {/* Order Amount Card */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider">
                    {formatLocalizedMonth(due.monthLabel, language)} {t('agreedRent')}
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {tenant.fullName} ({tenant.phone})
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-blue-900 block">
                    {formatINR(due.amountDue)}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold">
                    {t('secureUpi')}
                  </span>
                </div>
              </div>

              {/* UPI Options */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-700">
                    {t('selectUpiApp')}
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowQr(!showQr)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>{showQr ? t('showApps') : t('showQr')}</span>
                  </button>
                </div>

                {showQr ? (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-2">
                    <div className="w-40 h-40 bg-white p-2 mx-auto rounded-xl border border-slate-300 shadow-xs flex items-center justify-center">
                      <QrCode className="w-36 h-36 text-slate-900" />
                    </div>
                    <p className="text-xs font-bold text-slate-700">
                      {t('scanAnyUpi')}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {t('amountLabel')}: <span className="font-black text-slate-900">{formatINR(due.amountDue)}</span>
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setSelectedMethod('PHONEPE_SOUNDBOX')}
                      className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        selectedMethod === 'PHONEPE_SOUNDBOX'
                          ? 'border-indigo-500 bg-indigo-50/70 ring-2 ring-indigo-400'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-xs">
                          Pe
                        </div>
                        <div>
                          <span className="text-xs font-black text-slate-900 block">
                            PhonePe UPI
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {soundboxSubtext}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-black text-indigo-700">{t('recommended')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedMethod('GPAY_UPI')}
                      className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        selectedMethod === 'GPAY_UPI'
                          ? 'border-blue-500 bg-blue-50/70 ring-2 ring-blue-400'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-xs">
                          G
                        </div>
                        <div>
                          <span className="text-xs font-black text-slate-900 block">
                            Google Pay (GPay UPI)
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {t('instantTransfer')}
                          </span>
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedMethod('PAYTM')}
                      className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        selectedMethod === 'PAYTM'
                          ? 'border-cyan-500 bg-cyan-50/70 ring-2 ring-cyan-400'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-cyan-600 text-white flex items-center justify-center font-black text-xs">
                          Pay
                        </div>
                        <div>
                          <span className="text-xs font-black text-slate-900 block">
                            Paytm UPI / Wallet
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {t('zeroFeeCheckout')}
                          </span>
                        </div>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Security Banner */}
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 py-1">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t('sslEncrypted')}</span>
              </div>

              {/* Action Button */}
              <button
                type="button"
                disabled={isProcessing}
                onClick={handlePay}
                className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black text-base rounded-xl shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{t('processingUpi')}</span>
                  </>
                ) : (
                  <>
                    <span>{formatINR(due.amountDue)} — {t('completeUpi')}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </>
          )}

        </div>

      </div>
    </div>
  );
};
